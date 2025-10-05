import useLocale from "@/stores/locale.store";
import { en } from "./en";
import { id } from "./id";

export * from "./en";
export * from "./id";

export type Locale = "en" | "id";
export type LocaleKey = keyof typeof en;

const locales = { en, id };

function getNested(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

// Stateless translator
export const t = (
  key: string,
  vars?: Record<string, string | number>,
): string => {
  const currentLocale = useLocale.getState().locale;
  let text = getNested(locales[currentLocale], key);

  if (typeof text !== "string") return key;

  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{{${k}}}`, String(v));
    });
  }

  return text;
};

// Stateful translator hook
export const useT = () => {
  const locale = useLocale((s) => s.locale);

  return (key: string, vars?: Record<string, string | number>) => {
    let text = getNested(locales[locale], key);

    if (typeof text !== "string") return key;

    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(`{{${k}}}`, String(v));
      });
    }

    return text;
  };
};
