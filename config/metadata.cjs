const {
  author,
  dependencies,
  repository,
  version,
  description,
} = require("../package.json");

module.exports = {
  name: {
    $: "MetaTranslator",
    fa: "مترجم متا",
  },
  namespace: "Violentmonkey Scripts",
  version: version,
  author: author,
  source: repository.url,
  license: "MIT",
  match: ["*://*/*"],
  description,
  grant: [
    "GM_setValue",
    "GM_getValue",
    "GM_deleteValue",
    "GM_addValueChangeListener",
    "GM_registerMenuCommand",
    "GM_unregisterMenuCommand",
    "GM_xmlhttpRequest",
    "GM_addStyle",
    "GM_getResourceText",
  ],
  icon: "https://www.google.com/s2/favicons?sz=64&domain=translate.google.com",
  require: [
    "https://update.greasyfork.org/scripts/530526/1558038/ProgressUI-Module.js",
  ],
  resource: [
    // 'popup_css  https://raw.githubusercontent.com/maanimis/MetaTranslator/refs/heads/develop/src/pages/popup.css',
  ],
  connect: [],
  "run-at": "document-end",
  "inject-into": "content",
  downloadURL:
    "https://github.com/maanimis/MetaTranslator/releases/latest/download/index.prod.user.js",
  updateURL:
    "https://github.com/maanimis/MetaTranslator/releases/latest/download/index.prod.user.js",
};
