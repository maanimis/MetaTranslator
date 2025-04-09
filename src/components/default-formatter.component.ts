import {
  ITranslationFormatter,
  TranslationResult,
} from "../services/translators/interface.translators";

export class DefaultFormatter implements ITranslationFormatter {
  format(result: TranslationResult): string {
    let output = `<b>${result.translation}</b>`;

    return output;
  }
}
