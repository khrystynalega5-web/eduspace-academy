
import { useCallback, useRef } from "react";
import {
    useBeforeUnload,
    useBlocker
} from "react-router";

export function useUnsavedChanges(isDirty) {
    const isSavingRef = useRef(false);

    const blocker = useBlocker(
        useCallback(
            ({ currentLocation, nextLocation }) => {
                return (
                    isDirty &&
                    !isSavingRef.current &&
                    currentLocation.pathname !== nextLocation.pathname
                );
            },
            [isDirty]
        )
    );

    useBeforeUnload(
        useCallback(
            (event) => {
                if (isDirty && !isSavingRef.current) {
                    event.preventDefault();
                    event.returnValue = "";
                }
            },
            [isDirty]
        )
    );

    function allowSaveNavigation() {
        isSavingRef.current = true;
    }

    return {
        blocker,
        allowSaveNavigation
    };
}
