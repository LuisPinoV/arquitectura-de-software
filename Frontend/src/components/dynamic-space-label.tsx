"use client"

import React from 'react'
import { useUserProfile } from '@/hooks/use-user'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DynamicSpaceLabel({ template }: { template: string }) {
  const profile = useUserProfile() as any;
  const { t } = useLanguage();
  
  const space = profile?.spaceName ?? 'Boxes';
  const spaceLower = (space || 'Boxes').toLowerCase();
  const spaceCapital = space;
  const spaceUpper = (space || 'Boxes').toUpperCase();
  
  // Primero traducir si es una clave i18n
  let translatedTemplate = template;
  if (template.includes("dashboard.") || template.includes("nav.") || template.includes("common.")) {
    translatedTemplate = t(template);
  }
  
  const replaced = translatedTemplate
    .replace(/Boxes/g, spaceCapital)
    .replace(/boxes/g, spaceLower)
    .replace(/Box/g, spaceCapital)
    .replace(/box/g, spaceLower)
    .replace(/BOX/g, spaceUpper);
  return <>{replaced}</>;
}
