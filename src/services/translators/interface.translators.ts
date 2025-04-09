export interface ITranslatorService {
  translate(text: string): Promise<string>;
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

export interface ITranslationHandler {
  setupListeners(): void;
  registerLanguageMenu(): void;
  handleTextSelection(): Promise<void>;
  showTooltip(content: string): boolean;
}

export interface DictionaryEntry {
  pos: string;
  terms: string[];
}

export interface ISelectionService {
  getSelectedText(): string | null;
  getSelectionPosition(): { x: number; y: number } | null;
}
