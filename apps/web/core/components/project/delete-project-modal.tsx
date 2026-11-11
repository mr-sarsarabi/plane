/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { AlertTriangle } from "lucide-react";
// Plane imports
import { useTranslation } from "@plane/i18n";
import { Button } from "@plane/propel/button";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import type { IProject } from "@plane/types";
import { Input, EModalPosition, EModalWidth, ModalCore } from "@plane/ui";
// hooks
import { useProject } from "@/hooks/store/use-project";
import { useAppRouter } from "@/hooks/use-app-router";

type DeleteProjectModal = {
  isOpen: boolean;
  project: IProject;
  onClose: () => void;
};

const defaultValues = {
  projectName: "",
  confirmDelete: "",
};

export function DeleteProjectModal(props: DeleteProjectModal) {
  const { isOpen, project, onClose } = props;
  // translation
  const { t } = useTranslation();
  // store hooks
  const { deleteProject } = useProject();
  // router
  const router = useAppRouter();
  const { workspaceSlug, projectId } = useParams();
  // form info
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    watch,
  } = useForm({ defaultValues });

  const canDelete = watch("projectName") === project?.name && watch("confirmDelete") === "delete my project";

  const handleClose = () => {
    const timer = setTimeout(() => {
      reset(defaultValues);
      clearTimeout(timer);
    }, 350);

    onClose();
  };

  const onSubmit = async () => {
    if (!workspaceSlug || !canDelete) return;

    try {
      await deleteProject(workspaceSlug.toString(), project.id);
      if (projectId && projectId.toString() === project.id) router.push(`/${workspaceSlug}/projects`);
      handleClose();
      setToast({
        type: TOAST_TYPE.SUCCESS,
        title: t("common.success", { defaultValue: "Success!" }),
        message: t("project_settings.general.delete_project.modal.success", {
          defaultValue: "Project deleted successfully.",
        }),
      });
    } catch (_error) {
      setToast({
        type: TOAST_TYPE.ERROR,
        title: t("common.error", { defaultValue: "Error!" }),
        message: t("common.something_went_wrong_please_try_again", {
          defaultValue: "Something went wrong. Please try again later.",
        }),
      });
    }
  };

  return (
    <ModalCore isOpen={isOpen} handleClose={handleClose} position={EModalPosition.CENTER} width={EModalWidth.XXL}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-6">
        <div className="flex w-full items-center justify-start gap-6">
          <span className="place-items-center rounded-full bg-danger-subtle p-4">
            <AlertTriangle className="h-6 w-6 text-danger-primary" aria-hidden="true" />
          </span>
          <span className="flex items-center justify-start">
            <h3 className="text-18 font-medium 2xl:text-20">
              {t("project_settings.general.delete_project.modal.title", { defaultValue: "Delete project" })}
            </h3>
          </span>
        </div>
        <span>
          <p className="text-13 leading-7 text-secondary">
            {t("project_settings.general.delete_project.modal.confirmation_prefix", {
              defaultValue: "Are you sure you want to delete project",
            })}{" "}
            <span className="font-semibold break-words">{project?.name}</span>
            {t("project_settings.general.delete_project.modal.confirmation_suffix", {
              defaultValue:
                "? All of the data related to the project will be permanently removed. This action cannot be undone",
            })}
          </p>
        </span>
        <div className="text-secondary">
          <p className="text-13 break-words">
            {t("project_settings.general.delete_project.modal.enter_project_name_prefix", {
              defaultValue: "Enter the project name",
            })}{" "}
            <span className="font-medium text-primary">{project?.name}</span>{" "}
            {t("project_settings.general.delete_project.modal.enter_project_name_suffix", {
              defaultValue: "to continue:",
            })}
          </p>
          <Controller
            control={control}
            name="projectName"
            render={({ field: { value, onChange, ref } }) => (
              <Input
                id="projectName"
                name="projectName"
                type="text"
                value={value}
                onChange={onChange}
                ref={ref}
                hasError={Boolean(errors.projectName)}
                placeholder={t("project_settings.general.delete_project.modal.project_name_placeholder", {
                  defaultValue: "Project name",
                })}
                className="mt-2 w-full"
                autoComplete="off"
              />
            )}
          />
        </div>
        <div className="text-secondary">
          <p className="text-13">
            {t("project_settings.general.delete_project.modal.type_to_confirm_prefix", {
              defaultValue: "To confirm, type",
            })}{" "}
            <span className="font-medium text-primary">delete my project</span>{" "}
            {t("project_settings.general.delete_project.modal.type_to_confirm_suffix", {
              defaultValue: "below:",
            })}
          </p>
          <Controller
            control={control}
            name="confirmDelete"
            render={({ field: { value, onChange, ref } }) => (
              <Input
                id="confirmDelete"
                name="confirmDelete"
                type="text"
                value={value}
                onChange={onChange}
                ref={ref}
                hasError={Boolean(errors.confirmDelete)}
                placeholder={t("project_settings.general.delete_project.modal.confirm_placeholder", {
                  defaultValue: "Enter 'delete my project'",
                })}
                className="mt-2 w-full"
                autoComplete="off"
              />
            )}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="lg" onClick={handleClose}>
            {t("common.cancel", { defaultValue: "Cancel" })}
          </Button>
          <Button variant="error-fill" size="lg" type="submit" disabled={!canDelete} loading={isSubmitting}>
            {isSubmitting
              ? t("project_settings.general.delete_project.modal.deleting", { defaultValue: "Deleting" })
              : t("project_settings.general.delete_project.modal.title", { defaultValue: "Delete project" })}
          </Button>
        </div>
      </form>
    </ModalCore>
  );
}
