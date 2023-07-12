import { Stack } from '@mui/material';
import { Collection } from 'types/collection';
import { EnteDrawer } from 'components/EnteDrawer';
import { t } from 'i18next';
import { DialogProps } from '@mui/material';
import Titlebar from 'components/Titlebar';

import AddViewerForm, { ViewerEmailShareOptionsProps } from './AddViewerForm';
import { GalleryContext } from 'pages/gallery';
import { useContext, useState, useEffect } from 'react';
import {
    getLocalCollections,
    shareCollection,
} from 'services/collectionService';
import { handleSharingErrors } from 'utils/error/ui';
import { getData, LS_KEYS } from 'utils/storage/localStorage';
import { getLocalFamilyData } from 'utils/user/family';
import { User } from 'types/user';

interface Iprops {
    collection: Collection;
    open: boolean;
    onClose: () => void;
    onRootClose: () => void;
}

export default function AddViewer({
    open,
    collection,
    onClose,
    onRootClose,
}: Iprops) {
    const handleRootClose = () => {
        onClose();
        onRootClose();
    };

    const handleDrawerClose: DialogProps['onClose'] = (_, reason) => {
        if (reason === 'backdropClick') {
            handleRootClose();
        } else {
            onClose();
        }
    };

    const galleryContext = useContext(GalleryContext);

    const [updatedOptionsList, setUpdatedOptionsList] = useState(['']);
    let updatedList = [];
    useEffect(() => {
        const getUpdatedOptionsList = async () => {
            const ownerUser: User = getData(LS_KEYS.USER);
            const collectionList = getLocalCollections();
            const familyList = getLocalFamilyData();
            const result = await collectionList;
            const emails = result.flatMap((item) => {
                if (item.owner.email && item.owner.id !== ownerUser.id) {
                    return [item.owner.email];
                } else {
                    const shareeEmails = item.sharees.map(
                        (sharee) => sharee.email
                    );
                    return shareeEmails;
                }
            });

            // adding family members
            if (familyList) {
                const family = familyList.members.map((member) => member.email);
                emails.push(...family);
            }

            updatedList = Array.from(new Set(emails));

            const shareeEmailsCollection = collection.sharees.map(
                (sharees) => sharees.email
            );
            const filteredList = updatedList.filter(
                (email) =>
                    !shareeEmailsCollection.includes(email) &&
                    email !== ownerUser.email
            );

            setUpdatedOptionsList(filteredList);
        };

        getUpdatedOptionsList();
    }, []);

    const collectionShare: ViewerEmailShareOptionsProps['callback'] = async (
        emails,
        setFieldError,
        resetForm
    ) => {
        try {
            const user: User = getData(LS_KEYS.USER);

            for (const email of emails) {
                if (email === user.email) {
                    setFieldError(t('SHARE_WITH_SELF'));
                    break;
                } else if (
                    collection?.sharees?.find((value) => value.email === email)
                ) {
                    setFieldError(t('ALREADY_SHARED', { email }));
                    break;
                } else {
                    await shareCollection(collection, email, 'VIEWER');
                    await galleryContext.syncWithRemote(false, true);
                }
            }
            resetForm();
        } catch (e) {
            const errorMessage = handleSharingErrors(e);
            setFieldError(errorMessage);
        }
    };

    return (
        <>
            <EnteDrawer anchor="right" open={open} onClose={handleDrawerClose}>
                <Stack spacing={'4px'} py={'12px'}>
                    <Titlebar
                        onClose={onClose}
                        title={t('ADD_VIEWERS')}
                        onRootClose={handleRootClose}
                        caption={collection.name}
                    />
                    <AddViewerForm
                        onClose={onClose}
                        callback={collectionShare}
                        optionsList={updatedOptionsList}
                        placeholder={t('ENTER_EMAIL')}
                        fieldType="email"
                        buttonText={t('ADD_VIEWERS')}
                        submitButtonProps={{
                            size: 'large',
                            sx: { mt: 1, mb: 2 },
                        }}
                        disableAutoFocus
                    />
                </Stack>
            </EnteDrawer>
        </>
    );
}
