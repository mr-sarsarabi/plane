/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
// plane imports
import { START_OF_THE_WEEK_OPTIONS } from "@plane/constants";
import { useTranslation } from "@plane/i18n";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { EStartOfTheWeek } from "@plane/types";
import { CustomSelect } from "@plane/ui";
// components
import { SettingsControlItem } from "@/components/settings/control-item";
// hooks
import { useUserProfile } from "@/hooks/store/user";

const PERSIAN_DAY_LABELS: Record<number, string> = {
  [EStartOfTheWeek.SATURDAY]: "شنبه (Saturday)",
  [EStartOfTheWeek.SUNDAY]: "یکشنبه (Sunday)",
  [EStartOfTheWeek.MONDAY]: "دوشنبه (Monday)",
  [EStartOfTheWeek.TUESDAY]: "سه‌شنبه (Tuesday)",
  [EStartOfTheWeek.WEDNESDAY]: "چهارشنبه (Wednesday)",
  [EStartOfTheWeek.THURSDAY]: "پنج‌شنبه (Thursday)",
  [EStartOfTheWeek.FRIDAY]: "جمعه (Friday)",
};

const getStartOfWeekLabel = (startOfWeek: EStartOfTheWeek, isPersian?: boolean) => {
  if (isPersian && PERSIAN_DAY_LABELS[startOfWeek]) {
    return PERSIAN_DAY_LABELS[startOfWeek];
  }
  return START_OF_THE_WEEK_OPTIONS.find((option) => option.value === startOfWeek)?.label;
};

export const StartOfWeekPreference = observer(function StartOfWeekPreference(props: {
  option: { title: string; description: string };
}) {
  // hooks
  const { data: userProfile, updateUserProfile } = useUserProfile();
  const { t } = useTranslation();

  const isPersian =
    typeof document !== "undefined" &&
    (document.documentElement.lang === "fa" || document.documentElement.dir === "rtl");

  const effectiveValue =
    userProfile?.start_of_the_week !== undefined && userProfile?.start_of_the_week !== null
      ? userProfile.start_of_the_week
      : isPersian
        ? EStartOfTheWeek.SATURDAY
        : EStartOfTheWeek.SUNDAY;

  const handleStartOfWeekChange = async (val: number) => {
    try {
      await updateUserProfile({ start_of_the_week: val });
      setToast({
        type: TOAST_TYPE.SUCCESS,
        title: t("common.success", { defaultValue: "Success" }),
        message: t("first_day_of_the_week_updated", { defaultValue: "First day of the week updated successfully" }),
      });
    } catch (_error) {
      setToast({
        type: TOAST_TYPE.ERROR,
        title: t("common.error", { defaultValue: "Update failed" }),
        message: t("please_try_again_later", { defaultValue: "Please try again later." }),
      });
    }
  };

  return (
    <SettingsControlItem
      title={props.option.title}
      description={props.option.description}
      control={
        <CustomSelect
          value={effectiveValue}
          label={getStartOfWeekLabel(effectiveValue, isPersian)}
          onChange={handleStartOfWeekChange}
          buttonClassName="border border-subtle-1"
          input
          maxHeight="lg"
          placement="bottom-end"
        >
          <>
            {START_OF_THE_WEEK_OPTIONS.map((day) => (
              <CustomSelect.Option key={day.value} value={day.value}>
                {isPersian ? PERSIAN_DAY_LABELS[day.value] ?? day.label : day.label}
              </CustomSelect.Option>
            ))}
          </>
        </CustomSelect>
      }
    />
  );
});
