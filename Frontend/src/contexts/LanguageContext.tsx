"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import esTranslations from "@/locales/es.json";
import enTranslations from "@/locales/en.json";
import ptTranslations from "@/locales/pt.json";
import frTranslations from "@/locales/fr.json";

type Translations = typeof esTranslations;

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const translations: Record<string, Translations> = {
  es: esTranslations,
  en: enTranslations,
  pt: ptTranslations,
  fr: frTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>("es");

  useEffect(() => {
    // Cargar idioma guardado en localStorage
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("preferredLanguage");
      if (savedLanguage && translations[savedLanguage]) {
        setLanguageState(savedLanguage);
      }
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
      if (typeof window !== "undefined") {
        localStorage.setItem("preferredLanguage", lang);
      }
    }
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Retornar la key si no se encuentra la traducción
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
