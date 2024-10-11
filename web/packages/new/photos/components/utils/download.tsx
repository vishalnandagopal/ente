import type { MiniDialogAttributes } from "@/base/components/MiniDialog";
import { ensureElectron } from "@/base/electron";
import type { AppUpdate } from "@/base/types/ipc";
import { openURL } from "@/new/photos/utils/web";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import { t } from "i18next";

export const downloadAppDialogAttributes = (): MiniDialogAttributes => ({
    title: t("download_app"),
    message: t("download_app_message"),
    continue: {
        text: t("download"),
        action: downloadApp,
    },
});

const downloadApp = () => openURL("https://ente.io/download/desktop");

export const updateReadyToInstallDialogAttributes = ({
    version,
}: AppUpdate): MiniDialogAttributes => ({
    title: t("UPDATE_AVAILABLE"),
    message: t("UPDATE_INSTALLABLE_MESSAGE"),
    icon: <AutoAwesomeOutlined />,
    nonClosable: true,
    continue: {
        text: t("INSTALL_NOW"),
        action: () => ensureElectron().updateAndRestart(),
    },
    cancel: {
        text: t("INSTALL_ON_NEXT_LAUNCH"),
        action: () => ensureElectron().updateOnNextRestart(version),
    },
});

export const updateAvailableForDownloadDialogAttributes = ({
    version,
}: AppUpdate): MiniDialogAttributes => ({
    title: t("UPDATE_AVAILABLE"),
    message: t("UPDATE_AVAILABLE_MESSAGE"),
    icon: <AutoAwesomeOutlined />,
    continue: {
        text: t("DOWNLOAD_AND_INSTALL"),
        action: downloadApp,
    },
    cancel: {
        text: t("IGNORE_THIS_VERSION"),
        action: () => ensureElectron().skipAppUpdate(version),
    },
});