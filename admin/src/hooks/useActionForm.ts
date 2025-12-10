import { useState, useEffect, useCallback } from "react";
import type { HotspotAction, HotspotActionType } from "../types";

interface ActionFormState {
  url: string;
  target: "_self" | "_blank";
  modalTitle: string;
  modalContent: string;
  tooltipText: string;
  callbackName: string;
  callbackParams: string;
  contentType: string;
  entryId: string;
}

const getInitialFormState = (
  action: HotspotAction | undefined,
): ActionFormState => ({
  url: action?.url || "",
  target: action?.target || "_self",
  modalTitle: action?.modalTitle || "",
  modalContent: action?.modalContent || "",
  tooltipText: action?.tooltipText || "",
  callbackName: action?.callbackName || "",
  callbackParams: action?.callbackParams
    ? JSON.stringify(action.callbackParams, null, 2)
    : "",
  contentType: action?.contentType || "",
  entryId: action?.entryId ? String(action.entryId) : "",
});

export const useActionForm = (action: HotspotAction | undefined) => {
  const [actionType, setActionType] = useState<HotspotActionType>(
    action?.type || "none",
  );
  const [formState, setFormState] = useState<ActionFormState>(
    getInitialFormState(action),
  );

  useEffect(() => {
    if (action) {
      setActionType(action.type || "none");
      setFormState(getInitialFormState(action));
    }
  }, [action]);

  const updateActionType = useCallback((newType: HotspotActionType) => {
    setActionType(newType);
  }, []);

  const updateField = useCallback(
    <K extends keyof ActionFormState>(field: K, value: ActionFormState[K]) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const buildAction = useCallback((): HotspotAction | undefined => {
    if (actionType === "none") {
      return undefined;
    }

    const newAction: HotspotAction = {
      type: actionType,
    };

    switch (actionType) {
      case "link":
        newAction.url = formState.url;
        newAction.target = formState.target;
        break;
      case "modal":
        newAction.modalTitle = formState.modalTitle;
        newAction.modalContent = formState.modalContent;
        break;
      case "tooltip":
        newAction.tooltipText = formState.tooltipText;
        break;
      case "callback":
        newAction.callbackName = formState.callbackName;
        try {
          newAction.callbackParams = formState.callbackParams
            ? JSON.parse(formState.callbackParams)
            : undefined;
        } catch {
          newAction.callbackParams = undefined;
        }
        break;
    }

    return newAction;
  }, [actionType, formState]);

  return {
    actionType,
    formState,
    updateActionType,
    updateField,
    buildAction,
  };
};
