/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { TAnalyticsTabsBase } from "@plane/types";
import { ChartXAxisProperty, ChartYAxisMetric } from "@plane/types";

export interface IInsightField {
  key: string;
  i18nKey: string;
  i18nProps?: {
    entity?: string;
    entityPlural?: string;
    prefix?: string;
    suffix?: string;
    [key: string]: unknown;
  };
}

export const ANALYTICS_INSIGHTS_FIELDS: Record<TAnalyticsTabsBase, IInsightField[]> = {
  overview: [
    {
      key: "total_users",
      i18nKey: "workspace_analytics.total",
      i18nProps: {
        entity: "common.users",
      },
    },
    {
      key: "total_admins",
      i18nKey: "workspace_analytics.total",
      i18nProps: {
        entity: "common.admins",
      },
    },
    {
      key: "total_members",
      i18nKey: "workspace_analytics.total",
      i18nProps: {
        entity: "common.members",
      },
    },
    {
      key: "total_guests",
      i18nKey: "workspace_analytics.total",
      i18nProps: {
        entity: "common.guests",
      },
    },
    {
      key: "total_projects",
      i18nKey: "workspace_analytics.total",
      i18nProps: {
        entity: "common.projects",
      },
    },
    {
      key: "total_work_items",
      i18nKey: "workspace_analytics.total",
      i18nProps: {
        entity: "common.work_items",
      },
    },
    {
      key: "total_cycles",
      i18nKey: "workspace_analytics.total",
      i18nProps: {
        entity: "common.cycles",
      },
    },
    {
      key: "total_intake",
      i18nKey: "workspace_analytics.total",
      i18nProps: {
        entity: "sidebar.intake",
      },
    },
  ],
  "work-items": [
    {
      key: "total_work_items",
      i18nKey: "workspace_analytics.total",
    },
    {
      key: "started_work_items",
      i18nKey: "workspace_analytics.started_work_items",
    },
    {
      key: "backlog_work_items",
      i18nKey: "workspace_analytics.backlog_work_items",
    },
    {
      key: "un_started_work_items",
      i18nKey: "workspace_analytics.un_started_work_items",
    },
    {
      key: "completed_work_items",
      i18nKey: "workspace_analytics.completed_work_items",
    },
  ],
};

export const ANALYTICS_DURATION_FILTER_OPTIONS = [
  {
    name: "Yesterday",
    value: "yesterday",
    i18nKey: "workspace_analytics.duration.yesterday",
  },
  {
    name: "Last 7 days",
    value: "last_7_days",
    i18nKey: "workspace_analytics.duration.last_7_days",
  },
  {
    name: "Last 30 days",
    value: "last_30_days",
    i18nKey: "workspace_analytics.duration.last_30_days",
  },
  {
    name: "Last 3 months",
    value: "last_3_months",
    i18nKey: "workspace_analytics.duration.last_3_months",
  },
];

export const ANALYTICS_X_AXIS_VALUES: { value: ChartXAxisProperty; label: string; i18nKey?: string }[] = [
  {
    value: ChartXAxisProperty.STATES,
    label: "State name",
    i18nKey: "workspace_analytics.x_axis.state_name",
  },
  {
    value: ChartXAxisProperty.STATE_GROUPS,
    label: "State group",
    i18nKey: "workspace_analytics.x_axis.state_group",
  },
  {
    value: ChartXAxisProperty.PRIORITY,
    label: "Priority",
    i18nKey: "workspace_analytics.x_axis.priority",
  },
  {
    value: ChartXAxisProperty.LABELS,
    label: "Label",
    i18nKey: "workspace_analytics.x_axis.label",
  },
  {
    value: ChartXAxisProperty.ASSIGNEES,
    label: "Assignee",
    i18nKey: "workspace_analytics.x_axis.assignee",
  },
  {
    value: ChartXAxisProperty.ESTIMATE_POINTS,
    label: "Estimate point",
    i18nKey: "workspace_analytics.x_axis.estimate_point",
  },
  {
    value: ChartXAxisProperty.CYCLES,
    label: "Cycle",
    i18nKey: "workspace_analytics.x_axis.cycle",
  },
  {
    value: ChartXAxisProperty.MODULES,
    label: "Module",
    i18nKey: "workspace_analytics.x_axis.module",
  },
  {
    value: ChartXAxisProperty.COMPLETED_AT,
    label: "Completed date",
    i18nKey: "workspace_analytics.x_axis.completed_date",
  },
  {
    value: ChartXAxisProperty.TARGET_DATE,
    label: "Due date",
    i18nKey: "workspace_analytics.x_axis.due_date",
  },
  {
    value: ChartXAxisProperty.START_DATE,
    label: "Start date",
    i18nKey: "workspace_analytics.x_axis.start_date",
  },
  {
    value: ChartXAxisProperty.CREATED_AT,
    label: "Created date",
    i18nKey: "workspace_analytics.x_axis.created_date",
  },
];

export const ANALYTICS_Y_AXIS_VALUES: { value: ChartYAxisMetric; label: string; i18nKey?: string }[] = [
  {
    value: ChartYAxisMetric.WORK_ITEM_COUNT,
    label: "Work item",
    i18nKey: "workspace_analytics.y_axis.work_item",
  },
  {
    value: ChartYAxisMetric.ESTIMATE_POINT_COUNT,
    label: "Estimate",
    i18nKey: "workspace_analytics.y_axis.estimate",
  },
  {
    value: ChartYAxisMetric.EPIC_WORK_ITEM_COUNT,
    label: "Epic",
    i18nKey: "workspace_analytics.y_axis.epic",
  },
];

export const ANALYTICS_V2_DATE_KEYS = ["completed_at", "target_date", "start_date", "created_at"];
