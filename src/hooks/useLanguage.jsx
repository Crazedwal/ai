// src/hooks/useLanguage.jsx
import { useState, createContext, useContext } from "react"

const LanguageContext = createContext()

const translations = {
  en: {
    newChat: "New Chat",
    myAccount: "My Account",
    typeMessage: "Type a message...",
    send: "Send",
    today: "Today",
    yesterday: "Yesterday",
    previous7Days: "Previous 7 Days",
    thinking: "Thinking...",
    language: "Language",
    settings: "Settings"
  },
  es: {
    newChat: "Nuevo Chat",
    myAccount: "Mi Cuenta",
    typeMessage: "Escribe un mensaje...",
    send: "Enviar",
    today: "Hoy",
    yesterday: "Ayer",
    previous7Days: "Últimos 7 Días",
    thinking: "Pensando...",
    language: "Idioma",
    settings: "Configuración"
  },
  fr: {
    newChat: "Nouveau Chat",
    myAccount: "Mon Compte",
    typeMessage: "Tapez un message...",
    send: "Envoyer",
    today: "Aujourd'hui",
    yesterday: "Hier",
    previous7Days: "7 Derniers Jours",
    thinking: "Réflexion...",
    language: "Langue",
    settings: "Paramètres"
  },
  de: {
    newChat: "Neuer Chat",
    myAccount: "Mein Konto",
    typeMessage: "Nachricht eingeben...",
    send: "Senden",
    today: "Heute",
    yesterday: "Gestern",
    previous7Days: "Letzte 7 Tage",
    thinking: "Denke nach...",
    language: "Sprache",
    settings: "Einstellungen"
  },
  zh: {
    newChat: "新对话",
    myAccount: "我的账户",
    typeMessage: "输入消息...",
    send: "发送",
    today: "今天",
    yesterday: "昨天",
    previous7Days: "过去7天",
    thinking: "思考中...",
    language: "语言",
    settings: "设置"
  },
  ja: {
    newChat: "新しいチャット",
    myAccount: "マイアカウント",
    typeMessage: "メッセージを入力...",
    send: "送信",
    today: "今日",
    yesterday: "昨日",
    previous7Days: "過去7日間",
    thinking: "考え中...",
    language: "言語",
    settings: "設定"
  }
}

const languageNames = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  zh: "中文",
  ja: "日本語"
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language")
      if (saved && translations[saved]) return saved
    }
    return "en"
  })

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang)
      localStorage.setItem("language", lang)
    }
  }

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{
      language,
      changeLanguage,
      t,
      availableLanguages: Object.keys(translations),
      languageNames
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
