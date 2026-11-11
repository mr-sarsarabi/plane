/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { ReactNode } from "react";
// plane imports
import { useTranslation } from "@plane/i18n";
import type { TNotification } from "@plane/types";
import {
  convertMinutesToHoursMinutesString,
  renderFormattedDate,
  sanitizeCommentForNotification,
  stripAndTruncateHTML,
} from "@plane/utils";
// components
import { LiteTextEditor } from "@/components/editor/lite-text";
import {
  ADDITIONAL_NOTIFICATION_CONTENT_MAP,
  renderAdditionalAction,
  renderAdditionalValue,
  shouldShowConnector,
} from "@/plane-web/components/workspace-notifications/notification-card/content";

// Types
export type TNotificationFieldData = {
  field: string | undefined;
  newValue: string | undefined;
  oldValue: string | undefined;
  verb: string | undefined;
};

export type TNotificationContentDetails = {
  action?: ReactNode;
  value?: ReactNode;
  showConnector?: boolean;
};

export type TNotificationContentHandler = (
  data: TNotificationFieldData,
  renderCommentBox?: boolean,
  t?: (key: string, fallback?: string) => string
) => TNotificationContentDetails | null;

export type TNotificationContentMap = {
  [key: string]: TNotificationContentHandler;
};

// Base notification content map for core fields
export const BASE_NOTIFICATION_CONTENT_MAP: TNotificationContentMap = {
  duplicate: ({ verb }, _renderCommentBox, t) => ({
    action:
      verb === "created"
        ? (t ? t("notification_events.duplicate_created", "marked that this work item is a duplicate of") : "marked that this work item is a duplicate of")
        : (t ? t("notification_events.duplicate_removed", "marked that this work item is not a duplicate") : "marked that this work item is not a duplicate"),
    value: null,
    showConnector: false,
  }),
  assignees: ({ newValue, oldValue }, _renderCommentBox, t) => ({
    action:
      newValue !== ""
        ? (t ? t("notification_events.added_assignee", "added assignee") : "added assignee")
        : (t ? t("notification_events.removed_assignee", "removed assignee") : "removed assignee"),
    value: newValue !== "" ? newValue : oldValue,
    showConnector: false,
  }),
  start_date: ({ newValue }, _renderCommentBox, t) => ({
    action:
      newValue !== ""
        ? (t ? t("notification_events.set_start_date", "set start date") : "set start date")
        : (t ? t("notification_events.removed_start_date", "removed the start date") : "removed the start date"),
    value: renderFormattedDate(newValue),
    showConnector: false,
  }),
  target_date: ({ newValue }, _renderCommentBox, t) => ({
    action:
      newValue !== ""
        ? (t ? t("notification_events.set_due_date", "set due date") : "set due date")
        : (t ? t("notification_events.removed_due_date", "removed the due date") : "removed the due date"),
    value: renderFormattedDate(newValue),
    showConnector: false,
  }),
  labels: ({ newValue, oldValue }, _renderCommentBox, t) => ({
    action:
      newValue !== ""
        ? (t ? t("notification_events.added_label", "added label") : "added label")
        : (t ? t("notification_events.removed_label", "removed label") : "removed label"),
    value: newValue !== "" ? newValue : oldValue,
    showConnector: false,
  }),
  parent: ({ newValue, oldValue }, _renderCommentBox, t) => ({
    action:
      newValue !== ""
        ? (t ? t("notification_events.added_parent", "added parent") : "added parent")
        : (t ? t("notification_events.removed_parent", "removed parent") : "removed parent"),
    value: newValue !== "" ? newValue : oldValue,
    showConnector: false,
  }),
  relates_to: (_data, _renderCommentBox, t) => ({
    action: t ? t("notification_events.relates_to", "marked that this work item is related to") : "marked that this work item is related to",
    value: null,
    showConnector: true,
  }),
  comment: ({ newValue }, renderCommentBox, t) => ({
    action: t ? t("notification_events.commented", "commented") : "commented",
    value: renderCommentBox ? null : sanitizeCommentForNotification(newValue),
    showConnector: false,
  }),
  archived_at: ({ newValue }, _renderCommentBox, t) => ({
    action:
      newValue === "restore"
        ? (t ? t("notification_events.restored_work_item", "restored the work item") : "restored the work item")
        : (t ? t("notification_events.archived_work_item", "archived the work item") : "archived the work item"),
    value: null,
    showConnector: false,
  }),
  None: (_data, _renderCommentBox, t) => ({
    action: null,
    value: t ? t("notification_events.none_value", "the work item and assigned it to you.") : "the work item and assigned it to you.",
    showConnector: false,
  }),
  // Fields below only define value - action falls through to default handler
  attachment: (_data, _renderCommentBox, t) => ({
    action: null,
    value: t ? t("notification_events.attachment_value", "the work item") : "the work item",
    showConnector: true,
  }),
  description: ({ newValue }) => ({
    value: stripAndTruncateHTML(newValue || "", 55),
    showConnector: true,
  }),
  estimate_time: ({ newValue, oldValue }) => ({
    value:
      newValue !== ""
        ? convertMinutesToHoursMinutesString(Number(newValue))
        : convertMinutesToHoursMinutesString(Number(oldValue)),
    showConnector: true,
  }),
};

// Helper to get content details from maps
const getNotificationContentDetails = (
  fieldData: TNotificationFieldData,
  renderCommentBox?: boolean,
  t?: (key: string, fallback?: string) => string
): TNotificationContentDetails | null => {
  const { field } = fieldData;
  if (!field) return null;

  // Check base map first
  const baseHandler = BASE_NOTIFICATION_CONTENT_MAP[field];
  if (baseHandler) {
    return baseHandler(fieldData, renderCommentBox, t);
  }

  // Check additional map from plane-web (EE extensions)
  const additionalHandler = ADDITIONAL_NOTIFICATION_CONTENT_MAP[field];
  if (additionalHandler) {
    return additionalHandler(fieldData);
  }

  return null;
};

export function NotificationContent({
  notification,
  workspaceId,
  workspaceSlug,
  projectId,
  renderCommentBox = false,
}: {
  notification: TNotification;
  workspaceId: string;
  workspaceSlug: string;
  projectId: string;
  renderCommentBox?: boolean;
}) {
  const { t } = useTranslation();
  const { data, triggered_by_details: triggeredBy } = notification;
  const notificationField = data?.issue_activity.field;
  const newValue = data?.issue_activity.new_value;
  const oldValue = data?.issue_activity.old_value;
  const verb = data?.issue_activity.verb;

  const fieldData: TNotificationFieldData = {
    field: notificationField,
    newValue,
    oldValue,
    verb,
  };

  const renderTriggerName = () => (
    <span className="font-medium text-primary">
      {triggeredBy?.is_bot ? triggeredBy.first_name : triggeredBy?.display_name}{" "}
    </span>
  );

  // Get content details from map
  const contentDetails = getNotificationContentDetails(fieldData, renderCommentBox, t);

  // Render action - use map value if defined, otherwise fall through to default handler
  // Note: undefined = fall through to default, null = explicitly no action text
  const renderAction = (): ReactNode => {
    if (!notificationField) return "";
    // Check if action is explicitly defined in map (including null)
    if (contentDetails && "action" in contentDetails) {
      if (typeof contentDetails.action === "string") {
        return t(contentDetails.action, contentDetails.action);
      }
      return contentDetails.action;
    }
    // Fallback to default action handler for fields not in map or without action defined
    return renderAdditionalAction(notificationField, verb);
  };

  // Render value - use map value if defined, otherwise fall through to default handler
  const renderValue = (): ReactNode => {
    // Check if value is explicitly defined in map
    if (contentDetails && "value" in contentDetails) {
      if (typeof contentDetails.value === "string") {
        return t(contentDetails.value, contentDetails.value);
      }
      return contentDetails.value;
    }
    // Fallback to default value handler for fields not in map or without value defined
    return renderAdditionalValue(notificationField, newValue, oldValue);
  };

  // Determine if connector should be shown - prefer map value, fallback to function
  const showConnector =
    contentDetails?.showConnector !== undefined ? contentDetails.showConnector : shouldShowConnector(notificationField);

  return (
    <>
      {renderTriggerName()}
      <span className="text-tertiary">{renderAction()} </span>
      {verb !== "deleted" && (
        <>
          {showConnector && <span className="text-tertiary">{t("notification_events.to", "to")} </span>}
          <span className="font-medium text-primary">{renderValue()}</span>
          {notificationField === "comment" && renderCommentBox && (
            <div className="origin-left rtl:origin-right scale-75">
              <LiteTextEditor
                editable={false}
                id=""
                initialValue={newValue ?? ""}
                workspaceId={workspaceId}
                workspaceSlug={workspaceSlug}
                projectId={projectId}
                displayConfig={{
                  fontSize: "small-font",
                }}
              />
            </div>
          )}
          {"."}
        </>
      )}
    </>
  );
}
