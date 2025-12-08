"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Languages, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};

const availableLanguages: Language[] = [
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
];

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setLanguage(languageCode); // Actualizar el contexto global

    const lang = availableLanguages.find(l => l.code === languageCode);
    
    toast.success(t("settings.languageChanged"), {
      description: `${t("settings.languageChangedTo")} ${lang?.nativeName}`,
      duration: 3000,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Languages className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">{t("settings.language")}</CardTitle>
          <CardDescription>
            {t("settings.selectLanguage")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedLanguage}
            onValueChange={handleLanguageChange}
            className="space-y-3"
          >
            {availableLanguages.map((lang) => (
              <div
                key={lang.code}
                className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent cursor-pointer transition-colors"
                onClick={() => handleLanguageChange(lang.code)}
              >
                <RadioGroupItem value={lang.code} id={lang.code} />
                <Label
                  htmlFor={lang.code}
                  className="flex-1 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{lang.flag}</span>
                    <div>
                      <p className="font-semibold">{lang.nativeName}</p>
                      <p className="text-sm text-muted-foreground">{lang.name}</p>
                    </div>
                  </div>
                  {selectedLanguage === lang.code && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>{t("common.note")}:</strong> {t("settings.changesApplyImmediately")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
