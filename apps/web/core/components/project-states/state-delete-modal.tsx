/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useState } from "react";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
// Plane imports
import { useTranslation } from "@plane/i18n";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import type { IState } from "@plane/types";
// ui
import { AlertModalCore } from "@plane/ui";
// hooks
import { useProjectState } from "@/hooks/store/use-project-state";

type TStateDeleteModal = {
  isOpen: boolean;
  onClose: () => void;
  data: IState | null;
};

export const StateDeleteModal = observer(function StateDeleteModal(props: TStateDeleteModal) {
  const { isOpen, onClose, data } = props;
  // translation
  const { t } = useTranslation();
  // states
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  // router
  const { workspaceSlug } = useParams();
  const { deleteState } = useProjectState();

  const handleClose = () => {
    onClose();
    setIsDeleteLoading(false);
  };

  const handleDeletion = async () => {
    if (!workspaceSlug || !data) return;

    setIsDeleteLoading(true);

    await deleteState(workspaceSlug.toString(), data.project_id, data.id)
      .then(() => {
        handleClose();
      })
      .catch((err) => {
        if (err.status === 400)
          setToast({
            type: TOAST_TYPE.ERROR,
            title: t("common.error", { defaultValue: "Error!" }),
            message: t("project_settings.states.delete_state.has_work_items", {
              defaultValue:
                "This state contains some work items within it, please move them to some other state to delete this state.",
            }),
          });
        else
          setToast({
            type: TOAST_TYPE.ERROR,
            title: t("common.error", { defaultValue: "Error!" }),
            message: t("project_settings.states.delete_state.failed", {
              defaultValue: "State could not be deleted. Please try again.",
            }),
          });
      })
      .finally(() => {
        setIsDeleteLoading(false);
      });
  };

  return (
    <AlertModalCore
      handleClose={handleClose}
      handleSubmit={handleDeletion}
      isSubmitting={isDeleteLoading}
      isOpen={isOpen}
      title={t("project_settings.states.delete_state.title", { defaultValue: "Delete State" })}
      content={
        <>
          {t("project_settings.states.delete_state.confirmation_prefix", {
            defaultValue: "Are you sure you want to delete state-",
          })}{" "}
          <span className="font-medium text-primary">{data?.name}</span>
          {t("project_settings.states.delete_state.confirmation_suffix", {
            defaultValue:
              "? All of the data related to the state will be permanently removed. This action cannot be undone.",
          })}
        </>
      }
    />
  );
});
