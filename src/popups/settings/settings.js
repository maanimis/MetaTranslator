class TranslationSettings {
  constructor() {
    this.initElements();
    this.initEventListeners();
    this.loadSettings();
  }

  initElements() {
    // Main elements
    this.closePopupBtn = document.getElementById("closePopup");
    this.popup = document.getElementById("popup");
    this.saveSettingsBtn = document.getElementById("saveSettings");
    this.targetLanguageSelect = document.getElementById("targetLanguage");
    this.radioOptions = document.querySelectorAll(".radio-option");

    // API Token elements
    this.geminiTokenContainer = document.getElementById("geminiTokenContainer");
    this.geminiTokenInput = document.getElementById("geminiToken");
    this.saveGeminiTokenBtn = document.getElementById("saveGeminiToken");
  }

  initEventListeners() {
    // Popup controls
    this.closePopupBtn.addEventListener("click", () => this.togglePopup());
    this.saveSettingsBtn.addEventListener("click", () => this.saveSettings());

    // Language selection change
    this.targetLanguageSelect.addEventListener("change", () => {
      console.log(
        "[Language Selection] Changed to:",
        this.targetLanguageSelect.value,
      );
    });

    // Close popup when clicking outside
    this.popup.addEventListener("click", (e) => {
      if (e.target === this.popup) {
        this.togglePopup();
      }
    });

    // Radio option selection
    this.radioOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const radioInput = option.querySelector('input[type="radio"]');
        const mode = radioInput.value;

        radioInput.checked = true;
        this.radioOptions.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");

        this.toggleTokenContainer(mode);

        console.log("[Translation Mode] Changed to:", mode);
      });
    });

    // Save token buttons
    this.saveGeminiTokenBtn.addEventListener("click", () =>
      this.saveApiToken("gemini", this.geminiTokenInput),
    );
    this.togglePopup();
  }

  loadSettings() {
    const savedLanguage = localStorage.getItem("translationLanguage") || "en";
    const savedMode = localStorage.getItem("translationMode") || "google";

    this.targetLanguageSelect.value = savedLanguage;
    document.querySelector(`input[value="${savedMode}"]`).checked = true;

    // Load API tokens
    this.geminiTokenInput.value = localStorage.getItem("geminiApiToken") || "";

    // Add selected class to the selected option
    this.radioOptions.forEach((option) => {
      if (option.dataset.value === savedMode) {
        option.classList.add("selected");
      } else {
        option.classList.remove("selected");
      }
    });

    // Show the appropriate token container
    this.toggleTokenContainer(savedMode);

    console.log("[Settings Loaded]", {
      language: savedLanguage,
      mode: savedMode,
      tokens: {
        gemini: this.geminiTokenInput.value ? "*****" : "not set",
      },
    });
  }

  togglePopup() {
    this.popup.classList.toggle("active");

    if (this.popup.classList.contains("active")) {
      this.loadSettings();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }

  toggleTokenContainer(mode) {
    // Hide all containers first
    this.geminiTokenContainer.classList.remove("active");

    // Show the selected one
    if (mode === "gemini") {
      this.geminiTokenContainer.classList.add("active");
    }
  }

  saveSettings() {
    const language = this.targetLanguageSelect.value;
    const mode = document.querySelector(
      'input[name="translationMode"]:checked',
    ).value;

    localStorage.setItem("translationLanguage", language);
    localStorage.setItem("translationMode", mode);

    console.log("[Settings Saved]", {
      language: language,
      mode: mode,
      tokens: {
        gemini: this.geminiTokenInput.value ? "*****" : "not set",
      },
    });

    // Show confirmation
    alert(
      `Settings saved!\nLanguage: ${this.targetLanguageSelect.options[this.targetLanguageSelect.selectedIndex].text}\nMode: ${mode}`,
    );

    this.togglePopup();
  }

  saveApiToken(service, tokenInput) {
    const token = tokenInput.value.trim();
    if (token) {
      localStorage.setItem(`${service}ApiToken`, token);
      console.log(`[API Token] ${service} token saved`);
      alert(`${service} API token saved successfully!`);
    } else {
      console.log(`[API Token] ${service} token cleared`);
      localStorage.removeItem(`${service}ApiToken`);
      alert(`${service} API token cleared`);
    }
  }
}

// Initialize the Translation Settings when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new TranslationSettings();
});
