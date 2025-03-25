import {
  ITranslationFormatter,
  TranslationResult,
} from "../services/translators/interface.translators";

export class GoogleTranslationFormatter implements ITranslationFormatter {
  format(result: TranslationResult): string {
    let output = `<b>${result.translation}</b>`;

    if (result.dictionary && result.dictionary.length > 0) {
      output += "\n\n";

      result.dictionary.forEach((entry) => {
        const posTitle = entry.pos.charAt(0).toUpperCase() + entry.pos.slice(1);
        output += `<b>${posTitle}:</b> ${entry.terms.join(", ")}\n`;
      });
    }

    return output;
  }
}
