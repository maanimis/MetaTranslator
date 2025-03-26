// ==UserScript==
// @name          MetaTranslator
// @name:en       MetaTranslator
// @namespace     Violentmonkey Scripts
// @version       0.2.6
// @author        maanimis <maanimis.dev@gmail.com>
// @source        https://github.com/maanimis/MetaTranslator
// @license       MIT
// @match         *://*/*
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_deleteValue
// @grant         GM_addValueChangeListener
// @grant         GM_registerMenuCommand
// @grant         GM_unregisterMenuCommand
// @grant         GM_xmlhttpRequest
// @run-at        document-end
// @inject-into   content
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/components/tooltip.component.ts
class DOMTooltip {
    element;
    constructor() {
        this.element = document.createElement("div");
        this.setupStyles();
        document.body.appendChild(this.element);
    }
    setupStyles() {
        Object.assign(this.element.style, {
            position: "absolute",
            background: "rgba(0, 0, 0, 0.85)",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "14px",
            pointerEvents: "none",
            zIndex: "9999",
            maxWidth: "350px",
            lineHeight: "1.4",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            display: "none",
            transition: "opacity 0.2s ease",
            whiteSpace: "pre-line",
            direction: "rtl",
            textAlign: "right",
        });
    }
    show(text, x, y) {
        this.element.innerHTML = text;
        this.element.style.top = `${y}px`;
        this.element.style.left = `${x}px`;
        this.element.style.display = "block";
        this.element.style.opacity = "1";
    }
    hide() {
        this.element.style.opacity = "0";
        this.element.style.display = "none";
    }
}

;// ./src/components/translation-formatter.component.ts
class GoogleTranslationFormatter {
    format(result) {
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

;// ./src/utils/sanitize-filename.util.ts
const INVALID_CHARS = /[<>:"/\\|?*]/g;
const RESERVED_NAMES = new Set([
    "CON",
    "PRN",
    "AUX",
    "NUL",
    "COM1",
    "COM2",
    "COM3",
    "COM4",
    "COM5",
    "COM6",
    "COM7",
    "COM8",
    "COM9",
    "LPT1",
    "LPT2",
    "LPT3",
    "LPT4",
    "LPT5",
    "LPT6",
    "LPT7",
    "LPT8",
    "LPT9",
]);
function sanitizeWindowsName(name, options = { isFolder: true }) {
    if (!name.trim()) {
        return null;
    }
    let sanitized = name
        .replace(INVALID_CHARS, "_")
        .trim()
        .replace(/[. ]+$/, "");
    if (RESERVED_NAMES.has(sanitized.toUpperCase())) {
        sanitized += "_safe";
    }
    if (options.appendTimestamp) {
        const timestamp = Date.now();
        sanitized = options.isFolder
            ? `${sanitized}_${timestamp}`
            : sanitized.replace(/(\.[^.]+)?$/, `_${timestamp}$1`);
    }
    return sanitized;
}

;// ./src/utils/debouncer.util.ts
class Debouncer {
    timer = null;
    debounce(callback, delay) {
        return () => {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = window.setTimeout(callback, delay);
        };
    }
}

;// ./src/utils/index.ts




;// ./src/services/http-client/http-client.service.ts
class HTTPClient {
    static DEFAULT_HEADERS = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
    };
    static async get(url, headers = {}) {
        return this.request("GET", url, { headers });
    }
    static async post(url, data, headers = {}) {
        return this.request("POST", url, {
            headers: { ...this.DEFAULT_HEADERS, ...headers },
            body: JSON.stringify(data),
        });
    }
    static async request(method, url, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                data: options.body,
                headers: options.headers || {},
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.responseText);
                    }
                    else {
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                },
                onerror: () => reject(new Error("Network request failed")),
                ontimeout: () => reject(new Error("Request timed out")),
                onabort: () => reject(new Error("Request was aborted")),
            });
        });
    }
}

;// ./src/services/http-client/index.ts




;// ./src/services/translators/apibots/google/translator.google.ts

class GoogleTranslator {
    sourceLang;
    getTargetLang;
    constructor(sourceLang, getTargetLang) {
        this.sourceLang = sourceLang;
        this.getTargetLang = getTargetLang;
    }
    async translate(text) {
        const url = this.buildTranslateUrl(text, this.getTargetLang);
        try {
            const responseText = await HTTPClient.get(url);
            if (typeof responseText !== "string") {
                throw new Error("Invalid response type");
            }
            return this.parseTranslationResponse(responseText);
        }
        catch (error) {
            throw new Error(`Translation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    buildTranslateUrl(text, targetLang) {
        return (`https://translate.googleapis.com/translate_a/single?` +
            `client=gtx&sl=${this.sourceLang}&tl=${targetLang}` +
            `&dt=t&dt=bd&dj=1&q=${encodeURIComponent(text)}`);
    }
    parseTranslationResponse(responseText) {
        try {
            const data = JSON.parse(responseText);
            const translated = data.sentences?.map((s) => s.trans).join("") ||
                "No translation found.";
            const result = {
                translation: translated,
            };
            if (data.dict && Array.isArray(data.dict)) {
                result.dictionary = data.dict.map((entry) => ({
                    pos: entry.pos,
                    terms: entry.terms || [],
                }));
            }
            return result;
        }
        catch (error) {
            throw new Error("Failed to parse translation response");
        }
    }
}

;// ./src/services/storage/cache.storage.ts
class SessionStorageService {
    get(key, defaultValue) {
        const item = sessionStorage.getItem(key);
        return item !== null ? JSON.parse(item) : defaultValue;
    }
    set(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
    remove(key) {
        sessionStorage.removeItem(key);
    }
    onChange(key, callback) {
        const storageHandler = (event) => {
            if (event.storageArea === sessionStorage && event.key === key) {
                const newValue = event.newValue ? JSON.parse(event.newValue) : null;
                const oldValue = event.oldValue ? JSON.parse(event.oldValue) : null;
                callback(newValue, oldValue);
            }
        };
        window.addEventListener("storage", storageHandler);
    }
}

;// ./src/services/storage/storage.service.ts
class GMStorageService {
    get(key, defaultValue) {
        return GM_getValue(key, defaultValue);
    }
    set(key, value) {
        GM_setValue(key, value);
    }
    remove(key) {
        GM_deleteValue(key);
    }
    onChange(key, callback) {
        GM_addValueChangeListener(key, callback);
    }
}

;// ./src/services/storage/handler.storage.ts


class StorageHandler {
    sessionStorageService;
    gmStorageService;
    constructor(sessionStorageService, gmStorageService) {
        this.sessionStorageService = sessionStorageService;
        this.gmStorageService = gmStorageService;
    }
    get(key, defaultValue) {
        const sessionValue = this.sessionStorageService.get(key, defaultValue);
        if (sessionValue !== undefined && sessionValue !== null) {
            return sessionValue;
        }
        return this.gmStorageService.get(key, defaultValue);
    }
    set(key, value) {
        this.sessionStorageService.set(key, value);
        this.gmStorageService.set(key, value);
    }
    remove(key) {
        this.sessionStorageService.remove(key);
        this.gmStorageService.remove(key);
    }
    onChange(key, callback) {
        this.sessionStorageService.onChange(key, callback);
        this.gmStorageService.onChange(key, callback);
    }
}
const sessionStorageService = new SessionStorageService();
const gmStorageService = new GMStorageService();
const storageHandler = new StorageHandler(sessionStorageService, gmStorageService);

;// ./src/services/storage/index.ts




;// ./src/services/translators/language-storage.service.ts

class LocalStorageLanguageService {
    getTargetLanguage() {
        return storageHandler.get("targetLang", "fa");
    }
    setTargetLanguage(lang) {
        storageHandler.set("targetLang", lang);
    }
}

;// ./src/services/translators/selection.service.ts
class BrowserSelectionService {
    TOOLTIP_OFFSET_Y = 40;
    getSelectedText() {
        const selection = window.getSelection();
        const text = selection?.toString().trim();
        return text || null;
    }
    getSelectionPosition() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0)
            return null;
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        return {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY - this.TOOLTIP_OFFSET_Y,
        };
    }
}

;// ./src/services/translators/apibots/index.ts







class TranslationHandler {
    tooltip;
    translator;
    formatter;
    selectionService;
    languageStorage;
    DEBOUNCE_DELAY = 300;
    constructor(tooltip, translator, formatter, selectionService, languageStorage) {
        this.tooltip = tooltip;
        this.translator = translator;
        this.formatter = formatter;
        this.selectionService = selectionService;
        this.languageStorage = languageStorage;
        this.initialize();
    }
    initialize() {
        const debouncer = new Debouncer();
        document.addEventListener("mouseup", debouncer.debounce(() => this.onTextSelect(), this.DEBOUNCE_DELAY));
        document.addEventListener("mousedown", () => this.tooltip.hide());
        this.registerLanguageMenu();
    }
    async onTextSelect() {
        const selectedText = this.selectionService.getSelectedText();
        if (!selectedText) {
            this.tooltip.hide();
            return;
        }
        const position = this.selectionService.getSelectionPosition();
        if (!position)
            return;
        const cacheResult = sessionStorageService.get(selectedText, null);
        if (cacheResult) {
            this.tooltip.show(cacheResult, position.x, position.y);
            return;
        }
        try {
            const translationResult = await this.translator.translate(selectedText);
            const formattedText = this.formatter.format(translationResult);
            sessionStorageService.set(selectedText, formattedText);
            this.tooltip.show(formattedText, position.x, position.y);
        }
        catch (error) {
            this.tooltip.show(`Error: ${error}`, position.x, position.y);
        }
    }
    registerLanguageMenu() {
        GM_registerMenuCommand("Set Target Language", () => {
            const currentLang = this.languageStorage.getTargetLanguage();
            const input = prompt("Enter target language (fa,en,fr,de,...):", currentLang);
            if (input) {
                this.languageStorage.setTargetLanguage(input);
            }
        });
    }
}
function initApiTranslation() {
    const languageStorage = new LocalStorageLanguageService();
    const targetLang = languageStorage.getTargetLanguage();
    const selectionService = new BrowserSelectionService();
    const tooltip = new DOMTooltip();
    const translator = new GoogleTranslator("auto", targetLang);
    const formatter = new GoogleTranslationFormatter();
    return new TranslationHandler(tooltip, translator, formatter, selectionService, languageStorage);
}


;// ./src/index.ts

async function main() {
    initApiTranslation();
}
main().catch((e) => {
    console.log(e);
});

/******/ })()
;