/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { EStartOfTheWeek } from "@plane/types";
import type { TIssue } from "@plane/types";
import { DAYS_LIST, MONTHS_LIST } from "@/constants/calendar";

export const handleDragDrop = async (
  issueId: string,
  sourceDate: string,
  destinationDate: string,
  workspaceSlug: string | undefined,
  projectId: string | undefined,
  updateIssue?: (projectId: string, issueId: string, data: Partial<TIssue>) => Promise<void>
) => {
  if (!workspaceSlug || !projectId || !updateIssue) return;

  if (sourceDate === destinationDate) return;

  const updatedIssue = {
    id: issueId,
    target_date: destinationDate,
  };

  return await updateIssue(projectId, updatedIssue.id, updatedIssue);
};

export const getEffectiveStartOfWeek = (
  startOfWeekPref: EStartOfTheWeek | undefined,
  isPersian: boolean
): EStartOfTheWeek => {
  if (isPersian) {
    return startOfWeekPref === undefined || startOfWeekPref === EStartOfTheWeek.SUNDAY
      ? EStartOfTheWeek.SATURDAY
      : startOfWeekPref;
  }
  return startOfWeekPref ?? EStartOfTheWeek.SUNDAY;
};

export const isCalendarWeekend = (day: number | EStartOfTheWeek, isPersian: boolean): boolean => {
  if (isPersian) {
    return day === EStartOfTheWeek.FRIDAY || day === 5;
  }
  return day === EStartOfTheWeek.SUNDAY || day === EStartOfTheWeek.SATURDAY || day === 0 || day === 6;
};

const PERSIAN_MONTH_NAMES = [
  "ژانویه",
  "فوریه",
  "مارس",
  "آوریل",
  "مه",
  "ژوئن",
  "ژوئیه",
  "اوت",
  "سپتامبر",
  "اکتبر",
  "نوامبر",
  "دسامبر",
];

const PERSIAN_DAY_NAMES: Record<number, { title: string; shortTitle: string }> = {
  [EStartOfTheWeek.SUNDAY]: { title: "یکشنبه", shortTitle: "یکشنبه" },
  [EStartOfTheWeek.MONDAY]: { title: "دوشنبه", shortTitle: "دوشنبه" },
  [EStartOfTheWeek.TUESDAY]: { title: "سه‌شنبه", shortTitle: "سه‌شنبه" },
  [EStartOfTheWeek.WEDNESDAY]: { title: "چهارشنبه", shortTitle: "چهارشنبه" },
  [EStartOfTheWeek.THURSDAY]: { title: "پنج‌شنبه", shortTitle: "پنج‌شنبه" },
  [EStartOfTheWeek.FRIDAY]: { title: "جمعه", shortTitle: "جمعه" },
  [EStartOfTheWeek.SATURDAY]: { title: "شنبه", shortTitle: "شنبه" },
};

export const getLocalizedMonth = (
  monthNumber: number,
  locale: string = "en",
  isShort: boolean = false,
  t?: (key: string) => string
): string => {
  if (t) {
    const key = `calendar.months.${monthNumber}.${isShort ? "short" : "long"}`;
    const translated = t(key);
    if (translated && translated !== key) return translated;
  }

  if (locale === "fa") {
    return PERSIAN_MONTH_NAMES[monthNumber - 1] ?? MONTHS_LIST[monthNumber]?.title ?? "";
  }

  try {
    const date = new Date(2026, monthNumber - 1, 1);
    return new Intl.DateTimeFormat(locale || "en-US", { month: isShort ? "short" : "long" }).format(date);
  } catch {
    return isShort ? MONTHS_LIST[monthNumber]?.shortTitle ?? "" : MONTHS_LIST[monthNumber]?.title ?? "";
  }
};

export const getLocalizedDay = (
  dayValue: EStartOfTheWeek | number,
  locale: string = "en",
  isShort: boolean = false,
  t?: (key: string) => string
): string => {
  if (t) {
    const key = `calendar.days.${dayValue}.${isShort ? "short" : "long"}`;
    const translated = t(key);
    if (translated && translated !== key) return translated;
  }

  if (locale === "fa") {
    const dayData = PERSIAN_DAY_NAMES[dayValue];
    return isShort ? dayData?.shortTitle ?? "" : dayData?.title ?? "";
  }

  try {
    // 2026-01-04 is a Sunday (day 0)
    const date = new Date(2026, 0, 4 + Number(dayValue));
    return new Intl.DateTimeFormat(locale || "en-US", { weekday: isShort ? "short" : "long" }).format(date);
  } catch {
    const dayIndex = Object.values(DAYS_LIST).findIndex((d) => d.value === dayValue);
    if (dayIndex >= 0) {
      const item = Object.values(DAYS_LIST)[dayIndex];
      return isShort ? item.shortTitle : item.title;
    }
    return "";
  }
};
