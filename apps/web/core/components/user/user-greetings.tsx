/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

// plane types
import { useTranslation } from "@plane/i18n";
// hooks
import type { IUser } from "@plane/types";
import { useCurrentTime } from "@/hooks/use-current-time";
// types

export interface IUserGreetingsView {
  user: IUser;
}

export function UserGreetingsView(props: IUserGreetingsView) {
  const { user } = props;
  // current time hook
  const { currentTime } = useCurrentTime();
  // store hooks
  const { t, currentLocale } = useTranslation();

  const isPersian = currentLocale === "fa";
  const dateLocale = isPersian ? "fa-IR-u-ca-persian" : currentLocale || "en-US";

  const currentHour = currentTime ? new Date(currentTime).getHours() : new Date().getHours();
  const greeting = currentHour < 12 ? "morning" : currentHour < 18 ? "afternoon" : "evening";

  const date = new Intl.DateTimeFormat(dateLocale, {
    month: "short",
    day: "numeric",
  }).format(currentTime);

  const weekDay = new Intl.DateTimeFormat(dateLocale, {
    weekday: "long",
  }).format(currentTime);

  const timeString = new Intl.DateTimeFormat(dateLocale, {
    ...(user?.user_timezone ? { timeZone: user.user_timezone } : {}),
    hour12: false, // Use 24-hour format
    hour: "2-digit",
    minute: "2-digit",
  }).format(currentTime);

  const userName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");

  return (
    <div className="my-6 flex flex-col items-center">
      <h2 className="text-center text-20 font-semibold">
        {isPersian ? (
          <>
            {t(greeting)}
            {userName ? `، ${userName}` : ""}
          </>
        ) : (
          <>
            {t("good")} {t(greeting)}
            {userName ? `, ${userName}` : ""}
          </>
        )}
      </h2>
      <h5 className="flex items-center gap-2 font-medium text-placeholder">
        <div>{greeting === "morning" ? "🌤️" : greeting === "afternoon" ? "🌥️" : "🌙️"}</div>
        <div>
          {isPersian ? `${weekDay}، ${date}، ${timeString}` : `${weekDay}, ${date} ${timeString}`}
        </div>
      </h5>
    </div>
  );
}
