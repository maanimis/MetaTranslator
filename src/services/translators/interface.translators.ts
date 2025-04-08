import { DictionaryEntry } from "./apibots/interfaces.apibots";

export interface ITranslatorService {
  translate(text: string): Promise<string>;
}

export interface ILanguageStorage {
  getSourceLanguage(): string;
  getTargetLanguage(): string;
  setTargetLanguage(lang: string): void;
}

export interface TranslationResult {
  translation: string;
  dictionary?: DictionaryEntry[];
}

export interface ITranslator {
  translate(text: string): Promise<TranslationResult>;
}

export interface ITranslationFormatter {
  format(result: TranslationResult): string;
}
