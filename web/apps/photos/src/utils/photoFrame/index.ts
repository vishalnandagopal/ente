import type { SelectionContext } from "@/new/photos/components/gallery";
import type { GalleryBarMode } from "@/new/photos/components/gallery/reducer";
import { SetSelectedState } from "types/gallery";

export const handleSelectCreator =
    (
        setSelected: SetSelectedState,
        mode: GalleryBarMode | undefined,
        activeCollectionID: number,
        activePersonID: string | undefined,
        setRangeStart?,
    ) =>
    (id: number, isOwnFile: boolean, index?: number) =>
    (checked: boolean) => {
        if (typeof index !== "undefined") {
            if (checked) {
                setRangeStart(index);
            } else {
                setRangeStart(undefined);
            }
        }
        setSelected((selected) => {
            if (!mode) {
                // Retain older behavior for non-gallery call sites.
                if (selected.collectionID !== activeCollectionID) {
                    selected = {
                        ownCount: 0,
                        count: 0,
                        collectionID: 0,
                        context: undefined,
                    };
                }
            } else if (!selected.context) {
                // Gallery will specify a mode, but a fresh selection starts off
                // without a context, so fill it in with the current context.
                selected = {
                    ...selected,
                    context:
                        mode == "people"
                            ? { mode, personID: activePersonID! }
                            : {
                                  mode,
                                  collectionID: activeCollectionID!,
                              },
                };
            } else {
                // Both mode and context are defined.
                if (selected.context.mode != mode) {
                    // Clear selection if mode has changed.
                    selected = {
                        ownCount: 0,
                        count: 0,
                        collectionID: 0,
                        context:
                            mode == "people"
                                ? { mode, personID: activePersonID! }
                                : {
                                      mode,
                                      collectionID: activeCollectionID!,
                                  },
                    };
                } else {
                    if (selected.context?.mode == "people") {
                        if (selected.context.personID != activePersonID) {
                            // Clear selection if person has changed.
                            selected = {
                                ownCount: 0,
                                count: 0,
                                collectionID: 0,
                                context: {
                                    mode: selected.context?.mode,
                                    personID: activePersonID!,
                                },
                            };
                        }
                    } else {
                        if (
                            selected.context.collectionID != activeCollectionID
                        ) {
                            // Clear selection if collection has changed.
                            selected = {
                                ownCount: 0,
                                count: 0,
                                collectionID: 0,
                                context: {
                                    mode: selected.context?.mode,
                                    collectionID: activeCollectionID!,
                                },
                            };
                        }
                    }
                }
            }

            const newContext: SelectionContext | undefined = !mode
                ? undefined
                : mode == "people"
                  ? { mode, personID: activePersonID! }
                  : { mode, collectionID: activeCollectionID! };

            const handleCounterChange = (count: number) => {
                if (selected[id] === checked) {
                    return count;
                }
                if (checked) {
                    return count + 1;
                } else {
                    return count - 1;
                }
            };

            const handleAllCounterChange = () => {
                if (isOwnFile) {
                    return {
                        ownCount: handleCounterChange(selected.ownCount),
                        count: handleCounterChange(selected.count),
                    };
                } else {
                    return {
                        count: handleCounterChange(selected.count),
                    };
                }
            };
            return {
                ...selected,
                [id]: checked,
                collectionID: activeCollectionID,
                context: newContext,
                ...handleAllCounterChange(),
            };
        });
    };
