/**
 * A3Y Celebrations - Canonical Theme Sections & Alias Mapping
 * 
 * Maps navigation links, accordion triggers, and legacy route hashes
 * to the 4 canonical themes on the Decorations page:
 * - 'ceremonies' (Sacred Ceremonies & Mandaps)
 * - 'milestones' (Milestone Celebrations & Receptions)
 * - 'florals' (Botanical Architecture & Torans)
 * - 'ambient' (Ambient Illumination & Canopies)
 */

export type ThemeSectionId = 'ceremonies' | 'milestones' | 'florals' | 'ambient';

export const THEME_ALIAS_MAP: Record<string, ThemeSectionId> = {
  // Canonical IDs
  ceremonies: 'ceremonies',
  milestones: 'milestones',
  florals: 'florals',
  ambient: 'ambient',

  // Route & Accordion Aliases
  wedding: 'ceremonies',
  weddings: 'ceremonies',
  ceremony: 'ceremonies',
  mandap: 'ceremonies',

  birthday: 'milestones',
  birthdays: 'milestones',
  milestone: 'milestones',
  reception: 'milestones',

  flower: 'florals',
  flowers: 'florals',
  floral: 'florals',
  botanical: 'florals',
  toran: 'florals',

  spatial: 'ambient',
  canopy: 'ambient',
  balloon: 'milestones',
  balloons: 'milestones',
  lights: 'ambient',
  illumination: 'ambient',
};

/**
 * Resolves any incoming hash string to its canonical theme section ID.
 */
export function resolveThemeSectionId(rawHash: string): ThemeSectionId {
  const clean = rawHash.replace('#', '').toLowerCase().trim();
  return THEME_ALIAS_MAP[clean] || 'ceremonies';
}
