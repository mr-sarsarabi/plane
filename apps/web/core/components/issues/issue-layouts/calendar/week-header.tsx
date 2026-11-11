/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
import { useTranslation } from "@plane/i18n";
import { cn, getOrderedDays } from "@plane/utils";
import { DAYS_LIST } from "@/constants/calendar";
// helpers
import { getEffectiveStartOfWeek, isCalendarWeekend, getLocalizedDay } from "./utils";
// hooks
import { useUserProfile } from "@/hooks/store/user";

type Props = {
  isLoading: boolean;
  showWeekends: boolean;
};

export const CalendarWeekHeader = observer(function CalendarWeekHeader(props: Props) {
  const { isLoading, showWeekends } = props;
  // hooks
  const { t, currentLocale } = useTranslation();
  const isPersian = currentLocale === "fa";
  const { data } = useUserProfile();
  const startOfWeek = getEffectiveStartOfWeek(data?.start_of_the_week, isPersian);

  // derived
  const localizedDays = Object.values(DAYS_LIST).map((day) => ({
    ...day,
    shortTitle: getLocalizedDay(day.value, currentLocale, true, t),
    title: getLocalizedDay(day.value, currentLocale, false, t),
  }));

  const orderedDays = getOrderedDays(localizedDays, (item: { value: number }) => item.value, startOfWeek);

  return (
    <div
      className={cn(
        "relative sticky top-0 z-[1] grid divide-subtle-1 text-13 font-medium md:divide-x-[0.5px] rtl:divide-x-reverse",
        showWeekends ? "grid-cols-7" : isPersian ? "grid-cols-6" : "grid-cols-5"
      )}
    >
      {isLoading && (
        <div className="absolute h-[1.5px] w-3/4 animate-[bar-loader_2s_linear_infinite] bg-accent-primary" />
      )}
      {orderedDays.map((day) => {
        if (!showWeekends && isCalendarWeekend(day.value, isPersian))
          return null;

        return (
          <div key={day.value} className="flex h-11 items-center justify-center bg-layer-1 px-4 md:justify-end">
            {day.shortTitle}
          </div>
        );
      })}
    </div>
  );
});
