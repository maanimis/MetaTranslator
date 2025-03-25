const {
  author,
  dependencies,
  repository,
  version,
} = require("../package.json");

module.exports = {
  name: {
    $: "MetaTranslator",
    en: "MetaTranslator",
  },
  namespace: "Violentmonkey Scripts",
  version: version,
  author: author,
  source: repository.url,
  'license': 'MIT',
  match: ["*://*/*"],
  grant: [
    "GM_setValue",
    "GM_getValue",
    "GM_deleteValue",
    "GM_addValueChangeListener",
    "GM_registerMenuCommand",
    "GM_unregisterMenuCommand",
    "GM_xmlhttpRequest",
  ],
  require: [
    'https://update.greasyfork.org/scripts/530648/1558616/FileDownloader-Module.js',
    'https://update.greasyfork.org/scripts/530526/1558038/ProgressUI-Module.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js'
  ],
  connect: [],
  "run-at": "document-end",
};
