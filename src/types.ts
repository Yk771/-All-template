export interface ProductVariant {
  name: string; // e.g. "Color" or "Size"
  values: string[];
}

export interface SelectedVariant {
  [key: string]: string;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  summary: string;
  images: string[];
  variants: ProductVariant[];
  badges: string[];
  specs: { label: string; value: string }[];
  tags: string[];
  inStock: boolean;
  inventoryCount: number;
  customField?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedVariant: SelectedVariant;
  quantity: number;
  customText?: string;
}

export type SectionType =
  | 'announcement'
  | 'header'
  | 'hero'
  | 'product-showcase'
  | 'featured-collection'
  | 'rich-text'
  | 'features-grid'
  | 'testimonials'
  | 'newsletter'
  | 'footer';

export interface ShopifySection {
  id: string;
  type: SectionType;
  enabled: boolean;
  name: string;
  settings: {
    [key: string]: any;
  };
}

export interface ThemeSettings {
  primaryColor: string;
  backgroundColor: string;
  cardBackgroundColor: string;
  textColor: string;
  textColorSecondary: string;
  accentColor: string;
  buttonRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  cardRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fontFamily: 'sans' | 'serif' | 'mono';
  uppercaseButtons: boolean;
  showBorders: boolean;
  borderWidth: number;
}

export type ThemePreset = 'dawn' | 'prestige' | 'sense' | 'craft';

export interface ShopifyTheme {
  id: ThemePreset;
  name: string;
  description: string;
  settings: ThemeSettings;
}
