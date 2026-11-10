import {
  Bug, CarFront, CloudSnow, Coffee, Fan, Flame, Footprints, GlassWater, Glasses, Hand, Heater, Lamp, Leaf,
  LifeBuoy, Lightbulb, Mountain, MountainSnow, Refrigerator, Shell, Smartphone, Snowflake, Sofa, Sparkle,
  Speaker, Sun, Tent, TreePalm, Umbrella, Volleyball, Wind, Package, type LucideIcon,
} from 'lucide-react';

export const ICONES: Record<string, LucideIcon> = {
  Bug, CarFront, CloudSnow, Coffee, Fan, Flame, Footprints, GlassWater, Glasses, Hand, Heater, Lamp, Leaf,
  LifeBuoy, Lightbulb, Mountain, MountainSnow, Refrigerator, Shell, Smartphone, Snowflake, Sofa, Sparkle,
  Speaker, Sun, Tent, TreePalm, Umbrella, Volleyball, Wind,
};

export const iconeDe = (nom: string): LucideIcon => ICONES[nom] ?? Package;

/** Couleur de fond des illustrations, par catégorie. */
export const COULEUR_CATEGORIE: Record<string, string> = {
  kits: '#ffffff',
  // été
  plage: '#ffe08a',
  chaleur: '#c4e7f6',
  eau: '#93dbe6',
  soleil: '#ffc9ae',
  'soiree-ete': '#cfcaf3',
  // hiver
  maison: '#f6d5cb',
  dehors: '#cfe0f3',
  voiture: '#dde3ea',
  neige: '#e3eefa',
  cosy: '#f3e2b8',
};
