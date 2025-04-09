import { HTTPClient } from "../../../http-client";
import {
  ILanguageStorage,
  ITranslator,
  TranslationResult,
} from "../../interface.translators";

export class GoogleTranslator implements ITranslator {
  constructor(private languageStorage: ILanguageStorage) {}

  async translate(text: string): Promise<TranslationResult> {
    const url = this.buildTranslateUrl(text);

    try {
      const responseText = await HTTPClient.get(url);
      if (typeof responseText !== "string") {
        throw new Error("Invalid response type");
      }

      return this.parseTranslationResponse(responseText);
    } catch (error) {
      throw new Error(
        `Translation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private buildTranslateUrl(text: string): string {
    const targetLang = this.languageStorage.getTargetLanguage();
    const sourceLang = this.languageStorage.getSourceLanguage();
    const url =
      `https://translate.googleapis.com/translate_a/single?` +
      `client=gtx&sl=${sourceLang}&tl=${targetLang}` +
      `&dt=t&dt=bd&dj=1&q=${encodeURIComponent(text)}`;
    return url;
  }

  private parseTranslationResponse(responseText: string): TranslationResult {
    try {
      const data = JSON.parse(responseText);

      const translated =
        data.sentences?.map((s: any) => s.trans).join("") ||
        "No translation found.";

      const result: TranslationResult = {
        translation: translated,
      };

      // Add dictionary entries if available
      if (data.dict && Array.isArray(data.dict)) {
        result.dictionary = data.dict.map((entry: any) => ({
          pos: entry.pos,
          terms: entry.terms || [],
        }));
      }

      return result;
    } catch (error) {
      throw new Error("Failed to parse translation response");
    }
  }
}
