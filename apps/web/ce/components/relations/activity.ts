/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { TIssueActivity } from "@plane/types";

export const getRelationActivityContent = (
  activity: TIssueActivity | undefined,
  t?: (key: string, defaultValue?: string) => string
): string | undefined => {
  if (!activity) return;

  const translate = (key: string, def: string) => (t ? t(key, def) : def);

  switch (activity.field) {
    case "blocking":
      return activity.old_value === ""
        ? `${translate("marked_blocking", "marked this work item is blocking work item")} `
        : `${translate("removed_blocking", "removed the blocking work item")} `;
    case "blocked_by":
      return activity.old_value === ""
        ? `${translate("marked_blocked_by", "marked this work item is being blocked by")} `
        : `${translate("removed_blocked_by", "removed this work item being blocked by work item")} `;
    case "duplicate":
      return activity.old_value === ""
        ? `${translate("marked_duplicate", "marked this work item as duplicate of")} `
        : `${translate("removed_duplicate", "removed this work item as a duplicate of")} `;
    case "relates_to":
      return activity.old_value === ""
        ? `${translate("marked_relates_to", "marked that this work item relates to")} `
        : `${translate("removed_relates_to", "removed the relation from")} `;
  }

  return;
};
