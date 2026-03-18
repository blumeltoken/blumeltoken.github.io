import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          "app_title": "Blümel Token Control Center",
          // WindowManager
          "commands": "Command Center",
          "notes": "Notes",
          "JSON_PARSE_ERROR": "JSON Parse Error",
          "NULL_VIEW": "Null View",

          // NotesView
          "notes.todo": "todo.md",
          "notes.readme": "readme.md",
          "blumenwiese": "Blumenwiese",

          // Blumenwiese
          "blumenErnten": "Harvest Flowers",
          "halloWelt": "Hello World",
          "halloBlumel": "Hello Bluemel",

          // ConfigView
          "APPLY_CHANGES": "[ APPLY CHANGES ]",

          // CommandCenter
          "Advanced": "Advanced",
          "Settings": "Settings",
          "Links": "Links",
          "Wallet": "Wallet",
          "Disconnected": "[ DISCONNECTED ]",
          "Production": "PRODUCTION",
          "Test_Networks": "TEST_NETWORKS",
          "Disconnect": "DISCONNECT",
          "Connect": "CONNECT",
          "Preset_Actions": "Preset Actions",
          "Claim_Gas_And_Greet": "CLAIM BLUMEL AND GREET",
          "Faucet_Request": "FAUCET REQUEST",
          "Build_Community": "BUILD COMMUNITY",
          "ABI_Input": "ABI Input",
          "Paste_ABI_JSON": "PASTE ABI JSON",
          "Parse": "PARSE",
          "Run": "RUN",
          "Refresh": "REFRESH",
          "Claimed": "CLAIMED",
          "Already_Received": "ALREADY RECEIVED",
          "expected_output": "EXPECTED OUTPUT",

          // Validation
          "CHECKSUM_ERR": "INVALID_CHECKSUM_OR_ADDRESS",
          "NUM_ERR": "INVALID_NUMBER_FORMAT",
          "NOT_UINT": "INVALID_UINT_FORMAT",
          "Invalid ABI": "Invalid ABI"
        },
      },
      de: {
        translation: {
          "app_title": "Blümel Token Schaltzentrale",
          // WindowManager
          "commands": "Schaltzentrale",
          "notes": "Notizen",
          "JSON_PARSE_ERROR": "JSON-Parse-Fehler",
          "NULL_VIEW": "Leere Ansicht",

          // NotesView
          "notes.todo": "todo.md",
          "notes.readme": "readme.md",
          "blumenwiese": "Blumenwiese",

          // Blumenwiese
          "blumenErnten": "Blumen Ernten",
          "halloWelt": "Hallo Welt",
          "halloBlumel": "Hallo Blümel",

          // ConfigView
          "APPLY_CHANGES": "[ ÄNDERUNGEN ÜBERNEHMEN ]",

          // CommandCenter
          "Advanced": "Erweitert",
          "Settings": "Einstellungen",
          "Links": "Links",
          "Wallet": "Wallet",
          "Disconnected": "[ GETRENNT ]",
          "Production": "PRODUKTION",
          "Test_Networks": "TESTNETZE",
          "Disconnect": "TRENNEN",
          "Connect": "VERBINDEN",
          "Preset_Actions": "Voreingestellte Aktionen",
          "Claim_Gas_And_Greet": "BLÜMEL ABSTAUBEN UND GRÜSSEN",
          "Faucet_Request": "FAUCET ANFRAGE",
          "Build_Community": "COMMUNITY AUFBAUEN",
          "ABI_Input": "ABI-Eingabe",
          "Paste_ABI_JSON": "ABI-JSON EINFÜGEN",
          "Parse": "PARSEN",
          "Run": "AUSFÜHREN",
          "Refresh": "AKTUALISIEREN",
          "Claimed": "BEANSPRUCHT",
          "Already_Received": "BEREITS ERHALTEN",
          "expected_output": "ERWARTETER ERTRAG",

          // Validation
          "CHECKSUM_ERR": "UNGÜLTIGE_PRÜFSUMME_ODER_ADRESSE",
          "NUM_ERR": "UNGÜLTIGES_ZAHLENFORMAT",
          "NOT_UINT": "UNGÜLTIGES_UINT_FORMAT",
          "Invalid ABI": "Ungültiges ABI"
        },
      },
    },
  });

export default i18n;
