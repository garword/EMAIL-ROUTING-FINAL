"use client";

import { Button } from "@/components/ui/button";
import { Language } from "@/lib/translations";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
      <Globe className="w-4 h-4 ml-2 text-gray-600 dark:text-gray-400" />
      <Button
        variant={currentLanguage === "id" ? "default" : "ghost"}
        size="sm"
        className="h-8 px-2"
        onClick={() => onLanguageChange("id")}
      >
        ID
      </Button>
      <Button
        variant={currentLanguage === "en" ? "default" : "ghost"}
        size="sm"
        className="h-8 px-2"
        onClick={() => onLanguageChange("en")}
      >
        EN
      </Button>
    </div>
  );
}
