export interface DictionaryEntry {
  pos: string;
  terms: string[];
}

export interface ISelectionService {
  getSelectedText(): string | null;
  getSelectionPosition(): { x: number; y: number } | null;
}
