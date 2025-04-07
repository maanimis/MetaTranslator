import { registerMenuCommand } from "./services/menu";
import { initApiTranslation } from "./services/translators/apibots";

async function main() {
  const translationHandler = initApiTranslation();

  registerMenuCommand("Translate Selected Text", () =>
    translationHandler.onTextSelect(),
  );
}

main().catch((e) => {
  console.log(e);
});
