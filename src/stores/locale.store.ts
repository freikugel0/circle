import type { Locale } from "@/locales";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type LocaleState = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const useLocale = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (l) => {
        set({ locale: l });
      },
    }),
    {
      name: "locale-store-content",
    },
  ),
);

export default useLocale;
