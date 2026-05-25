import React, { useState } from 'react';
import { 
  Palette, Sliders, ChevronLeft, Eye, EyeOff, Layout,
  ArrowUp, ArrowDown, Sparkles, Wand2, Plus, CornerDownRight, 
  Trash2, HelpCircle, AlignLeft, Info
} from 'lucide-react';
import { ShopifySection, ThemeSettings, ThemePreset, Product } from '../types';
import { THEME_PRESETS, PRODUCTS } from '../data/initialData';

interface ThemeCustomizerProps {
  sections: ShopifySection[];
  setSections: React.Dispatch<React.SetStateAction<ShopifySection[]>>;
  themeSettings: ThemeSettings;
  setThemeSettings: React.Dispatch<React.SetStateAction<ThemeSettings>>;
  preset: ThemePreset;
  setPreset: (preset: ThemePreset) => void;
  activeSectionId: string | null;
  setActiveSectionId: (id: string | null) => void;
  onOpenExport: () => void;
}

export default function ThemeCustomizer({
  sections,
  setSections,
  themeSettings,
  setThemeSettings,
  preset,
  setPreset,
  activeSectionId,
  setActiveSectionId,
  onOpenExport,
}: ThemeCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'sections' | 'theme-settings'>('sections');
  
  const activeSection = sections.find((s) => s.id === activeSectionId);

  // Apply preset default settings
  const handleApplyPreset = (key: ThemePreset) => {
    setPreset(key);
    setThemeSettings(THEME_PRESETS[key].settings);
  };

  const handleUpdateSetting = (key: keyof ThemeSettings, value: any) => {
    setThemeSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleUpdateSectionSetting = (sectionId: string, settingKey: string, val: any) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            settings: {
              ...sec.settings,
              [settingKey]: val,
            },
          };
        }
        return sec;
      })
    );
  };

  // Reordering sections
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    // Prevent moving announcement or footer out of logical positions
    const item = sections[index];
    if (item.type === 'announcement' || item.type === 'footer' || item.type === 'header') {
      return; // Keep standard page landmarks anchored
    }
    const targetItem = sections[targetIndex];
    if (targetItem.type === 'announcement' || targetItem.type === 'footer' || targetItem.type === 'header') {
      return; // Don't step over landmarks
    }

    const newSections = [...sections];
    newSections[index] = targetItem;
    newSections[targetIndex] = item;
    setSections(newSections);
  };

  // Toggle Section Enabled Status
  const handleToggleSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, enabled: !sec.enabled } : sec))
    );
  };

  // Append new section to preview
  const handleAddRandomSection = (type: string) => {
    let newSec: ShopifySection;
    const randomId = `${type}_${Math.floor(Math.random() * 1000)}`;

    if (type === 'rich-text') {
      newSec = {
        id: randomId,
        type: 'rich-text',
        enabled: true,
        name: 'Editorial Text Paragraph',
        settings: {
          title: 'Conscious Sourcing Principles',
          text: 'Every line we manifest is verified under third-party ethical audit councils. Rest easy knowing absolute transparency is woven into the very fibre of our catalog.',
          buttonText: 'Read Audits',
          align: 'left',
        },
      };
    } else if (type === 'testimonials') {
      newSec = {
        id: randomId,
        type: 'testimonials',
        enabled: true,
        name: 'Client Testimonial Feed',
        settings: {
          title: 'What Patrons Say',
          items: [
            {
              quote: 'Exquisite attention to structural balance. The details are understated but extremely premium.',
              author: 'Julian R.',
              role: 'Product Lead, London',
              rating: 5,
            },
          ],
        },
      };
    } else {
      // Default fallback simple featured
      newSec = {
        id: randomId,
        type: 'rich-text',
        enabled: true,
        name: 'Interactive Section Block',
        settings: {
          title: 'New Dynamic Section Block',
          text: 'Customize this block contents inside the live designer left-control sidebar to design gorgeous Shopify variations!',
          alignment: 'center',
        },
      };
    }

    // Insert just before footer
    const footerIndex = sections.findIndex((s) => s.type === 'footer');
    if (footerIndex !== -1) {
      const updated = [...sections];
      updated.splice(footerIndex, 0, newSec);
      setSections(updated);
      setActiveSectionId(newSec.id);
    } else {
      setSections([...sections, newSec]);
      setActiveSectionId(newSec.id);
    }
  };

  const handleDeleteSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSections((prev) => prev.filter((sec) => sec.id !== id));
    if (activeSectionId === id) setActiveSectionId(null);
  };

  return (
    <div className="w-80 border-r border-gray-250 bg-white flex flex-col h-full shrink-0 select-none z-10" id="shopify-theme-customizer">
      
      {/* Brand logo header */}
      <div className="p-4 border-b border-gray-200 bg-zinc-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Wand2 className="w-5 h-5 text-amber-500" />
          <h1 className="font-extrabold text-xs tracking-wider uppercase font-sans">
            Pagesmith <span className="text-amber-500 font-medium lowercase">v2.0</span>
          </h1>
        </div>
        <div className="bg-zinc-800 text-[10px] font-bold text-gray-300 px-2 py-0.5 rounded font-mono">
          Avis d'Édition
        </div>
      </div>

      {/* Primary tab workspace panels */}
      {!activeSection ? (
        <>
          {/* Main workspace navigation tabs */}
          <div className="grid grid-cols-2 text-center border-b border-gray-200 text-xs font-bold tracking-wider uppercase text-gray-550 bg-gray-55">
            <button
              id="customizer-sections-tab"
              onClick={() => setActiveTab('sections')}
              className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'sections'
                  ? 'border-zinc-900 text-zinc-900 font-extrabold bg-white'
                  : 'border-transparent hover:text-gray-900 hover:bg-gray-100/30'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              Sections
            </button>
            <button
              id="customizer-settings-tab"
              onClick={() => setActiveTab('theme-settings')}
              className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'theme-settings'
                  ? 'border-zinc-900 text-zinc-900 font-extrabold bg-white'
                  : 'border-transparent hover:text-gray-900 hover:bg-gray-100/30'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Style Boutiques
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {activeTab === 'sections' ? (
              /* SECTIONS SCHEMAS MANAGEMENT */
              <div className="space-y-4">
                <div role="status" className="bg-zinc-50 p-3 rounded-lg border border-zinc-150 text-[11px] leading-relaxed text-zinc-650 flex items-start gap-2">
                  <Info className="w-4 h-4 text-zinc-800 shrink-0 mt-0.5" />
                  <p>
                    Réorganisez l'ordre à l'aide des flèches, ou cliquez sur une section pour en éditer les options (titres, images, styles).
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">
                    Structure des Sections
                  </h3>

                  {sections.map((sec, index) => {
                    // Landmark sections (Header / Announcement / Footer cannot be moved or deleted easily)
                    const isLandmark = ['announcement', 'header', 'footer'].includes(sec.type);

                    return (
                      <div
                        id={`customizer-section-item-${sec.id}`}
                        key={sec.id}
                        onClick={() => sec.enabled && setActiveSectionId(sec.id)}
                        className={`group p-2.5 rounded border transition-all flex items-center justify-between text-xs relative ${
                          sec.enabled
                            ? 'bg-white border-gray-200 hover:border-gray-900 cursor-pointer'
                            : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isLandmark ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          )}
                          <span className="font-semibold truncate pr-1">
                            {sec.name}
                          </span>
                        </div>

                        {/* Order & visibility controls */}
                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          {!isLandmark && sec.enabled && (
                            <>
                              <button
                                id={`move-sec-up-${sec.id}`}
                                disabled={index <= 2} // Skip past announcement & header
                                onClick={() => handleMoveSection(index, 'up')}
                                className="p-1 rounded text-gray-400 hover:text-zinc-900 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                                title="Monter la section"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                id={`move-sec-down-${sec.id}`}
                                disabled={index >= sections.length - 2} // Skip footer
                                onClick={() => handleMoveSection(index, 'down')}
                                className="p-1 rounded text-gray-400 hover:text-zinc-900 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                                title="Descendre la section"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          <button
                            id={`toggle-sec-${sec.id}`}
                            onClick={(e) => handleToggleSection(sec.id, e)}
                            className="p-1 rounded text-gray-400 hover:text-zinc-900 hover:bg-gray-100"
                            title={sec.enabled ? "Masquer la section" : "Afficher la section"}
                          >
                            {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          {!isLandmark && (
                            <button
                              id={`delete-sec-${sec.id}`}
                              onClick={(e) => handleDeleteSection(sec.id, e)}
                              className="p-1 rounded text-gray-400 hover:text-red-700 hover:bg-red-50"
                              title="Supprimer la section"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Adding new parts */}
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                    Ajouter une section
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <button
                      id="add-sec-rich-text"
                      onClick={() => handleAddRandomSection('rich-text')}
                      className="p-2 border border-dashed border-gray-300 hover:border-zinc-800 text-gray-600 hover:text-zinc-900 text-center rounded flex items-center justify-center gap-1 transition-all"
                    >
                      <Plus className="w-3 h-3" /> Zone de texte
                    </button>
                    <button
                      id="add-sec-testimonials"
                      onClick={() => handleAddRandomSection('testimonials')}
                      className="p-2 border border-dashed border-gray-300 hover:border-zinc-800 text-gray-600 hover:text-zinc-900 text-center rounded flex items-center justify-center gap-1 transition-all"
                    >
                      <Plus className="w-3 h-3" /> Flux de témoignages
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* THEME STYLE CONTROLS & PRESET CHOICE */
              <div className="space-y-5">
                {/* 1. Theme Presets */}
                <div className="space-y-2">
                  <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                    Styles d'ambiance prédéfinis
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((key) => {
                      const isSelected = preset === key;
                      return (
                        <button
                          key={key}
                          id={`preset-btn-${key}`}
                          onClick={() => handleApplyPreset(key)}
                          className={`p-2.5 rounded text-left border text-xs transition-all relative overflow-hidden ${
                            isSelected
                              ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                              : 'bg-white text-gray-800 border-gray-200 hover:border-gray-900'
                          }`}
                        >
                          <span className="font-extrabold block text-[11px] font-serif capitalize">
                            {THEME_PRESETS[key].name.split(' (')[0]}
                          </span>
                          <span className="text-[9px] text-gray-400 block line-clamp-1 mt-0.5">
                            Préréglage {THEME_PRESETS[key].name.split(' (')[1].replace(')', '')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Color Controls */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                    Palette de Couleurs
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-600">Couleur de fond</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          id="color-bg-picker"
                          type="color"
                          value={themeSettings.backgroundColor}
                          onChange={(e) => handleUpdateSetting('backgroundColor', e.target.value)}
                          className="w-6 h-6 rounded border-0 cursor-pointer"
                        />
                        <span className="font-mono text-[10px] text-gray-400 uppercase">
                          {themeSettings.backgroundColor}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-600">Boutons & Éléments</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          id="color-primary-picker"
                          type="color"
                          value={themeSettings.primaryColor}
                          onChange={(e) => handleUpdateSetting('primaryColor', e.target.value)}
                          className="w-6 h-6 rounded border-0 cursor-pointer"
                        />
                        <span className="font-mono text-[10px] text-gray-400 uppercase">
                          {themeSettings.primaryColor}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-600">Accentuation visuelle</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          id="color-accent-picker"
                          type="color"
                          value={themeSettings.accentColor}
                          onChange={(e) => handleUpdateSetting('accentColor', e.target.value)}
                          className="w-6 h-6 rounded border-0 cursor-pointer"
                        />
                        <span className="font-mono text-[10px] text-gray-400 uppercase">
                          {themeSettings.accentColor}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-600">Fond des cartes</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          id="color-cardbg-picker"
                          type="color"
                          value={themeSettings.cardBackgroundColor}
                          onChange={(e) => handleUpdateSetting('cardBackgroundColor', e.target.value)}
                          className="w-6 h-6 rounded border-0 cursor-pointer"
                        />
                        <span className="font-mono text-[10px] text-gray-400 uppercase">
                          {themeSettings.cardBackgroundColor}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center font-sans">
                      <span className="font-semibold text-gray-600">Couleur du texte</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          id="color-text-picker"
                          type="color"
                          value={themeSettings.textColor}
                          onChange={(e) => handleUpdateSetting('textColor', e.target.value)}
                          className="w-6 h-6 rounded border-0 cursor-pointer"
                        />
                        <span className="font-mono text-[10px] text-gray-400 uppercase">
                          {themeSettings.textColor}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Typography Option */}
                <div className="space-y-2 pt-3 border-t border-gray-100">
                  <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                    Typographie
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-semibold block text-gray-600 mb-1">Police de caractères</span>
                      <div className="grid grid-cols-3 gap-1 grid-flow-col">
                        {(['sans', 'serif', 'mono'] as const).map((font) => (
                          <button
                            key={font}
                            id={`font-btn-${font}`}
                            onClick={() => handleUpdateSetting('fontFamily', font)}
                            className={`py-1 rounded text-center border text-[10px] transition-all capitalize font-semibold ${
                              themeSettings.fontFamily === font
                                ? 'bg-zinc-900 border-zinc-900 text-white'
                                : 'bg-white border-gray-250 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {font}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-600">Boutons en majuscules</span>
                      <input
                        id="uppercase-toggle"
                        type="checkbox"
                        checked={themeSettings.uppercaseButtons}
                        onChange={(e) => handleUpdateSetting('uppercaseButtons', e.target.checked)}
                        className="w-4 h-4 text-zinc-900 rounded border-gray-350 focus:ring-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Layout & Cards Style */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                    Mise en page & Bordures
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-semibold block text-gray-600 mb-1">Arrondi des angles (Boutons)</span>
                      <div className="grid grid-cols-5 gap-1.5 text-center">
                        {(['none', 'sm', 'md', 'lg', 'full'] as const).map((r) => (
                          <button
                            key={r}
                            id={`btn-radius-${r}`}
                            onClick={() => handleUpdateSetting('buttonRadius', r)}
                            className={`py-1 rounded border text-[10px] font-medium transition-all ${
                              themeSettings.buttonRadius === r
                                ? 'bg-zinc-950 border-zinc-950 text-white font-bold'
                                : 'bg-white border-gray-250 text-gray-700 hover:bg-gray-55'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-600">Afficher les contours de section</span>
                      <input
                        id="show-borders-toggle"
                        type="checkbox"
                        checked={themeSettings.showBorders}
                        onChange={(e) => {
                          handleUpdateSetting('showBorders', e.target.checked);
                          handleUpdateSetting('borderWidth', e.target.checked ? 1 : 0);
                        }}
                        className="w-4 h-4 text-zinc-900 rounded border-gray-300 focus:ring-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export action button */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col gap-2">
            <button
              id="export-schema-btn"
              onClick={onOpenExport}
              className="w-full bg-zinc-900 hover:bg-black text-white text-xs font-bold py-3 px-4 rounded transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-500" />
              Code Liquid d'exportation Shopify
            </button>
            <p className="text-[10px] text-gray-400 text-center font-sans">
              Téléchargez la configuration du thème pour votre CLI Shopify
            </p>
          </div>
        </>
      ) : (
        /* SINGLE ACTIVE SECTION CONTENT WRITER SETTINGS */
        <div className="flex-1 flex flex-col h-full bg-white">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2 text-xs font-bold text-gray-800">
            <button
              id="exit-section-edit"
              onClick={() => setActiveSectionId(null)}
              className="p-1 rounded text-gray-500 hover:text-black hover:bg-gray-200 transition-colors"
              title="Retour"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="truncate">Configuration : {activeSection.name}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Contextual section content inputs */}
            {activeSection.type === 'announcement' && (
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Announcement Text</label>
                  <textarea
                    id="edit-announcement-text"
                    value={activeSection.settings.text}
                    onChange={(e) => handleUpdateSectionSetting('announcement', 'text', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 p-2 text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-zinc-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Link Prompt Badge</label>
                  <input
                    id="edit-announcement-link"
                    type="text"
                    value={activeSection.settings.linkText}
                    onChange={(e) => handleUpdateSectionSetting('announcement', 'linkText', e.target.value)}
                    className="w-full border border-gray-200 p-2 text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-zinc-800"
                  />
                </div>
              </div>
            )}

            {activeSection.type === 'header' && (
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Brand Logo Text</label>
                  <input
                    id="edit-header-logo"
                    type="text"
                    value={activeSection.settings.logoText}
                    onChange={(e) => handleUpdateSectionSetting('header', 'logoText', e.target.value)}
                    className="w-full border border-gray-200 p-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-zinc-800"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-600">Sticky Navigation</span>
                  <input
                    id="edit-header-sticky"
                    type="checkbox"
                    checked={activeSection.settings.sticky}
                    onChange={(e) => handleUpdateSectionSetting('header', 'sticky', e.target.checked)}
                    className="w-4 h-4 text-zinc-900 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeSection.type === 'hero' && (
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Banner Height</label>
                  <select
                    id="edit-hero-height"
                    value={activeSection.settings.bannerHeight}
                    onChange={(e) => handleUpdateSectionSetting('hero', 'bannerHeight', e.target.value)}
                    className="w-full border border-gray-200 p-2 rounded focus:outline-none"
                  >
                    <option value="small">Small Content</option>
                    <option value="medium">Standard Medium</option>
                    <option value="large">Big Cinematic Frame</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-600 mb-1">Promotional Heading</label>
                  <textarea
                    id="edit-hero-heading"
                    value={activeSection.settings.heading}
                    onChange={(e) => handleUpdateSectionSetting('hero', 'heading', e.target.value)}
                    rows={2}
                    className="w-full border border-gray-200 p-2 text-xs rounded-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-600 mb-1">Subtitle Text</label>
                  <textarea
                    id="edit-hero-subheading"
                    value={activeSection.settings.subheading}
                    onChange={(e) => handleUpdateSectionSetting('hero', 'subheading', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 p-2 text-xs rounded-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-600 mb-1">Core CTA Button Label</label>
                  <input
                    id="edit-hero-button"
                    type="text"
                    value={activeSection.settings.buttonText}
                    onChange={(e) => handleUpdateSectionSetting('hero', 'buttonText', e.target.value)}
                    className="w-full border border-gray-200 p-2 text-xs rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-600 mb-1">Dark Overlay Opacity (%)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      id="edit-hero-overlay"
                      type="range"
                      min="10"
                      max="80"
                      step="5"
                      value={activeSection.settings.overlayOpacity}
                      onChange={(e) => handleUpdateSectionSetting('hero', 'overlayOpacity', parseInt(e.target.value))}
                      className="flex-1 cursor-pointer accent-zinc-800"
                    />
                    <span className="font-bold font-mono w-6 text-right">{activeSection.settings.overlayOpacity}%</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-600 mb-1">Alternate Background (Unsplash CDN)</label>
                  <input
                    id="edit-hero-image"
                    type="text"
                    value={activeSection.settings.imageSrc}
                    onChange={(e) => handleUpdateSectionSetting('hero', 'imageSrc', e.target.value)}
                    className="w-full border border-gray-200 p-2 text-xs rounded font-mono truncate focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeSection.type === 'product-showcase' && (
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Anchor Product Model</label>
                  <select
                    id="edit-showcase-product-id"
                    value={activeSection.settings.productId}
                    onChange={(e) => handleUpdateSectionSetting(activeSection.id, 'productId', e.target.value)}
                    className="w-full border border-gray-200 p-2 rounded focus:outline-none"
                  >
                    {PRODUCTS.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.title} ({prod.price.toFixed(2)}€)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-600">Render Material Specs</span>
                  <input
                    id="edit-showcase-specs"
                    type="checkbox"
                    checked={activeSection.settings.showSpecs}
                    onChange={(e) => handleUpdateSectionSetting(activeSection.id, 'showSpecs', e.target.checked)}
                    className="w-4 h-4 text-zinc-900 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-600">Render Installment Text</span>
                  <input
                    id="edit-showcase-installments"
                    type="checkbox"
                    checked={activeSection.settings.enableInstallments}
                    onChange={(e) => handleUpdateSectionSetting(activeSection.id, 'enableInstallments', e.target.checked)}
                    className="w-4 h-4 text-zinc-900 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeSection.type === 'featured-collection' && (
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Grid Columns (Desktop)</label>
                  <input
                    id="edit-collection-cols"
                    type="number"
                    min="2"
                    max="4"
                    value={activeSection.settings.columns}
                    onChange={(e) => handleUpdateSectionSetting(activeSection.id, 'columns', parseInt(e.target.value))}
                    className="w-full border border-gray-200 p-2 text-xs rounded-sm focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-600">Render Ratings Badge</span>
                  <input
                    id="edit-collection-rating"
                    type="checkbox"
                    checked={activeSection.settings.showRating}
                    onChange={(e) => handleUpdateSectionSetting(activeSection.id, 'showRating', e.target.checked)}
                    className="w-4 h-4 text-zinc-900 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeSection.type === 'rich-text' && (
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Section Title</label>
                  <input
                    id="edit-rich-title"
                    type="text"
                    value={activeSection.settings.title}
                    onChange={(e) => handleUpdateSectionSetting(activeSection.id, 'title', e.target.value)}
                    className="w-full border border-gray-200 p-2 text-xs rounded-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-600 mb-1">Paragraph Text</label>
                  <textarea
                    id="edit-rich-text"
                    value={activeSection.settings.text}
                    onChange={(e) => handleUpdateSectionSetting(activeSection.id, 'text', e.target.value)}
                    rows={4}
                    className="w-full border border-gray-200 p-2 text-xs rounded-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-600 mb-1">Action Button Text</label>
                  <input
                    id="edit-rich-btn"
                    type="text"
                    value={activeSection.settings.buttonText}
                    onChange={(e) => handleUpdateSectionSetting(activeSection.id, 'buttonText', e.target.value)}
                    className="w-full border border-gray-200 p-2 text-xs rounded-sm"
                  />
                </div>
              </div>
            )}

            {activeSection.type === 'testimonials' && (
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Section Header Text</label>
                  <input
                    id="edit-testimonials-title"
                    type="text"
                    value={activeSection.settings.title}
                    onChange={(e) => handleUpdateSectionSetting(activeSection.id, 'title', e.target.value)}
                    className="w-full border border-gray-200 p-2 rounded focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeSection.type === 'newsletter' && (
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Newsletter Title</label>
                  <input
                    id="edit-newsletter-title"
                    type="text"
                    value={activeSection.settings.title}
                    onChange={(e) => handleUpdateSectionSetting(activeSection.id, 'title', e.target.value)}
                    className="w-full border border-gray-200 p-2 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Description</label>
                  <textarea
                    id="edit-newsletter-desc"
                    value={activeSection.settings.description}
                    onChange={(e) => handleUpdateSectionSetting(activeSection.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 p-2 text-xs rounded-sm focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeSection.type === 'footer' && (
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Brand Statement</label>
                  <textarea
                    id="edit-footer-brand"
                    value={activeSection.settings.brandDesc}
                    onChange={(e) => handleUpdateSectionSetting('footer', 'brandDesc', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 p-2 text-xs rounded-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Copyright Line</label>
                  <input
                    id="edit-footer-copy"
                    type="text"
                    value={activeSection.settings.copyright}
                    onChange={(e) => handleUpdateSectionSetting('footer', 'copyright', e.target.value)}
                    className="w-full border border-gray-200 p-2 text-xs rounded-sm focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-250 bg-gray-50 flex justify-between">
            <button
              id="section-save-back"
              onClick={() => setActiveSectionId(null)}
              className="w-full bg-zinc-900 hover:bg-black text-white text-xs font-semibold py-2 px-4 rounded text-center transition-all"
            >
              Return to Sections Layout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
