import { initApiTranslation } from "./services/translators/apibots";

async function main() {
  initApiTranslation();
}

main().catch((e) => {
  console.log(e);
});
