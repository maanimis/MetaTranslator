import {
  ITranslationFormatter,
  TranslationResult,
} from "../services/translators/interface.translators";
import debug from "debug";

const log = debug("app:formatter:default");

export class DefaultFormatter implements ITranslationFormatter {
  format(result: TranslationResult): string {
    let output = `<b>${result.translation}</b>`;

    log(output);
    return output;
  }
}
