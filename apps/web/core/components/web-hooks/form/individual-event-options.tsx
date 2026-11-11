/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useTranslation } from "@plane/i18n";
import type { IWebhook } from "@plane/types";
import { Checkbox } from "@plane/ui";

export const INDIVIDUAL_WEBHOOK_OPTIONS: {
  key: keyof IWebhook;
  label: string;
  description: string;
  i18n_label: string;
  i18n_description: string;
}[] = [
  {
    key: "project",
    label: "Projects",
    description: "Project created, updated, or deleted",
    i18n_label: "workspace_settings.settings.webhooks.events.project.title",
    i18n_description: "workspace_settings.settings.webhooks.events.project.description",
  },
  {
    key: "cycle",
    label: "Cycles",
    description: "Cycle created, updated, or deleted",
    i18n_label: "workspace_settings.settings.webhooks.events.cycle.title",
    i18n_description: "workspace_settings.settings.webhooks.events.cycle.description",
  },
  {
    key: "issue",
    label: "Work items",
    description: "Work item created, updated, deleted, added to a cycle or module",
    i18n_label: "workspace_settings.settings.webhooks.events.issue.title",
    i18n_description: "workspace_settings.settings.webhooks.events.issue.description",
  },
  {
    key: "module",
    label: "Modules",
    description: "Module created, updated, or deleted",
    i18n_label: "workspace_settings.settings.webhooks.events.module.title",
    i18n_description: "workspace_settings.settings.webhooks.events.module.description",
  },
  {
    key: "issue_comment",
    label: "Work item comments",
    description: "Comment posted, updated, or deleted",
    i18n_label: "workspace_settings.settings.webhooks.events.issue_comment.title",
    i18n_description: "workspace_settings.settings.webhooks.events.issue_comment.description",
  },
];

type Props = {
  control: Control<IWebhook, any>;
};

export function WebhookIndividualEventOptions({ control }: Props) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 px-6 lg:grid-cols-2">
      {INDIVIDUAL_WEBHOOK_OPTIONS.map((option) => (
        <Controller
          key={option.key}
          control={control}
          name={option.key}
          render={({ field: { onChange, value } }) => (
            <div>
              <div className="flex items-center gap-2">
                <Checkbox id={option.key} onChange={() => onChange(!value)} checked={value === true} />
                <label className="text-13" htmlFor={option.key}>
                  {t(option.i18n_label, option.label)}
                </label>
              </div>
              <p className="mt-0.5 ms-6 text-11 text-tertiary">{t(option.i18n_description, option.description)}</p>
            </div>
          )}
        />
      ))}
    </div>
  );
}
