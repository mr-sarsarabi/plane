/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import React from "react";
import { observer } from "mobx-react";
import Link from "next/link";
import { Globe } from "lucide-react";
import { AUTH_TRACKER_ELEMENTS } from "@plane/constants";
import { useTranslation, setLanguage } from "@plane/i18n";
import { PlaneLockup } from "@plane/propel/icons";
import { PageHead } from "@/components/core/page-title";
import { EAuthModes } from "@/helpers/authentication.helper";
import { useInstance } from "@/hooks/store/use-instance";

const authContentMap = {
  [EAuthModes.SIGN_IN]: {
    pageTitle: "auth.common.login",
    text: "auth.common.new_to_plane",
    linkText: "auth.common.create_account",
    linkHref: "/sign-up",
  },
  [EAuthModes.SIGN_UP]: {
    pageTitle: "auth.common.create_account",
    text: "auth.common.already_have_an_account",
    linkText: "auth.common.login",
    linkHref: "/sign-in",
  },
};

type AuthHeaderProps = {
  type: EAuthModes;
};

export const AuthHeader = observer(function AuthHeader({ type }: AuthHeaderProps) {
  const { t } = useTranslation();
  // store
  const { config } = useInstance();
  // derived values
  const enableSignUpConfig = config?.enable_signup ?? false;

  return (
    <AuthHeaderBase
      pageTitle={t(authContentMap[type].pageTitle)}
      additionalAction={
        enableSignUpConfig && (
          <div className="flex flex-col items-end text-center text-13 font-medium text-tertiary sm:flex-row sm:items-center sm:gap-2">
            <span className="text-body-sm-regular text-tertiary">{t(authContentMap[type].text)}</span>
            <Link
              data-ph-element={AUTH_TRACKER_ELEMENTS.NAVIGATE_TO_SIGN_UP}
              href={authContentMap[type].linkHref}
              className="text-body-sm-semibold text-accent-primary hover:underline"
            >
              {t(authContentMap[type].linkText)}
            </Link>
          </div>
        )
      }
    />
  );
});

type TAuthHeaderBase = {
  pageTitle: string;
  additionalAction?: React.ReactNode;
};

export function AuthHeaderBase(props: TAuthHeaderBase) {
  const { pageTitle, additionalAction } = props;
  const { currentLocale } = useTranslation();
  const currentLang = currentLocale || "en";
  const isPersian = currentLang.startsWith("fa");

  const handleToggleLanguage = async () => {
    const nextLang = isPersian ? "en" : "fa";
    await setLanguage(nextLang);
  };

  return (
    <>
      <PageHead title={pageTitle + " - Plane"} />
      <div className="sticky top-0 flex w-full flex-shrink-0 items-center justify-between gap-6">
        <Link href="/">
          <PlaneLockup height={20} width={95} className="text-primary" />
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleLanguage}
            className="flex items-center gap-1.5 rounded-md border border-subtle bg-surface-1 px-2.5 py-1 text-12 font-medium text-secondary shadow-sm transition-colors hover:bg-layer-1 hover:text-primary"
            title={isPersian ? "Switch to English" : "تغییر زبان به فارسی"}
          >
            <Globe className="size-3.5 text-tertiary" />
            <span>{isPersian ? "English" : "فارسی"}</span>
          </button>
          {additionalAction}
        </div>
      </div>
    </>
  );
}
