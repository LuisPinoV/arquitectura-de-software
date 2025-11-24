"use client"

import React from 'react'
import { useUserProfile } from '@/hooks/use-user'

export default function DynamicSpaceLabel({ template }: { template: string }) {
  const profile = useUserProfile() as any;
  const space = profile?.spaceName ?? 'Boxes';
  const spaceLower = (space || 'Boxes').toLowerCase();
  const spaceCapital = space;
  const spaceUpper = (space || 'Boxes').toUpperCase();
  const replaced = template
    .replace(/Boxes/g, spaceCapital)
    .replace(/boxes/g, spaceLower)
    .replace(/Box/g, spaceCapital)
    .replace(/box/g, spaceLower)
    .replace(/BOX/g, spaceUpper);
  return <>{replaced}</>;
}
