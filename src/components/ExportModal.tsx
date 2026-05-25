import { useState } from 'react';
import { X, Code, Copy, Check, Download, Info, CheckCircle, Folder, FolderOpen, FileCode, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { ShopifySection, ThemeSettings, ThemePreset } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: ShopifySection[];
  themeSettings: ThemeSettings;
  preset: ThemePreset;
}

interface ShopifyFile {
  path: string;
  category: 'templates' | 'sections' | 'assets' | 'config' | 'layout';
  name: string;
  content: string;
  description: string;
}

export default function ExportModal({ isOpen, onClose, sections, themeSettings, preset }: ExportModalProps) {
  const [copied, setCopied] = useState(false);
  const [exportMode, setExportMode] = useState<'existing' | 'new'>('existing');
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({
    templates: true,
    sections: true,
    assets: true,
    config: true,
    layout: true,
  });

  const enabledSections = sections.filter(sec => sec.enabled);

  // Helper to map section types depending on export tab
  const getMappedType = (type: string): string => {
    if (exportMode === 'new') return type;
    switch (type) {
      case 'announcement': return 'header-announcements';
      case 'header': return 'header';
      case 'hero': return 'hero';
      case 'product-showcase': return 'featured-product';
      case 'featured-collection': return 'product-list';
      case 'footer': return 'footer';
      case 'features-grid':
      case 'testimonials':
      case 'newsletter':
      case 'rich-text':
        return 'custom-liquid';
      default:
        return 'custom-liquid';
    }
  };

  const getFiles = (): ShopifyFile[] => {
    const files: ShopifyFile[] = [];

    const getRadiusNumber = (radius: string): number => {
      switch (radius) {
        case 'none': return 0;
        case 'sm': return 4;
        case 'md': return 8;
        case 'lg': return 12;
        case 'xl': return 16;
        case 'full': return 24;
        default: return 8;
      }
    };
    const buttonRadiusNum = getRadiusNumber(themeSettings.buttonRadius);

    // --- TEMPLATES ---
    if (exportMode === 'existing') {
      // Generate standard index.json to replace/merge with the main home page
      const indexJsonValue = {
        name: `Pagesmith Home Preset - ${preset}`,
        sections: sections.reduce((acc, sec) => {
          // EXCLUDE header, footer, and announcement to prevent Shopify "Section ... not supported on index templates" error
          if (sec.enabled && sec.type !== 'announcement' && sec.type !== 'header' && sec.type !== 'footer') {
            const mappedType = getMappedType(sec.type);
            acc[sec.id] = {
              type: mappedType,
              settings: {
                ...sec.settings,
                theme_primary_color: themeSettings.primaryColor,
                theme_bg_color: themeSettings.backgroundColor,
                theme_text_color: themeSettings.textColor,
                theme_border_radius: themeSettings.buttonRadius,
              },
            };
          }
          return acc;
        }, {} as any),
        order: sections.filter((s) => s.enabled && s.type !== 'announcement' && s.type !== 'header' && s.type !== 'footer').map((s) => s.id),
      };

      files.push({
        path: 'templates/index.json',
        category: 'templates',
        name: 'index.json',
        content: JSON.stringify(indexJsonValue, null, 2),
        description: 'Sélectionnez TOUT le contenu de votre fichier existant d’accueil « templates/index.json » de votre thème, et remplacez-le par ce JSON. ASTUCE ERREUR : Si Shopify affiche l’erreur « Section id announcement_bar must exist in order », conservez vos blocs "announcement_bar", "header" et "footer" existants dans votre fichier d’origine, et ajoutez simplement nos autres ID de sections dans le dictionnaire "sections" et l’ordre "order".'
      });

      // Generate standard product.json for Product pages using existing sections
      const productJsonValue = {
        name: `Pagesmith Product Design - ${preset}`,
        sections: sections.reduce((acc, sec) => {
          if (sec.enabled && sec.type !== 'announcement' && sec.type !== 'header' && sec.type !== 'footer') {
            const mappedType = getMappedType(sec.type);
            acc[sec.id] = {
              type: mappedType,
              settings: {
                ...sec.settings,
                theme_primary_color: themeSettings.primaryColor,
                theme_bg_color: themeSettings.backgroundColor,
                theme_text_color: themeSettings.textColor,
                theme_border_radius: themeSettings.buttonRadius,
              },
            };
          }
          return acc;
        }, {} as any),
        order: sections.filter((s) => s.enabled && s.type !== 'announcement' && s.type !== 'header' && s.type !== 'footer').map((s) => s.id),
      };

      files.push({
        path: 'templates/product.json',
        category: 'templates',
        name: 'product.json',
        content: JSON.stringify(productJsonValue, null, 2),
        description: 'Remplacer le contenu de votre fichier existant « templates/product.json » par ce code si vous souhaitez appliquer la configuration de vos blocs produits (hors en-têtes et pieds de page).'
      });
    } else {
      // Mode Nouveaux Fichiers
      const shopifyJsonValue = {
        name: `pagesmith-product-template-${preset}`,
        wrapper: "div.shopify-section-group",
        sections: sections.reduce((acc, sec) => {
          if (sec.enabled && sec.type !== 'announcement' && sec.type !== 'header' && sec.type !== 'footer') {
            acc[sec.id] = {
              type: sec.type,
              settings: {
                ...sec.settings,
                theme_primary_color: themeSettings.primaryColor,
                theme_bg_color: themeSettings.backgroundColor,
                theme_text_color: themeSettings.textColor,
                theme_border_radius: themeSettings.buttonRadius,
              },
            };
          }
          return acc;
        }, {} as any),
        order: sections.filter((s) => s.enabled && s.type !== 'announcement' && s.type !== 'header' && s.type !== 'footer').map((s) => s.id),
      };
      
      files.push({
        path: 'templates/product-pagesmith.json',
        category: 'templates',
        name: 'product-pagesmith.json',
        content: JSON.stringify(shopifyJsonValue, null, 2),
        description: 'Créez ce fichier dans le dossier « templates » (ex. templates/product-pagesmith.json) de votre thème Shopify pour définir la disposition de la page produit.'
      });
    }

    // --- SECTIONS ---
    enabledSections.forEach(sec => {
      let content = '';
      const mappedType = getMappedType(sec.type);
      
      const description = exportMode === 'existing'
        ? `Remplacez INTEGRALEMENT le contenu de votre fichier existant « sections/${mappedType}.liquid » par ce code. De cette façon, aucun nouveau fichier n'est à créer, résolvant immédiatement votre erreur Shopify de sauvegarde.`
        : `Créez obligatoirement un fichier nommé « ${sec.type}.liquid » dans votre dossier « sections » pour rendre la section active.`;

      switch (sec.type) {
        case 'announcement':
          content = `{% comment %}
  Section Shopify : Barre d'annonce Pagesmith (Remplacement dans ${mappedType}.liquid)
{% endcomment %}
<div class="pagesmith-announcement" style="
  background-color: {{ section.settings.backgroundColor | default: '${sec.settings.backgroundColor || themeSettings.primaryColor}' }};
  color: {{ section.settings.textColor | default: '${sec.settings.textColor || "#ffffff"}' }};
  text-align: center;
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
">
  <div style="display: flex; justify-content: center; align-items: center; gap: 8px;">
    <span>{{ section.settings.text }}</span>
    {% if section.settings.link_text != blank %}
      <a href="{{ section.settings.link }}" style="color: inherit; text-decoration: underline; font-weight: 700;">
        {{ section.settings.link_text }}
      </a>
    {% endif %}
  </div>
</div>

{% schema %}
{
  "name": "PageSmith Announcement",
  "settings": [
    {
      "type": "text",
      "id": "text",
      "label": "Announcement Text",
      "default": "${(sec.settings.text || 'Garantie à vie & Livraison offerte dès 80€').replace(/"/g, '\\"')}"
    },
    {
      "type": "text",
      "id": "link_text",
      "label": "Link Text",
      "default": "${(sec.settings.linkText || '').replace(/"/g, '\\"')}"
    },
    {
      "type": "url",
      "id": "link",
      "label": "Link Link"
    },
    {
      "type": "color",
      "id": "backgroundColor",
      "label": "Background Color",
      "default": "${sec.settings.backgroundColor || themeSettings.primaryColor}"
    },
    {
      "type": "color",
      "id": "textColor",
      "label": "Text Color",
      "default": "${sec.settings.textColor || '#ffffff'}"
    }
  ],
  "presets": [
    {
      "name": "PageSmith Announcement"
    }
  ]
}
{% endschema %}`;
          break;

        case 'header':
          content = `{% comment %}
  Section Shopify : En-tête Pagesmith (Remplacement dans ${mappedType}.liquid)
{% endcomment %}
<header class="pagesmith-header" style="
  background-color: ${themeSettings.backgroundColor};
  color: ${themeSettings.textColor};
  padding: 16px 24px;
  border-bottom: 1px solid rgba(0,0,0,0.08);
">
  <div style="display: flex; justify-content: space-between; align-items: center; max-w: 1200px; margin: 0 auto; width: 100%;">
    <div class="logo" style="font-weight: 800; font-size: 16px; tracking: 0.1em; text-transform: uppercase;">
      {{ section.settings.logo_text }}
    </div>
    <nav class="nav-links" style="display: flex; gap: 24px; font-size: 11px; font-weight: 600; text-transform: uppercase;">
      {% if section.settings.menu != blank %}
        {% for link in linklists[section.settings.menu].links %}
          <a href="{{ link.url }}" style="color: inherit; text-decoration: none;">{{ link.title }}</a>
        {% endfor %}
      {% else %}
        <a href="#" style="color: inherit; text-decoration: none;">Shop</a>
        <a href="#" style="color: inherit; text-decoration: none;">Collections</a>
        <a href="#" style="color: inherit; text-decoration: none;">About</a>
      {% endif %}
    </nav>
    <div class="header-utils" style="display: flex; align-items: center; gap: 16px;">
      {% if section.settings.show_search %}
        <span style="cursor: pointer; font-size: 14px;">🔍</span>
      {% endif %}
      <a href="/cart" style="color: inherit; text-decoration: none; position: relative;">
        👜 <span style="background: ${themeSettings.accentColor}; color: #fff; font-size: 8px; font-weight: bold; border-radius: 50%; padding: 2px 5px; position: absolute; top: -8px; right: -8px;">0</span>
      </a>
    </div>
  </div>
</header>

{% schema %}
{
  "name": "PageSmith Header",
  "settings": [
    {
      "type": "text",
      "id": "logo_text",
      "label": "Logo Brand Name",
      "default": "${(sec.settings.logoText || 'PAGESMITH').replace(/"/g, '\\"')}"
    },
    {
      "type": "link_list",
      "id": "menu",
      "label": "Navigation Menu"
    },
    {
      "type": "checkbox",
      "id": "show_search",
      "label": "Show Search Button",
      "default": ${sec.settings.showSearch || false}
    }
  ],
  "presets": [
    {
      "name": "PageSmith Header"
    }
  ]
}
{% endschema %}`;
          break;

        case 'hero':
          content = `{% comment %}
  Section Shopify : Bannière Hero Pagesmith (Remplacement dans ${mappedType}.liquid)
{% endcomment %}
<section class="pagesmith-hero" style="
  position: relative;
  width: 100%;
  min-height: {% if section.settings.height == 'small' %}300px{% elsif section.settings.height == 'large' %}600px{% else %}450px{% endif %};
  background-color: #1a1a1a;
  background-image: url('{{ section.settings.image | img_url: '1600x' }}');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: {% if section.settings.alignment == 'left' %}flex-start{% elsif section.settings.alignment == 'right' %}flex-end{% else %}center{% endif %};
  padding: 40px 24px;
">
  <div style="
    position: absolute;
    inset: 0;
    background-color: #000000;
    opacity: {{ section.settings.overlay_opacity | divide: 100.0 }};
    z-index: 1;
  "></div>

  <div style="
    position: relative;
    z-index: 2;
    max-width: 600px;
    color: #ffffff;
    text-align: {{ section.settings.alignment }};
  ">
    <h2 style="font-size: 36px; font-weight: 800; line-height: 1.1; margin-bottom: 16px; font-family: sans-serif;">
      {{ section.settings.heading }}
    </h2>
    <p style="font-size: 14px; opacity: 0.9; margin-bottom: 24px; line-height: 1.5; font-family: sans-serif;">
      {{ section.settings.subheading }}
    </p>
    <div style="display: flex; gap: 12px; justify-content: {% if section.settings.alignment == 'left' %}flex-start{% elsif section.settings.alignment == 'right' %}flex-end{% else %}center{% endif %}; flex-wrap: wrap;">
      <a href="{{ section.settings.button_link }}" style="
        background-color: ${themeSettings.accentColor};
        color: #ffffff;
        text-decoration: none;
        font-weight: 750;
        font-size: 12px;
        padding: 12px 24px;
        letter-spacing: 0.05em;
        text-transform: ${themeSettings.uppercaseButtons ? 'uppercase' : 'none'};
        border-radius: ${themeSettings.buttonRadius === 'none' ? '0px' : themeSettings.buttonRadius === 'sm' ? '2px' : themeSettings.buttonRadius === 'md' ? '6px' : themeSettings.buttonRadius === 'lg' ? '12px' : '9999px'};
        display: inline-block;
      ">
        {{ section.settings.button_text }}
      </a>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "PageSmith Hero",
  "settings": [
    {
      "type": "image_picker",
      "id": "image",
      "label": "Hero Background Image"
    },
    {
      "type": "range",
      "id": "overlay_opacity",
      "min": 10,
      "max": 90,
      "step": 5,
      "label": "Overlay opacity",
      "default": ${sec.settings.overlayOpacity || 30}
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading Title",
      "default": "${(sec.settings.heading || 'Crafted Objects').replace(/"/g, '\\"')}"
    },
    {
      "type": "textarea",
      "id": "subheading",
      "label": "Subheading Text",
      "default": "${(sec.settings.subheading || 'Designed for lifetime utility.').replace(/"/g, '\\"')}"
    },
    {
      "type": "text",
      "id": "button_text",
      "label": "CTA Button Text",
      "default": "${(sec.settings.buttonText || 'Order Now').replace(/"/g, '\\"')}"
    },
    {
      "type": "url",
      "id": "button_link",
      "label": "CTA Link"
    },
    {
      "type": "select",
      "id": "alignment",
      "label": "Text Alignment",
      "default": "${sec.settings.alignment || 'center'}",
      "options": [
        { "value": "left", "label": "Left" },
        { "value": "center", "label": "Center" },
        { "value": "right", "label": "Right" }
      ]
    },
    {
      "type": "select",
      "id": "height",
      "label": "Banner Height",
      "default": "${sec.settings.bannerHeight || 'medium'}",
      "options": [
        { "value": "small", "label": "Small" },
        { "value": "medium", "label": "Medium" },
        { "value": "large", "label": "Large" }
      ]
    }
  ],
  "presets": [
    {
      "name": "PageSmith Hero"
    }
  ]
}
{% endschema %}`;
          break;

        case 'features-grid': {
          const defaultFeaturesTitle = (sec.settings.title || "L'excellence de la productivité digitale").replace(/'/g, "\\'").replace(/"/g, '\\"');
          const defaultFeaturesSubtitle = (sec.settings.subtitle || "Toutes nos solutions sont construites pour être fluides, esthétiques et intuitives.").replace(/'/g, "\\'").replace(/"/g, '\\"');

          content = `{% comment %}
  Section Shopify : Grille d'atouts Pagesmith (Remplacement dans ${mappedType}.liquid)
{% endcomment %}
<section class="pagesmith-features" style="
  background-color: ${themeSettings.backgroundColor};
  color: ${themeSettings.textColor};
  padding: 60px 24px;
">
  <div style="max-w: 1200px; margin: 0 auto; text-align: center;">
    {% if section.settings.title != blank %}
      <div style="margin-bottom: 40px;">
        <h3 style="font-size: 24px; font-weight: 855; margin-bottom: 8px; letter-spacing: -0.02em; font-family: 'Space Grotesk', sans-serif;">{{ section.settings.title }}</h3>
        {% if section.settings.subtitle != blank %}
          <p style="font-size: 12.5px; opacity: 0.7; font-family: 'Inter', sans-serif;">{{ section.settings.subtitle }}</p>
        {% endif %}
      </div>
    {% endif %}

    <div style="
      display: grid;
      gap: 24px;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    ">
      <div class="features-item" style="
        background-color: ${themeSettings.cardBackgroundColor};
        padding: 32px 24px;
        text-align: left;
        border-radius: ${themeSettings.cardRadius === 'none' ? '0px' : themeSettings.cardRadius === 'sm' ? '2px' : themeSettings.cardRadius === 'md' ? '6px' : themeSettings.cardRadius === 'lg' ? '12px' : '24px'};
        border: ${themeSettings.showBorders ? '1px solid rgba(0,0,0,0.08)' : 'none'};
      ">
        <div style="font-size: 28px; margin-bottom: 16px; color: ${themeSettings.accentColor}; line-height: 1;">📥</div>
        <h4 style="font-weight: 750; font-size: 15px; margin: 0 0 10px 0; letter-spacing: -0.01em;">Téléchargement Instantané</h4>
        <p style="font-size: 11.5px; opacity: 0.8; line-height: 1.6; margin: 0;">Accédez à votre espace Notion instantanément après validation de votre commande.</p>
      </div>

      <div class="features-item" style="
        background-color: ${themeSettings.cardBackgroundColor};
        padding: 32px 24px;
        text-align: left;
        border-radius: ${themeSettings.cardRadius === 'none' ? '0px' : themeSettings.cardRadius === 'sm' ? '2px' : themeSettings.cardRadius === 'md' ? '6px' : themeSettings.cardRadius === 'lg' ? '12px' : '24px'};
        border: ${themeSettings.showBorders ? '1px solid rgba(0,0,0,0.08)' : 'none'};
      ">
        <div style="font-size: 28px; margin-bottom: 16px; color: ${themeSettings.accentColor}; line-height: 1;">🔄</div>
        <h4 style="font-weight: 750; font-size: 15px; margin: 0 0 10px 0; letter-spacing: -0.01em;">Mises à jour à vie</h4>
        <p style="font-size: 11.5px; opacity: 0.8; line-height: 1.6; margin: 0;">Nous mettons régulièrement à jour nos modules d'organisation. Les mises à jour s'appliquent gratuitement.</p>
      </div>

      <div class="features-item" style="
        background-color: ${themeSettings.cardBackgroundColor};
        padding: 32px 24px;
        text-align: left;
        border-radius: ${themeSettings.cardRadius === 'none' ? '0px' : themeSettings.cardRadius === 'sm' ? '2px' : themeSettings.cardRadius === 'md' ? '6px' : themeSettings.cardRadius === 'lg' ? '12px' : '24px'};
        border: ${themeSettings.showBorders ? '1px solid rgba(0,0,0,0.08)' : 'none'};
      ">
        <div style="font-size: 28px; margin-bottom: 16px; color: ${themeSettings.accentColor}; line-height: 1;">💬</div>
        <h4 style="font-weight: 750; font-size: 15px; margin: 0 0 10px 0; letter-spacing: -0.01em;">Assistance premium 7j/7</h4>
        <p style="font-size: 11.5px; opacity: 0.8; line-height: 1.6; margin: 0;">Une équipe francophone dédiée vous guide pas-à-pas pour configurer et personnaliser votre environnement.</p>
      </div>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "PageSmith Features Grid",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Section Title",
      "default": "${defaultFeaturesTitle}"
    },
    {
      "type": "text",
      "id": "subtitle",
      "label": "Section Subtitle",
      "default": "${defaultFeaturesSubtitle}"
    }
  ],
  "presets": [
    {
      "name": "PageSmith Features Grid"
    }
  ]
}
{% endschema %}`;
          break;
        }

        case 'product-showcase': {
          const defaultShowcaseHeading = (sec.settings.heading || 'LANCEMENT SPÉCIAL').replace(/'/g, "\\'").replace(/"/g, '\\"');
          const defaultShowcaseSubheading = (sec.settings.subheading || 'Découvrez tous les détails techniques appliqués sur notre dernier chef d’oeuvre d’ingénierie.').replace(/'/g, "\\'").replace(/"/g, '\\"');

          content = `{% comment %}
  Section Shopify : Présentation Produit Unique Pagesmith (Remplacement dans ${mappedType}.liquid)
{% endcomment %}
{% assign main_product = all_products[section.settings.product] %}

<section class="pagesmith-product-showcase" style="
  background-color: ${themeSettings.backgroundColor};
  color: ${themeSettings.textColor};
  padding: 60px 24px;
">
  <div style="max-w: 1200px; margin: 0 auto; display: grid; gap: 40px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); align-items: center;">
    <div>
      {% if main_product != blank %}
        <img src="{{ main_product.featured_image | img_url: '800x800' }}" alt="{{ main_product.title }}" style="width: 100%; border-radius: 8px; display: block; border: 1px solid rgba(0,0,0,0.05);">
      {% else %}
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000" alt="Template Notion — Business Pro" style="width: 100%; border-radius: 8px; display: block; border: 1px solid rgba(0,0,0,0.05);">
      {% endif %}
    </div>

    <div>
      <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${themeSettings.accentColor}; letter-spacing: 0.1em; display: inline-block; margin-bottom: 8px;">
        {{ section.settings.heading | default: "Le Template Phare" }}
      </span>
      <h2 style="font-size: 32px; font-weight: 800; line-height: 1.2; margin-bottom: 12px; margin-top: 0;">
        {% if main_product != blank %}{{ main_product.title }}{% else %}Template Notion — Business Pro{% endif %}
      </h2>
      <p style="font-size: 13px; line-height: 1.6; opacity: 0.8; margin-bottom: 24px;">
        {% if main_product != blank %}{{ main_product.description | strip_html | truncatewords: 35 }}{% else %}Amenez votre projet à un niveau supérieur avec rigueur et intégrité. Le Template Business Pro est un système d’intelligence entrepreneuriale conçu pour structurer chaque aspect de votre activité : planification opérationnelle, comptabilité analytique épurée, gestion de projet avancée (OKR), CRM pour le suivi de vos prospects, et stratégie marketing. Le tout réuni sur un espace visuel ultra-moderne, intuitif et 100% personnalisable.{% endif %}
      </p>

      <span style="font-size: 20px; font-weight: 800; display: block; margin-bottom: 20px;">
        {% if main_product != blank %}
          {{ main_product.price | money }}
        {% else %}
          24,99 € <span style="font-size: 14px; text-decoration: line-through; opacity: 0.6; font-weight: 400; margin-left: 8px;">40,00 €</span> <span style="font-size: 11px; color: #ef4444; font-weight: 700; margin-left: 8px; border: 1px solid #ef4444; padding: 2px 6px; border-radius: 4px; display: inline-block; vertical-align: middle;">PROMO -38%</span>
        {% endif %}
      </span>

      <form action="/cart/add" method="post" enctype="multipart/form-data">
        <input type="hidden" name="id" value="{% if main_product != blank %}{{ main_product.variants.first.id }}{% endif %}">
        <button type="submit" style="
          background-color: ${themeSettings.accentColor};
          color: white;
          border: none;
          padding: 12px 32px;
          cursor: pointer;
          font-weight: 750;
          font-size: 12px;
          letter-spacing: 0.05em;
          text-transform: ${themeSettings.uppercaseButtons ? 'uppercase' : 'none'};
          border-radius: ${themeSettings.buttonRadius === 'none' ? '0px' : themeSettings.buttonRadius === 'sm' ? '2px' : themeSettings.buttonRadius === 'md' ? '6px' : themeSettings.buttonRadius === 'lg' ? '12px' : '9999px'};
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        ">
          Ajouter au Panier
        </button>
      </form>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "PageSmith Showcase",
  "settings": [
    {
      "type": "product",
      "id": "product",
      "label": "Focus Product"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Section Heading",
      "default": "${defaultShowcaseHeading}"
    },
    {
      "type": "textarea",
      "id": "subheading",
      "label": "Section Subheading",
      "default": "${defaultShowcaseSubheading}"
    }
  ],
  "presets": [
    {
      "name": "PageSmith Showcase"
    }
  ]
}
{% endschema %}`;
          break;
        }

        case 'featured-collection': {
          const defaultCollectionTitle = (sec.settings.title || 'Meilleures Ventes').replace(/'/g, "\\'").replace(/"/g, '\\"');
          const defaultCollectionSubtitle = (sec.settings.subtitle || 'Sélection exclusive d’objets fabriqués main.').replace(/'/g, "\\'").replace(/"/g, '\\"');

          content = `{% comment %}
  Section Shopify : Collection en vedette Pagesmith (Remplacement dans ${mappedType}.liquid)
{% endcomment %}
{% assign featured_collection = collections[section.settings.collection] %}

<section class="pagesmith-featured-collection" style="
  background-color: ${themeSettings.backgroundColor};
  color: ${themeSettings.textColor};
  padding: 60px 24px;
">
  <div style="max-w: 1200px; margin: 0 auto;">
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; border-bottom: 1px solid rgba(0,0,0,0.08); padding-bottom: 16px;">
      <div>
        <h3 style="font-size: 20px; font-weight: 800; margin: 0;">{{ section.settings.title | default: "Catalogue Curaté" }}</h3>
        {% if section.settings.subtitle != blank %}
          <p style="font-size: 11px; opacity: 0.6; margin: 4px 0 0 0;">{{ section.settings.subtitle }}</p>
        {% endif %}
      </div>
      <a href="{{ featured_collection.url }}" style="font-size: 11px; font-weight: 700; color: inherit; text-decoration: none;">Voir tout →</a>
    </div>

    <div style="
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    ">
      {% if featured_collection != blank and featured_collection.products_count > 0 %}
        {% for prod in featured_collection.products limit: section.settings.limit %}
          <div class="product-card" style="
            background: ${themeSettings.cardBackgroundColor};
            border-radius: ${themeSettings.cardRadius === 'none' ? '0px' : themeSettings.cardRadius === 'sm' ? '2px' : themeSettings.cardRadius === 'md' ? '6px' : themeSettings.cardRadius === 'lg' ? '12px' : '24px'};
            border: {% if ${themeSettings.showBorders} %}1px solid rgba(0,0,0,0.08){% else %}none{% endif %};
            padding: 16px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          ">
            <div>
              <img src="{{ prod.featured_image | img_url: '400x400' }}" alt="{{ prod.title }}" style="width: 100%; border-radius: 4px; display: block; margin-bottom: 12px;">
              <h4 style="font-weight: 700; font-size: 13px; margin: 0 0 4px 0;"><a href="{{ prod.url }}" style="text-decoration: none; color: inherit;">{{ prod.title }}</a></h4>
              <p style="font-size: 10px; opacity: 0.6; margin: 0 0 8px 0; line-height: 1.4;">{{ prod.description | strip_html | truncatewords: 10 }}</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; border-top: 1px solid rgba(0,0,0,0.04); padding-top: 12px;">
              <span style="font-size: 13px; font-weight: 700;">{{ prod.price | money }}</span>
              <form action="/cart/add" method="post" enctype="multipart/form-data">
                <input type="hidden" name="id" value="{{ prod.variants.first.id }}">
                <button type="submit" style="background: #111; color: white; border: none; font-size: 9px; font-weight: bold; padding: 6px 12px; border-radius: 3px; cursor: pointer;">+ Ajouter</button>
              </form>
            </div>
          </div>
        {% endfor %}
      {% else %}
        <!-- Produit 1: Business Pro -->
        <div class="product-card" style="
          background: ${themeSettings.cardBackgroundColor};
          border-radius: ${themeSettings.cardRadius === 'none' ? '0px' : themeSettings.cardRadius === 'sm' ? '2px' : themeSettings.cardRadius === 'md' ? '6px' : themeSettings.cardRadius === 'lg' ? '12px' : '24px'};
          border: ${themeSettings.showBorders ? '1px solid rgba(0,0,0,0.08)' : 'none'};
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        ">
          <div style="position: absolute; left: 10px; top: 10px; z-index: 10; display: flex; flex-direction: column; gap: 4px; font-size: 8px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase;">
            <span style="background: ${themeSettings.accentColor}; color: white; padding: 2px 6px; border-radius: 2px;">Populaire</span>
          </div>
          <div>
            <div style="aspect-ratio: 1; width: 100%; overflow: hidden; display: flex; align-items: center; justify-content: center; background: white; margin-bottom: 12px; border-radius: 4px;">
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000" alt="Template Notion — Business Pro" style="width: 100%; height: 100%; object-fit: cover; display: block;">
            </div>
            <div style="display: flex; gap: 2px; color: #f59e0b; font-size: 9px; margin-bottom: 4px; align-items: center;">
              ★★★★★ <span style="color: #9ca3af; font-size: 8px; margin-left: 4px;">(4.9)</span>
            </div>
            <h4 style="font-weight: 700; font-size: 13px; margin: 0 0 4px 0; color: inherit;">Template Notion — Business Pro</h4>
            <p style="font-size: 10px; opacity: 0.7; margin: 0 0 12px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Un espace Notion tout-en-un complet pour structurer et piloter votre entreprise de manière optimisée et professionnelle.</p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 12px;">
            <div>
              <span style="font-size: 13px; font-weight: 700;">24,99 €</span>
              <span style="font-size: 10px; text-decoration: line-through; opacity: 0.6; display: block;">49,00 €</span>
            </div>
            <button style="background: ${themeSettings.accentColor || '#111'}; color: white; border: none; font-size: 9px; font-weight: bold; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Ajout Rapide</button>
          </div>
        </div>

        <!-- Produit 2: Budget Mensuel Pro -->
        <div class="product-card" style="
          background: ${themeSettings.cardBackgroundColor};
          border-radius: ${themeSettings.cardRadius === 'none' ? '0px' : themeSettings.cardRadius === 'sm' ? '2px' : themeSettings.cardRadius === 'md' ? '6px' : themeSettings.cardRadius === 'lg' ? '12px' : '24px'};
          border: ${themeSettings.showBorders ? '1px solid rgba(0,0,0,0.08)' : 'none'};
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        ">
          <div style="position: absolute; left: 10px; top: 10px; z-index: 10; display: flex; flex-direction: column; gap: 4px; font-size: 8px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase;">
            <span style="background: ${themeSettings.accentColor}; color: white; padding: 2px 6px; border-radius: 2px;">Finances</span>
          </div>
          <div>
            <div style="aspect-ratio: 1; width: 100%; overflow: hidden; display: flex; align-items: center; justify-content: center; background: white; margin-bottom: 12px; border-radius: 4px;">
              <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000" alt="Budget Mensuel Pro" style="width: 100%; height: 100%; object-fit: cover; display: block;">
            </div>
            <div style="display: flex; gap: 2px; color: #f59e0b; font-size: 9px; margin-bottom: 4px; align-items: center;">
              ★★★★★ <span style="color: #9ca3af; font-size: 8px; margin-left: 4px;">(4.8)</span>
            </div>
            <h4 style="font-weight: 700; font-size: 13px; margin: 0 0 4px 0; color: inherit;">Budget Mensuel Pro</h4>
            <p style="font-size: 10px; opacity: 0.7; margin: 0 0 12px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Maîtrisez vos finances personnelles, gérez vos enveloppes d'épargne et suivez vos dépenses récurrentes de manière automatisée.</p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 12px;">
            <div>
              <span style="font-size: 13px; font-weight: 700;">24,99 €</span>
              <span style="font-size: 10px; text-decoration: line-through; opacity: 0.6; display: block;">40,00 €</span>
            </div>
            <button style="background: ${themeSettings.accentColor || '#111'}; color: white; border: none; font-size: 9px; font-weight: bold; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Ajout Rapide</button>
          </div>
        </div>

        <!-- Produit 3: Calendrier Contenu Réseaux Sociaux -->
        <div class="product-card" style="
          background: ${themeSettings.cardBackgroundColor};
          border-radius: ${themeSettings.cardRadius === 'none' ? '0px' : themeSettings.cardRadius === 'sm' ? '2px' : themeSettings.cardRadius === 'md' ? '6px' : themeSettings.cardRadius === 'lg' ? '12px' : '24px'};
          border: ${themeSettings.showBorders ? '1px solid rgba(0,0,0,0.08)' : 'none'};
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        ">
          <div style="position: absolute; left: 10px; top: 10px; z-index: 10; display: flex; flex-direction: column; gap: 4px; font-size: 8px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase;">
            <span style="background: ${themeSettings.accentColor}; color: white; padding: 2px 6px; border-radius: 2px;">Social</span>
          </div>
          <div>
            <div style="aspect-ratio: 1; width: 100%; overflow: hidden; display: flex; align-items: center; justify-content: center; background: white; margin-bottom: 12px; border-radius: 4px;">
              <img src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1000" alt="Calendrier Contenu Réseaux Sociaux" style="width: 100%; height: 100%; object-fit: cover; display: block;">
            </div>
            <div style="display: flex; gap: 2px; color: #f59e0b; font-size: 9px; margin-bottom: 4px; align-items: center;">
              ★★★★★ <span style="color: #9ca3af; font-size: 8px; margin-left: 4px;">(4.7)</span>
            </div>
            <h4 style="font-weight: 700; font-size: 13px; margin: 0 0 4px 0; color: inherit;">Calendrier Contenu</h4>
            <p style="font-size: 10px; opacity: 0.7; margin: 0 0 12px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Planifiez, rédigez et programmez stratégiquement vos publications Instagram, TikTok, YouTube et LinkedIn sur un seul écran.</p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 12px;">
            <div>
              <span style="font-size: 13px; font-weight: 700;">24,99 €</span>
              <span style="font-size: 10px; text-decoration: line-through; opacity: 0.6; display: block;">40,00 €</span>
            </div>
            <button style="background: ${themeSettings.accentColor || '#111'}; color: white; border: none; font-size: 9px; font-weight: bold; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Ajout Rapide</button>
          </div>
        </div>

        <!-- Produit 4: CRM Suivi Clients Pro -->
        <div class="product-card" style="
          background: ${themeSettings.cardBackgroundColor};
          border-radius: ${themeSettings.cardRadius === 'none' ? '0px' : themeSettings.cardRadius === 'sm' ? '2px' : themeSettings.cardRadius === 'md' ? '6px' : themeSettings.cardRadius === 'lg' ? '12px' : '24px'};
          border: ${themeSettings.showBorders ? '1px solid rgba(0,0,0,0.08)' : 'none'};
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        ">
          <div style="position: absolute; left: 10px; top: 10px; z-index: 10; display: flex; flex-direction: column; gap: 4px; font-size: 8px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase;">
            <span style="background: ${themeSettings.accentColor}; color: white; padding: 2px 6px; border-radius: 2px;">CRM</span>
          </div>
          <div>
            <div style="aspect-ratio: 1; width: 100%; overflow: hidden; display: flex; align-items: center; justify-content: center; background: white; margin-bottom: 12px; border-radius: 4px;">
              <img src="https://images.unsplash.com/photo-1552581230-c01bc0d48403?auto=format&fit=crop&q=80&w=1000" alt="CRM Suivi Clients Pro" style="width: 100%; height: 100%; object-fit: cover; display: block;">
            </div>
            <div style="display: flex; gap: 2px; color: #f59e0b; font-size: 9px; margin-bottom: 4px; align-items: center;">
              ★★★★★ <span style="color: #9ca3af; font-size: 8px; margin-left: 4px;">(4.9)</span>
            </div>
            <h4 style="font-weight: 700; font-size: 13px; margin: 0 0 4px 0; color: inherit;">CRM Suivi Clients Pro</h4>
            <p style="font-size: 10px; opacity: 0.7; margin: 0 0 12px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">Centralisez vos fiches clients, pilotez vos ventes actives et générez des devis de manière simplifiée et moderne.</p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 12px;">
            <div>
              <span style="font-size: 13px; font-weight: 700;">24,99 €</span>
              <span style="font-size: 10px; text-decoration: line-through; opacity: 0.6; display: block;">40,00 €</span>
            </div>
            <button style="background: ${themeSettings.accentColor || '#111'}; color: white; border: none; font-size: 9px; font-weight: bold; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Ajout Rapide</button>
          </div>
        </div>
      {% endif %}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "PageSmith Curated Grid",
  "settings": [
    {
      "type": "collection",
      "id": "collection",
      "label": "Featured Collection"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "${defaultCollectionTitle}"
    },
    {
      "type": "text",
      "id": "subtitle",
      "label": "Subtitle",
      "default": "${defaultCollectionSubtitle}"
    },
    {
      "type": "range",
      "id": "limit",
      "min": 2,
      "max": 8,
      "step": 1,
      "label": "Product Limit",
      "default": 4
    }
  ],
  "presets": [
    {
      "name": "PageSmith Curated Grid"
    }
  ]
}
{% endschema %}`;
          break;
        }

        case 'rich-text': {
          const defaultRichTitle = (sec.settings.title || "Un nouveau standard pour s'organiser").replace(/'/g, "\\'").replace(/"/g, '\\"');
          const defaultRichText = (sec.settings.text || "Nous croyons que la clarté d'esprit passe par la clarté de vos outils de gestion. Nos bases de données interconnectées et automatisées éliminent le bruit inutile et vous permettent d'atteindre vos objectifs quotidiens avec rigueur et simplicité.").replace(/'/g, "\\'").replace(/"/g, '\\"');
          const defaultRichButtonText = (sec.settings.buttonText || "Notre Philosophie").replace(/'/g, "\\'").replace(/"/g, '\\"');

          content = `{% comment %}
  Section Shopify : Texte enrichi Pagesmith (Porté dans ${mappedType}.liquid via Custom Liquid)
{% endcomment %}
<section class="pagesmith-rich-text" style="
  background-color: ${themeSettings.backgroundColor};
  color: ${themeSettings.textColor};
  padding: 60px 24px;
  text-align: center;
">
  <div style="max-w: 700px; margin: 0 auto;">
    <h3 style="font-size: 24px; font-weight: 855; margin-bottom: 20px; letter-spacing: -0.02em; font-family: 'Space Grotesk', sans-serif;">
      {{ section.settings.title | default: "Un nouveau standard pour s'organiser" }}
    </h3>
    <p style="font-size: 13.5px; line-height: 1.7; opacity: 0.85; margin: 0 auto 28px auto; max-width: 600px; font-family: 'Inter', sans-serif;">
      {{ section.settings.text | default: "Nous croyons que la clarté d'esprit passe par la clarté de vos outils de gestion. Nos bases de données interconnectées et automatisées éliminent le bruit inutile et vous permettent d'atteindre vos objectifs quotidiens avec rigueur et simplicité." }}
    </p>
    {% if section.settings.button_text != blank %}
      <div>
        <a href="{{ section.settings.button_link | default: '#' }}" style="
          background-color: ${themeSettings.accentColor};
          color: white;
          text-decoration: none;
          font-weight: 750;
          font-size: 11.5px;
          padding: 12px 28px;
          letter-spacing: 0.05em;
          text-transform: ${themeSettings.uppercaseButtons ? 'uppercase' : 'none'};
          border-radius: ${themeSettings.buttonRadius === 'none' ? '0px' : themeSettings.buttonRadius === 'sm' ? '2px' : themeSettings.buttonRadius === 'md' ? '6px' : themeSettings.buttonRadius === 'lg' ? '12px' : '9999px'};
          display: inline-block;
          transition: all 0.2s ease;
        ">
          {{ section.settings.button_text }}
        </a>
      </div>
    {% endif %}
  </div>
</section>

{% schema %}
{
  "name": "PageSmith Text Block",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "${defaultRichTitle}"
    },
    {
      "type": "textarea",
      "id": "text",
      "label": "Text",
      "default": "${defaultRichText}"
    },
    {
      "type": "text",
      "id": "button_text",
      "label": "Button Text",
      "default": "${defaultRichButtonText}"
    },
    {
      "type": "url",
      "id": "button_link",
      "label": "Button Link"
    }
  ],
  "presets": [
    {
      "name": "PageSmith Text Block"
    }
  ]
}
{% endschema %}`;
          break;
        }

        case 'testimonials': {
          const defaultTestimonialsTitle = (sec.settings.title || "Ils partagent leur expérience").replace(/'/g, "\\'").replace(/"/g, '\\"');

          content = `{% comment %}
  Section Shopify : Témoignages Clients Pagesmith (Remplacement dans ${mappedType}.liquid)
{% endcomment %}
<section class="pagesmith-testimonials" style="
  background-color: ${themeSettings.cardBackgroundColor};
  color: ${themeSettings.textColor};
  padding: 60px 24px;
">
  <div style="max-w: 1200px; margin: 0 auto;">
    <h3 style="text-align: center; font-size: 12px; font-weight: 855; letter-spacing: 0.12em; text-transform: uppercase; color: #888; margin-bottom: 40px; font-family: 'Space Grotesk', sans-serif;">
      {{ section.settings.title | default: "Ils partagent leur expérience" }}
    </h3>

    <div style="
      display: grid;
      gap: 24px;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    ">
      <!-- Témoignage 1 -->
      <div style="
        background: ${themeSettings.backgroundColor};
        padding: 28px;
        border-radius: ${themeSettings.cardRadius === 'none' ? '0px' : themeSettings.cardRadius === 'sm' ? '2px' : themeSettings.cardRadius === 'md' ? '8px' : themeSettings.cardRadius === 'lg' ? '12px' : '24px'};
        border: ${themeSettings.showBorders ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,0,0,0.03)'};
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      ">
        <div>
          <div style="display: flex; gap: 2px; color: #f59e0b; font-size: 11px; margin-bottom: 12px;">★★★★★</div>
          <p style="font-style: italic; font-size: 13.5px; line-height: 1.65; margin: 0; opacity: 0.9; font-family: Georgia, serif;">
            "Le template Business Pro m'a permis de centraliser toutes mes opérations et devis en un seul endroit. Un vrai chef-d’œuvre d'organisation !"
          </p>
        </div>
        <div style="margin-top: 20px; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 14px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="font-size: 12px; display: block; font-weight: 750;">Sarah B.</strong>
            <span style="font-size: 9.5px; opacity: 0.6; display: block; margin-top: 1px;">Freelance & Rédactrice</span>
          </div>
          <span style="color: #059669; font-size: 12px; font-weight: bold;">✓ Client Vérifié</span>
        </div>
      </div>

      <!-- Témoignage 2 -->
      <div style="
        background: ${themeSettings.backgroundColor};
        padding: 28px;
        border-radius: ${themeSettings.cardRadius === 'none' ? '0px' : themeSettings.cardRadius === 'sm' ? '2px' : themeSettings.cardRadius === 'md' ? '8px' : themeSettings.cardRadius === 'lg' ? '12px' : '24px'};
        border: ${themeSettings.showBorders ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,0,0,0.03)'};
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      ">
        <div>
          <div style="display: flex; gap: 2px; color: #f59e0b; font-size: 11px; margin-bottom: 12px;">★★★★★</div>
          <p style="font-style: italic; font-size: 13.5px; line-height: 1.65; margin: 0; opacity: 0.9; font-family: Georgia, serif;">
            "Le Calendrier de Contenu de Réseaux Sociaux a doublé ma productivité créative. J'écris et planifie l'intégralité de mes posts en quelques heures le dimanche pour toute la semaine."
          </p>
        </div>
        <div style="margin-top: 20px; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 14px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="font-size: 12px; display: block; font-weight: 750;">Thomas G.</strong>
            <span style="font-size: 9.5px; opacity: 0.6; display: block; margin-top: 1px;">Créateur de contenu</span>
          </div>
          <span style="color: #059669; font-size: 12px; font-weight: bold;">✓ Client Vérifié</span>
        </div>
      </div>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "PageSmith Testimonials",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "${defaultTestimonialsTitle}"
    }
  ],
  "presets": [
    {
      "name": "PageSmith Testimonials"
    }
  ]
}
{% endschema %}`;
          break;
        }

        case 'newsletter': {
          const defaultNewsletterTitle = (sec.settings.title || "Rejoignez la newsletter Productivité").replace(/'/g, "\\'").replace(/"/g, '\\"');
          const defaultNewsletterDesc = (sec.settings.description || "Recevez chaque vendredi nos astuces d'organisation exclusives, tutoriels avancés et des templates de soutien offerts.").replace(/'/g, "\\'").replace(/"/g, '\\"');
          const defaultNewsletterPlaceholder = (sec.settings.placeholder || "votre.adresse@email.com").replace(/'/g, "\\'").replace(/"/g, '\\"');
          const defaultNewsletterButtonText = (sec.settings.buttonText || "S'abonner").replace(/'/g, "\\'").replace(/"/g, '\\"');

          content = `{% comment %}
  Section Shopify : Inscription Newsletter Pagesmith (Dans ${mappedType}.liquid)
{% endcomment %}
<section class="pagesmith-newsletter" style="
  background-color: ${themeSettings.backgroundColor};
  color: ${themeSettings.textColor};
  padding: 60px 24px;
  text-align: center;
">
  <div style="max-w: 520px; margin: 0 auto; display: flex; flex-direction: column; align-items: center;">
    <div style="font-size: 36px; margin-bottom: 16px; line-height: 1;">✉️</div>
    <h3 style="font-size: 24px; font-weight: 855; margin: 0 0 10px 0; letter-spacing: -0.02em; font-family: 'Space Grotesk', sans-serif;">{{ section.settings.title }}</h3>
    <p style="font-size: 13px; opacity: 0.75; margin: 0 0 28px 0; line-height: 1.6; font-family: 'Inter', sans-serif;">{{ section.settings.description }}</p>

    {%- form 'customer', class: 'newsletter-form', style: 'width: 100%' -%}
      <input type="hidden" name="contact[tags]" value="newsletter">
      <div style="display: flex; gap: 8px; width: 100%; max-width: 480px; margin: 0 auto;">
        <input 
          type="email" 
          name="contact[email]"
          class="field__input"
          value="{{ form.email }}"
          aria-required="true"
          autocorrect="off"
          autocapitalize="off"
          autocomplete="email"
          placeholder="{{ section.settings.placeholder }}" 
          style="flex: 1; padding: 12px 16px; border: 1px solid rgba(0,0,0,0.12); border-radius: ${themeSettings.buttonRadius === 'none' ? '0px' : themeSettings.buttonRadius === 'sm' ? '2px' : themeSettings.buttonRadius === 'md' ? '4px' : '6px'}; font-size: 12px; background: ${themeSettings.cardBackgroundColor}; color: inherit;"
          correct
        >
        <button type="submit" style="
          background-color: ${themeSettings.accentColor};
          color: white;
          border: none;
          padding: 12px 24px;
          font-weight: 750;
          font-size: 11.5px;
          letter-spacing: 0.05em;
          text-transform: ${themeSettings.uppercaseButtons ? 'uppercase' : 'none'};
          border-radius: ${themeSettings.buttonRadius === 'none' ? '0px' : themeSettings.buttonRadius === 'sm' ? '2px' : themeSettings.buttonRadius === 'md' ? '6px' : '9999px'};
          cursor: pointer;
        ">
          {{ section.settings.button_text }}
        </button>
      </div>
      {%- if form.posted_successfully? -%}
        <p style="color: #059669; font-size: 12px; margin-top: 12px; font-weight: bold;">Merci pour votre inscription ! À vendredi-prochain.</p>
      {%- endif -%}
    {%- endform -%}
  </div>
</section>

{% schema %}
{
  "name": "PageSmith Newsletter",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "${defaultNewsletterTitle}"
    },
    {
      "type": "textarea",
      "id": "description",
      "label": "Description",
      "default": "${defaultNewsletterDesc}"
    },
    {
      "type": "text",
      "id": "placeholder",
      "label": "Input Placeholder",
      "default": "${defaultNewsletterPlaceholder}"
    },
    {
      "type": "text",
      "id": "button_text",
      "label": "Button Label",
      "default": "${defaultNewsletterButtonText}"
    }
  ],
  "presets": [
    {
      "name": "PageSmith Newsletter"
    }
  ]
}
{% endschema %}`;
          break;
        }

        case 'footer': {
          const defaultFooterDesc = (sec.settings.brandDesc || "Démocratiser la puissance de Notion et des bases de données épurées pour libérer le potentiel créatif et organisationnel de chacun.").replace(/'/g, "\\'").replace(/"/g, '\\"');
          const defaultFooterCopyright = (sec.settings.copyright || "© 2026 Pagesmith Lab. Tous droits réservés. Propulsé par Shopify.").replace(/'/g, "\\'").replace(/"/g, '\\"');

          content = `{% comment %}
  Section Shopify : Pied de page Pagesmith (Remplacement dans ${mappedType}.liquid)
{% endcomment %}
<footer class="pagesmith-footer" style="
  background-color: ${themeSettings.primaryColor};
  color: #ffffff;
  padding: 60px 24px;
  font-size: 12px;
  border-top: 1px solid rgba(255,255,255,0.05);
">
  <div style="max-w: 1250px; margin: 0 auto; display: grid; gap: 40px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
    <div style="grid-column: span 2;">
      <h4 style="font-weight: 855; font-size: 15px; tracking: 0.15em; margin: 0 0 16px 0; font-family: 'Space Grotesk', sans-serif;">PAGESMITH LAB</h4>
      <p style="opacity: 0.7; line-height: 1.7; max-width: 420px; font-size: 12.5px; font-family: 'Inter', sans-serif;">
        {{ section.settings.brand_desc }}
      </p>
    </div>
    <div>
      <h5 style="font-weight: 750; margin: 0 0 16px 0; color: #a1a1aa; font-family: 'Space Grotesk', sans-serif; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;">Solutions & Collections</h5>
      <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-family: 'Inter', sans-serif; font-size: 12px;">
        <li><a href="#" style="color: inherit; text-decoration: none; opacity: 0.8; transition: opacity 0.2s ease;">📂 Finances & Budgets</a></li>
        <li><a href="#" style="color: inherit; text-decoration: none; opacity: 0.8; transition: opacity 0.2s ease;">📲 Réseaux Sociaux & Contenu</a></li>
        <li><a href="#" style="color: inherit; text-decoration: none; opacity: 0.8; transition: opacity 0.2s ease;">💼 Intelligence Entreprise</a></li>
      </ul>
    </div>
    <div>
      <h5 style="font-weight: 750; margin: 0 0 16px 0; color: #a1a1aa; font-family: 'Space Grotesk', sans-serif; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;">Aide & Support</h5>
      <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-family: 'Inter', sans-serif; font-size: 12px;">
        <li><a href="#" style="color: inherit; text-decoration: none; opacity: 0.8; transition: opacity 0.2s ease;">❓ FAQ générale</a></li>
        <li><a href="#" style="color: inherit; text-decoration: none; opacity: 0.8; transition: opacity 0.2s ease;">🛠️ Tuto d'intégration</a></li>
        <li><a href="#" style="color: inherit; text-decoration: none; opacity: 0.8; transition: opacity 0.2s ease;">✉️ Assistance 7j/7</a></li>
      </ul>
    </div>
  </div>
  <div style="max-w: 1250px; margin: 50px auto 0 auto; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; text-align: center; opacity: 0.6; font-size: 11px; font-family: 'Inter', sans-serif;">
    {{ section.settings.copyright | default: "© 2026 Pagesmith Lab. Tous droits réservés. Propulsé par Shopify." }}
  </div>
</footer>

{% schema %}
{
  "name": "PageSmith Footer",
  "settings": [
    {
      "type": "textarea",
      "id": "brand_desc",
      "label": "Brand Description",
      "default": "${defaultFooterDesc}"
    },
    {
      "type": "text",
      "id": "copyright",
      "label": "Copyright notice",
      "default": "${defaultFooterCopyright}"
    }
  ],
  "presets": [
    {
      "name": "PageSmith Footer"
    }
  ]
}
{% endschema %}`;
          break;
        }
      }

      if (content) {
        files.push({
          path: `sections/${mappedType}.liquid`,
          category: 'sections',
          name: `${mappedType}.liquid`,
          content: content,
          description: description
        });
      }
    });

    // Custom Liquid default helper file for existing themes
    if (exportMode === 'existing') {
      files.push({
        path: 'sections/custom-liquid.liquid',
        category: 'sections',
        name: 'custom-liquid.liquid',
        content: `{% comment %}
  Section Shopify de secours : Custom Liquid universel Pagesmith
{% endcomment %}
<div class="pagesmith-custom-block" style="
  background-color: ${themeSettings.backgroundColor};
  color: ${themeSettings.textColor};
  padding: 40px 16px;
">
  <div style="max-w: 1200px; margin: 0 auto;">
    {{ section.settings.custom_liquid }}
  </div>
</div>

{% schema %}
{
  "name": "Pagesmith Custom Liquid",
  "settings": [
    {
      "type": "liquid",
      "id": "custom_liquid",
      "label": "Custom Liquid / HTML Code",
      "default": "<p>Insérez tout code Liquid ou HTML de section ici.</p>"
    }
  ],
  "presets": [
    {
      "name": "Pagesmith Custom Liquid"
    }
  ]
}
{% endschema %}`,
        description: 'Utilisez ou écraser le fichier universel « sections/custom-liquid.liquid » de votre thème Dawn pour injecter dynamiquement du code HTML/Liquid sur vos fiches ou l’accueil.'
      });
    }

    // --- ASSETS ---
    files.push({
      path: 'assets/base.css',
      category: 'assets',
      name: 'base.css',
      content: `/* ==========================================================================
   PageSmith Custom Theme Integration - Styles de Rendu Visuel
   ========================================================================== */

/* 1. Importation des polices premium */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

/* 2. Variables CSS globales de Thème Pagesmith */
:root {
  --pagesmith-primary-color: ${themeSettings.primaryColor};
  --pagesmith-accent-color: ${themeSettings.accentColor};
  --pagesmith-bg-color: ${themeSettings.backgroundColor};
  --pagesmith-text-color: ${themeSettings.textColor};
  
  --pagesmith-radius-sm: 2px;
  --pagesmith-radius-md: 6px;
  --pagesmith-radius-lg: 12px;
  --pagesmith-radius-xl: 24px;
  --pagesmith-radius-full: 9999px;
  
  --pagesmith-transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 3. Intégration et alignement avec le Thème Dawn */
.pagesmith-announcement,
.pagesmith-header,
.pagesmith-hero,
.pagesmith-features,
.pagesmith-product-showcase,
.pagesmith-featured-collection,
.pagesmith-rich-text,
.pagesmith-testimonials,
.pagesmith-newsletter,
.pagesmith-footer {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  box-sizing: border-box;
}

/* 4. Effets interactifs avancés (Hover & Transitions) pour un rendu haut de gamme */
.product-card {
  transition: var(--pagesmith-transition);
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
}

.product-card img {
  transition: var(--pagesmith-transition);
}
.product-card:hover img {
  transform: scale(1.02);
}

/* 5. Personnalisation fine des boutons configurés */
.pagesmith-hero a, 
.pagesmith-product-showcase button,
.pagesmith-newsletter button {
  transition: var(--pagesmith-transition) !important;
}
.pagesmith-hero a:hover, 
.pagesmith-product-showcase button:hover,
.pagesmith-newsletter button:hover {
  filter: brightness(1.1) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

/* 6. Grille responsive et ajustement des espacements du thème Dawn */
@media screen and (max-width: 749px) {
  .pagesmith-hero {
    min-height: 400px !important;
    padding: 30px 16px !important;
  }
  .pagesmith-hero h2 {
    font-size: 28px !important;
  }
  .pagesmith-product-showcase {
    padding: 40px 16px !important;
  }
  .pagesmith-featured-collection {
    padding: 40px 16px !important;
  }
}`,
      description: 'AJOUT CONSEILLÉ : Collez ce bloc CSS de personnalisation à la toute fin de votre fichier d’origine « assets/base.css ». Il injecte de superbes typographies (Inter et JetBrains Mono) ainsi que des animations de cartes de produits haut de gamme.'
    });

    files.push({
      path: 'assets/quick-add.js',
      category: 'assets',
      name: 'quick-add.js',
      content: `// Pagesmith Integration Check: quick-add.js compatible
console.log("Pagesmith Drawer standard product addition compatible.");`,
      description: 'Déjà présent dans vos assets ! Aucune modification requise. Le système d’ajout rapide au panier (Quick Add Drawer) d’origine de votre thème Shopify gère automatiquement nos boutons d’action d’achat.'
    });

    files.push({
      path: 'assets/product-form.js',
      category: 'assets',
      name: 'product-form.js',
      content: `// Pagesmith Integration Check: product-form.js compatible
console.log("Pagesmith dynamic pricing calculations compatible.");`,
      description: 'Aucune modification requise. Votre script existant est conservé intact pour garantir le bon fonctionnement des sélections de variantes et d’options de panier.'
    });

    // --- CONFIGURATION ---
    files.push({
      path: 'config/settings_schema.json',
      category: 'config',
      name: 'settings_schema.json',
      content: `[
  {
    "name": "Design Pagesmith",
    "settings": [
      {
        "type": "header",
        "content": "Ajustement Visuel Global"
      },
      {
        "type": "color",
        "id": "theme_primary_color",
        "label": "Couleur Primaire (Boutons, Actions)",
        "default": "${themeSettings.primaryColor}"
      },
      {
        "type": "color",
        "id": "theme_accent_color",
        "label": "Couleur d'Accentuation",
        "default": "${themeSettings.accentColor}"
      },
      {
        "type": "color",
        "id": "theme_bg_color",
        "label": "Couleur de Fond de Page",
        "default": "${themeSettings.backgroundColor}"
      },
      {
        "type": "color",
        "id": "theme_text_color",
        "label": "Couleur Globale du Texte",
        "default": "${themeSettings.textColor}"
      },
      {
        "type": "range",
        "id": "theme_border_radius",
        "min": 0,
        "max": 32,
        "step": 2,
        "unit": "px",
        "label": "Arrondi des Boutons & Cartes",
        "default": ${buttonRadiusNum}
      }
    ]
  }
]`,
      description: 'Optionnel conseille. Remplacer ou fusionner le contenu de votre fichier existant « config/settings_schema.json » par ces lignes pour rajouter les contrôles dynamiques de couleurs Pagesmith directement dans votre éditeur natif de théme.'
    });

    files.push({
      path: 'config/settings_data.json',
      category: 'config',
      name: 'settings_data.json',
      content: `{
  "current": {
    "sections": {},
    "presets": {
      "Default": {
        "theme_primary_color": "${themeSettings.primaryColor}",
        "theme_accent_color": "${themeSettings.accentColor}",
        "theme_bg_color": "${themeSettings.backgroundColor}",
        "theme_text_color": "${themeSettings.textColor}",
        "theme_border_radius": ${buttonRadiusNum}
      }
    }
  }
}`,
      description: 'Sauvegarde de vos variables de couleurs et de boutons Pagesmith. À coller ou adapter dans votre fichier de sauvegarde « config/settings_data.json ».'
    });

    // --- LAYOUT ---
    files.push({
      path: 'layout/theme.liquid',
      category: 'layout',
      name: 'theme.liquid',
      content: `<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="{{ settings.theme_primary_color | default: '${themeSettings.primaryColor}' }}">
    <link rel="canonical" href="{{ canonical_url }}">

    {%- if settings.favicon != blank -%}
      <link rel="icon" type="image/png" href="{{ settings.favicon | image_url: width: 32, height: 32 }}">
    {%- endif -%}

    <title>
      {{ page_title }}
      {%- if current_tags %} &ndash; tagged "{{ current_tags | join: ', ' }}"{% endif -%}
      {%- if current_page != 1 %} &ndash; Page {{ current_page }}{% endif -%}
      {%- unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless -%}
    </title>

    {% if page_description %}
      <meta name="description" content="{{ page_description | escape }}">
    {% endif %}

    {{ content_for_header }}

    <!-- Pagesmith Embedded Stylesheets & Fonts -->
    {{ 'base.css' | asset_url | stylesheet_tag }}
    
    <style>
      :root {
        --font-sans-family: 'Inter', sans-serif;
        --font-mono-family: 'JetBrains Mono', monospace;
        --color-primary: {{ settings.theme_primary_color | default: '${themeSettings.primaryColor}' }};
        --color-bg-page: {{ settings.theme_bg_color | default: '${themeSettings.backgroundColor}' }};
        --color-text-page: {{ settings.theme_text_color | default: '${themeSettings.textColor}' }};
        --border-radius-buttons: {{ settings.theme_border_radius | default: '${buttonRadiusNum}' }}px;
      }
      
      body {
        background-color: var(--color-bg-page);
        color: var(--color-text-page);
        font-family: var(--font-sans-family);
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
      }
    </style>
  </head>

  <body>
    <!-- Top Global Announcement bar -->
    {%- section 'header-announcements' -%}

    <!-- Theme Header Area -->
    {%- section 'header' -%}

    <main id="MainContent" class="content-for-layout focus-none" role="main" tabindex="-1">
      {{ content_for_layout }}
    </main>

    <!-- Theme Footer Area -->
    {%- section 'footer' -%}

    <!-- Load standard scripts -->
    <script src="{{ 'quick-add.js' | asset_url }}" defer="defer"></script>
    <script src="{{ 'product-form.js' | asset_url }}" defer="defer"></script>
  </body>
</html>`,
      description: 'Modèle de disposition globale. Vous pouvez remplacer intégralement votre fichier existant d’origine « layout/theme.liquid » par ce code propre et rapide, configuré pour charger automatiquement base.css et configurer la grille de rendu.'
    });

    files.push({
      path: 'layout/password.liquid',
      category: 'layout',
      name: 'password.liquid',
      content: `<!doctype html>
<html class="no-js lang-{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>{{ shop.name }} - Espace Protégé</title>
    {{ content_for_header }}
    {{ 'base.css' | asset_url | stylesheet_tag }}
    <style>
      body {
        background: {{ settings.theme_bg_color | default: '${themeSettings.backgroundColor}' }};
        color: {{ settings.theme_text_color | default: '${themeSettings.textColor}' }};
        font-family: 'Inter', sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        margin: 0;
        text-align: center;
      }
      .password-card {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 40px;
        border-radius: {{ settings.theme_border_radius | default: '${buttonRadiusNum}' }}px;
        max-width: 450px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      }
      input {
        background: transparent;
        border: 1.5px solid rgba(255, 255, 255, 0.15);
        color: white;
        padding: 10px 15px;
        border-radius: 6px;
        width: 100%;
        margin-bottom: 12px;
        box-sizing: border-box;
      }
      button {
        background: {{ settings.theme_primary_color | default: '${themeSettings.primaryColor}' }};
        color: white;
        border: none;
        padding: 12px;
        font-weight: bold;
        border-radius: {{ settings.theme_border_radius | default: '${buttonRadiusNum}' }}px;
        width: 100%;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <!-- Required by Shopify parsing engine to allow layout saving -->
    <div style="display: none !important;">
      {{ content_for_layout }}
    </div>

    <div class="password-card">
      <h1 style="font-size: 24px; margin-bottom: 8px;">{{ shop.name }}</h1>
      <p style="opacity: 0.7; font-size: 14px; margin-bottom: 24px;">Bientôt disponible. Saisissez le mot de passe pour accéder à la boutique.</p>
      
      {%- form 'storefront_password', class: 'password-form' -%}
        {{ form.errors | default_errors }}
        <input type="password" name="password" placeholder="Mot de passe...">
        <button type="submit">Entrer</button>
      {%- endform -%}
    </div>
  </body>
</html>`,
      description: 'Modèle de disposition d’accès boutique en construction. Remplacez le fichier « layout/password.liquid » de votre boutique par ce layout pour conserver la cohérence visuelle.'
    });

    // --- LOCALES & SNIPPETS REMOVED TO PREVENT INTERFERENCE WITH EXISTING THEME STRUCTURE ---



    // Filter unique file paths (avoid duplicates e.g. multiple custom-liquid mappings)
    const uniqueFiles: ShopifyFile[] = [];
    const seenPaths = new Set<string>();
    
    files.forEach(f => {
      if (!seenPaths.has(f.path)) {
        seenPaths.add(f.path);
        uniqueFiles.push(f);
      }
    });

    return uniqueFiles;
  };

  const files = getFiles();
  const [selectedFilePath, setSelectedFilePath] = useState<string>(files[0]?.path || '');
  
  // Clean up selected state when switching tab modes
  const handleModeChange = (mode: 'existing' | 'new') => {
    setExportMode(mode);
    const newFiles = mode === 'existing' 
      ? [
          { path: 'templates/index.json' },
          { path: 'templates/product.json' },
          { path: 'sections/header-announcements.liquid' }
        ]
      : [
          { path: 'templates/product-pagesmith.json' }
        ];
    setSelectedFilePath(newFiles[0].path);
  };

  const activeFile = files.find(f => f.path === selectedFilePath) || files[0];

  if (!isOpen) return null;

  const handleCopy = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folder]: !prev[folder]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div id="export-template-modal" className="relative w-full max-w-5xl bg-zinc-900 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[85vh] z-50 animate-in fade-in zoom-in-95 duration-200 border border-zinc-850">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950 text-white shadow">
          <div className="flex items-center gap-2.5">
            <Code className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-semibold text-sm leading-none">Shopify Developer Workspace</h2>
              <p className="text-[10px] text-gray-400 mt-1">Preset actif: {preset.toUpperCase()} • Structure de Thème 2.0</p>
            </div>
          </div>
          <button
            id="close-export-modal"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Integration Strategy Choice Tabs */}
        <div className="bg-zinc-950 border-b border-zinc-800/60 p-2 flex gap-3">
          <button
            onClick={() => handleModeChange('existing')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all ${
              exportMode === 'existing'
                ? 'bg-amber-500 text-zinc-950 shadow-md transform scale-[1.01]'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Remplacer dans vos fichiers existants (CONSEILLÉ pour votre cas)</span>
          </button>
          <button
            onClick={() => handleModeChange('new')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all ${
              exportMode === 'new'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-white'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>2. Créer de nouveaux fichiers (Standard)</span>
          </button>
        </div>

        {/* Dynamic warning diagnosis banner */}
        <div className="bg-zinc-950 p-3.5 border-b border-zinc-800 flex gap-3 text-xs items-start">
          <AlertTriangle className={`w-4 h-4 ${exportMode === 'existing' ? 'text-amber-400' : 'text-zinc-500'} shrink-0 mt-0.5`} />
          <div>
            {exportMode === 'existing' ? (
              <>
                <span className="font-bold text-amber-400 block mb-0.5">Solution « FileSaveError » active (Aucun nouveau fichier nécessaire !)</span>
                <p className="leading-relaxed text-zinc-300 text-[11px]">
                  Puisque la création de nouveaux fichiers est bloquée dans votre configuration, nous avons lié notre export aux fichiers existants de votre thème Dawn. 
                  Il vous suffit de sélectionner vos fichiers existants à gauche (ex. <code className="bg-zinc-800 px-1 py-0.5 rounded font-mono text-white">header-announcements.liquid</code>) et d’y coller notre code. Le fichier <code className="bg-zinc-800 px-1 py-0.5 rounded font-mono text-white">templates/product.json</code> ou <code className="bg-zinc-800 px-1 py-0.5 rounded font-mono text-white">product.json</code> utilise ces mêmes fichiers sans déclencher d’erreur !
                </p>
              </>
            ) : (
              <>
                <span className="font-bold text-zinc-400 block mb-0.5">Mode de Création de Nouveaux Fichiers</span>
                <p className="leading-relaxed text-zinc-400 text-[11px]">
                  Cette méthode nécessite d’ajouter de nouveaux fichiers <code className="font-mono">.liquid</code> dans l’éditeur de votre boutique Shopify. Si vous rencontrez l'erreur <code className="text-red-400 font-mono">FileSaveError</code>, veuillez utiliser l’onglet 1 ci-dessus.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Info advice panel */}
        {activeFile && (
          <div className="bg-zinc-900 p-3 flex gap-3 text-xs text-zinc-300 items-start border-b border-zinc-800">
            <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-zinc-200">Comment appliquer ce fichier ?</span>
              <p className="leading-relaxed opacity-90 text-[11px] text-zinc-400">
                {activeFile.description}
              </p>
            </div>
          </div>
        )}

        {/* Main Workspace split panel */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Panel: Theme File Tree Explorer */}
          <div className="w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col overflow-y-auto select-none p-3">
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-3 px-1">Dossiers Thème Shopify Actif</div>
            
            {/* Templates folder */}
            <div className="mb-3">
              <div 
                className="flex items-center gap-1.5 py-1 text-zinc-300 hover:text-white cursor-pointer px-1 rounded hover:bg-zinc-900 text-xs" 
                onClick={() => toggleFolder('templates')}
              >
                {expandedFolders.templates ? <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" /> : <Folder className="w-4 h-4 text-amber-500 shrink-0" />}
                <span className="font-bold">templates /</span>
              </div>
              
              {expandedFolders.templates && (
                <div className="pl-4 mt-0.5 space-y-0.5">
                  {files.filter(f => f.category === 'templates').map(file => (
                    <div
                      key={file.path}
                      onClick={() => setSelectedFilePath(file.path)}
                      className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer text-xs transition-colors ${
                        selectedFilePath === file.path 
                          ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm' 
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                      }`}
                    >
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${selectedFilePath === file.path ? 'text-zinc-950' : 'text-zinc-500'}`} />
                      <span className="font-mono text-[11px] truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sections folder */}
            <div className="mb-4">
              <div 
                className="flex items-center gap-1.5 py-1 text-zinc-300 hover:text-white cursor-pointer px-1 rounded hover:bg-zinc-900 text-xs" 
                onClick={() => toggleFolder('sections')}
              >
                {expandedFolders.sections ? <FolderOpen className="w-4 h-4 text-indigo-400 shrink-0" /> : <Folder className="w-4 h-4 text-indigo-400 shrink-0" />}
                <span className="font-bold">sections /</span>
              </div>
              
              {expandedFolders.sections && (
                <div className="pl-4 mt-0.5 space-y-0.5">
                  {files.filter(f => f.category === 'sections').map(file => (
                    <div
                      key={file.path}
                      onClick={() => setSelectedFilePath(file.path)}
                      className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer text-xs transition-colors ${
                        selectedFilePath === file.path 
                          ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                      }`}
                    >
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${selectedFilePath === file.path ? 'text-white' : 'text-indigo-400'}`} />
                      <span className="font-mono text-[11px] truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assets folder */}
            <div className="mb-4">
              <div 
                className="flex items-center gap-1.5 py-1 text-zinc-300 hover:text-white cursor-pointer px-1 rounded hover:bg-zinc-900 text-xs" 
                onClick={() => toggleFolder('assets')}
              >
                {expandedFolders.assets ? <FolderOpen className="w-4 h-4 text-emerald-400 shrink-0" /> : <Folder className="w-4 h-4 text-emerald-400 shrink-0" />}
                <span className="font-bold">assets /</span>
              </div>
              
              {expandedFolders.assets && (
                <div className="pl-4 mt-0.5 space-y-0.5">
                  {files.filter(f => f.category === 'assets').map(file => (
                    <div
                      key={file.path}
                      onClick={() => setSelectedFilePath(file.path)}
                      className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer text-xs transition-colors ${
                        selectedFilePath === file.path 
                          ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm' 
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                      }`}
                    >
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${selectedFilePath === file.path ? 'text-zinc-950' : 'text-emerald-400'}`} />
                      <span className="font-mono text-[11px] truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Layout folder */}
            <div className="mb-4">
              <div 
                className="flex items-center gap-1.5 py-1 text-zinc-300 hover:text-white cursor-pointer px-1 rounded hover:bg-zinc-900 text-xs" 
                onClick={() => toggleFolder('layout')}
              >
                {expandedFolders.layout ? <FolderOpen className="w-4 h-4 text-violet-400 shrink-0" /> : <Folder className="w-4 h-4 text-violet-400 shrink-0" />}
                <span className="font-bold">layout /</span>
              </div>
              
              {expandedFolders.layout && (
                <div className="pl-4 mt-0.5 space-y-0.5">
                  {files.filter(f => f.category === 'layout').map(file => (
                    <div
                      key={file.path}
                      onClick={() => setSelectedFilePath(file.path)}
                      className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer text-xs transition-colors ${
                        selectedFilePath === file.path 
                          ? 'bg-violet-500 text-zinc-950 font-bold shadow-sm' 
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                      }`}
                    >
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${selectedFilePath === file.path ? 'text-zinc-950' : 'text-violet-400'}`} />
                      <span className="font-mono text-[11px] truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Config folder */}
            <div className="mb-4">
              <div 
                className="flex items-center gap-1.5 py-1 text-zinc-300 hover:text-white cursor-pointer px-1 rounded hover:bg-zinc-900 text-xs" 
                onClick={() => toggleFolder('config')}
              >
                {expandedFolders.config ? <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" /> : <Folder className="w-4 h-4 text-amber-500 shrink-0" />}
                <span className="font-bold">config /</span>
              </div>
              
              {expandedFolders.config && (
                <div className="pl-4 mt-0.5 space-y-0.5">
                  {files.filter(f => f.category === 'config').map(file => (
                    <div
                      key={file.path}
                      onClick={() => setSelectedFilePath(file.path)}
                      className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer text-xs transition-colors ${
                        selectedFilePath === file.path 
                          ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm' 
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                      }`}
                    >
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${selectedFilePath === file.path ? 'text-zinc-950' : 'text-amber-500'}`} />
                      <span className="font-mono text-[11px] truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            

          </div>

          {/* Right Panel: Code Workspace Viewer */}
          <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
            
            {/* Code header controls */}
            {activeFile && (
              <div className="bg-zinc-900/60 border-b border-zinc-800/80 px-4 py-2.5 flex items-center justify-between">
                <span className="font-mono text-xs text-zinc-300 font-semibold bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                  {activeFile.path}
                </span>

                <div className="flex gap-2">
                  <button
                    id="copy-code-btn"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-750 text-zinc-150 text-xs font-bold rounded transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        Copié!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-500" />
                        Copier le Code
                      </>
                    )}
                  </button>

                  <button
                    id="download-code-btn"
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Télécharger
                  </button>
                </div>
              </div>
            )}

            {/* Code scrolling window */}
            {activeFile ? (
              <div className="flex-1 overflow-auto p-4 bg-zinc-950">
                <pre className="text-[11px] font-mono text-emerald-400 leading-relaxed overflow-x-auto select-all p-4 bg-zinc-900/80 rounded-lg border border-zinc-800">
                  <code>{activeFile.content}</code>
                </pre>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-500 text-xs font-sans">
                Veuillez sélectionner un fichier à explorer dans le dossier de gauche.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-850 flex justify-between items-center text-[10px] text-zinc-550 font-sans shadow-inner">
          <span className="text-zinc-500">Les fichiers générés respectent rigoureusement les normes de l'éditeur officiel Shopify Online Store 2.0.</span>
          <button
            id="export-close-footer"
            onClick={onClose}
            className="p-1.5 px-5 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-semibold text-xs border border-zinc-700 hover:border-zinc-600 transition-colors"
          >
            Fermer l'espace
          </button>
        </div>
      </div>
    </div>
  );
}
