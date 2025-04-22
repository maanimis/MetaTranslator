import { TranslationSettings } from "../popups/settings/settings.popup";
import { YouTube } from "./youtube.target";

export const Targets = {
  youtube() {
    YouTube.init();
  },
  metatranslator() {
    new TranslationSettings().togglePopup();
  },
} as const;

export type TargetKey = keyof typeof Targets;

export function isValidTargetKey(key: string): key is TargetKey {
  return key in Targets;
}
