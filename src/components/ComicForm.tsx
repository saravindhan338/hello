import React, { useState } from "react";
import { Sparkles, Wand2, RefreshCw, Palette, Compass, User, Smile, Flame, ShieldAlert, HeartHandshake, Eye, Skull } from "lucide-react";
import { ComicArtStyle, ComicTone } from "../types/comic";

interface ComicFormProps {
  onGenerate: (data: {
    prompt: string;
    characterName: string;
    setting: string;
    tone: ComicTone;
    artStyle: ComicArtStyle;
    panelCount: number;
    secondaryCharacters?: string;
  }) => void;
  isGenerating: boolean;
  activeTone: ComicTone;
  activeArtStyle: ComicArtStyle;
  initialPrompt?: string;
  initialCharacter?: string;
  initialSetting?: string;
}

const TONE_OPTIONS: Array<{
  id: ComicTone;
  label: string;
  desc: string;
  icon: string;
  color: string;
}> = [
  { id: "dramatic", label: "Dramatic", desc: "Cinematic tension, high stakes & emotional gravity", icon: "⚡", color: "from-amber-600/30 to-amber-900/30 border-amber-500/40" },
  { id: "funny", label: "Funny / Humorous", desc: "Light-hearted slapstick, witty dialogue & visual gags", icon: "😂", color: "from-yellow-500/30 to-amber-600/30 border-yellow-500/40" },
  { id: "action", label: "Action-Packed", desc: "Explosive movement, intense battles & fast pacing", icon: "💥", color: "from-red-600/30 to-orange-700/30 border-red-500/40" },
  { id: "mysterious", label: "Mysterious / Noir", desc: "Cryptic clues, eerie shadows & investigator intrigue", icon: "🔍", color: "from-purple-600/30 to-indigo-900/30 border-purple-500/40" },
  { id: "whimsical", label: "Whimsical", desc: "Fairytale charm, enchanted creatures & playful magic", icon: "✨", color: "from-emerald-500/30 to-teal-800/30 border-emerald-500/40" },
  { id: "dark-noir", label: "Dark Noir", desc: "Gritty streets, brooding monologues & stark shadows", icon: "🌑", color: "from-slate-700/40 to-slate-900/40 border-slate-500/40" },
  { id: "heartwarming", label: "Heartwarming", desc: "Wholesome friendships, cozy moments & triumphs", icon: "💖", color: "from-pink-600/30 to-rose-900/30 border-pink-500/40" },
];

const ART_STYLES: Array<{
  id: ComicArtStyle;
  label: string;
  desc: string;
  badge: string;
  sampleImg: string;
}> = [
  {
    id: "comic book",
    label: "Classic Comic Book",
    desc: "Western inked linework, bold cel-shading & silver-age halftone dots",
    badge: "POW!",
    sampleImg: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=75",
  },
  {
    id: "anime",
    label: "Anime / Manga",
    desc: "Japanese anime screencap, expressive eyes & cinematic lighting",
    badge: "MANGA",
    sampleImg: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=75",
  },
  {
    id: "noir graphic novel",
    label: "Noir Graphic Novel",
    desc: "High contrast chiaroscuro, heavy ink shadows & gritty textures",
    badge: "NOIR",
    sampleImg: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=75",
  },
  {
    id: "watercolor fantasy",
    label: "Watercolor Fantasy",
    desc: "Dreamy wet-on-wet pigments, delicate lineart & storybook glow",
    badge: "STORYBOOK",
    sampleImg: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=75",
  },
  {
    id: "cyberpunk synthwave",
    label: "Cyberpunk Synthwave",
    desc: "Neon cyan and magenta lights, futuristic cybernetic flair",
    badge: "NEON",
    sampleImg: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=400&q=75",
  },
  {
    id: "cartoon",
    label: "Saturday Cartoon",
    desc: "Bright cheerful colors, playful vector outlines & cartoon physics",
    badge: "TOON",
    sampleImg: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=400&q=75",
  },
  {
    id: "vintage halftone",
    label: "Vintage 1960s Print",
    desc: "Aged pulp paper grain, retro CMYK printing plates & nostalgic warmth",
    badge: "RETRO",
    sampleImg: "https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=400&q=75",
  },
];

const PROMPT_SUGGESTIONS = [
  {
    scenario: "Scenario 1 (Dramatic)",
    prompt: "A brave fox exploring an enchanted forest.",
    character: "Rusty",
    setting: "Enchanted Lumina Forest",
    tone: "dramatic" as ComicTone,
    style: "anime" as ComicArtStyle,
  },
  {
    scenario: "Scenario 2 (Funny)",
    prompt: "A clumsy robot detective trying to solve the mystery of the missing blueberry pie.",
    character: "Gizmo",
    setting: "Downtown Neo-Bakery",
    tone: "funny" as ComicTone,
    style: "comic book" as ComicArtStyle,
  },
  {
    scenario: "Cyberpunk Heist",
    prompt: "A street-smart cyber thief infiltrating a high-tech corporate server spire to retrieve memories.",
    character: "Nova",
    setting: "Neo-Shinjuku Spire",
    tone: "action" as ComicTone,
    style: "cyberpunk synthwave" as ComicArtStyle,
  },
  {
    scenario: "Cozy Bakery Magic",
    prompt: "A baby dragon apprentice who accidentally sneezes fire into sourdough bread, making winged pastries.",
    character: "Pip",
    setting: "Sunfire Village Oven",
    tone: "whimsical" as ComicTone,
    style: "watercolor fantasy" as ComicArtStyle,
  },
];

export const ComicForm: React.FC<ComicFormProps> = ({
  onGenerate,
  isGenerating,
  activeTone,
  activeArtStyle,
  initialPrompt = "A brave fox exploring an enchanted forest.",
  initialCharacter = "Rusty",
  initialSetting = "Enchanted Lumina Forest",
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [characterName, setCharacterName] = useState(initialCharacter);
  const [setting, setSetting] = useState(initialSetting);
  const [tone, setTone] = useState<ComicTone>(activeTone);
  const [artStyle, setArtStyle] = useState<ComicArtStyle>(activeArtStyle);
  const [panelCount, setPanelCount] = useState<number>(4);
  const [secondaryCharacters, setSecondaryCharacters] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    onGenerate({
      prompt: prompt.trim(),
      characterName: characterName.trim() || "Hero",
      setting: setting.trim() || "Fantasy Realm",
      tone,
      artStyle,
      panelCount,
      secondaryCharacters: secondaryCharacters.trim(),
    });
  };

  const handleApplyPreset = (item: (typeof PROMPT_SUGGESTIONS)[0]) => {
    setPrompt(item.prompt);
    setCharacterName(item.character);
    setSetting(item.setting);
    setTone(item.tone);
    setArtStyle(item.style);
  };

  return (
    <div className="bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Comic Halftone */}
      <div className="absolute inset-0 comic-halftone pointer-events-none opacity-40" />

      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bangers tracking-wider bg-amber-500 text-slate-950 rounded">
                PIPELINE STEP 1
              </span>
              <h2 className="text-xl sm:text-2xl font-bangers tracking-wide text-white">
                STORYBOARD & SCRIPT STUDIO
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-comic mt-0.5">
              Input your storyline premise, character persona, mood, and visual style to generate panel storylines.
            </p>
          </div>

          {/* Quick Presets Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-comic">
              Presets:
            </span>
            {PROMPT_SUGGESTIONS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition-colors"
              >
                {preset.scenario}
              </button>
            ))}
          </div>
        </div>

        {/* Story Prompt Main Input */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider font-bangers mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Story Prompt / Creative Premise *
            </span>
            <span className="text-[11px] font-comic text-slate-400 font-normal">
              Gemini 3.8 Flash will structure the panel script & dialogues
            </span>
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="e.g., A brave fox exploring an enchanted forest, discovering glowing ruins and confronting a gentle ancient golem..."
              className="w-full px-4 py-3 bg-slate-950/80 border-2 border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm sm:text-base font-comic transition-all"
              required
            />
          </div>
        </div>

        {/* Character & Setting Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Main Character Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-bangers mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Main Character Name
            </label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="e.g., Rusty / Gizmo / Maya"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 text-sm font-comic"
            />
          </div>

          {/* Setting / Environment */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-bangers mb-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              Setting / Location
            </label>
            <input
              type="text"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              placeholder="e.g., Enchanted Lumina Forest / Downtown Neo-Bakery"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 text-sm font-comic"
            />
          </div>

          {/* Panel Count */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-bangers mb-1">
              Panel Count & Layout
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { count: 3, label: "3 Panels", sub: "Strip" },
                { count: 4, label: "4 Panels", sub: "Classic" },
                { count: 6, label: "6 Panels", sub: "Full Page" },
              ].map((item) => (
                <button
                  key={item.count}
                  type="button"
                  onClick={() => setPanelCount(item.count)}
                  className={`py-2 px-1 text-center rounded-lg border text-xs font-bold transition-all ${
                    panelCount === item.count
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                      : "bg-slate-950/80 border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <div>{item.label}</div>
                  <div className="text-[10px] font-normal opacity-80">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider font-bangers mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-amber-400" />
              Comic Story Tone / Narrative Mood
            </span>
            <span className="text-[11px] font-comic text-slate-400 font-normal">
              Adapts dialogue humor, pacing, and conflict resolution
            </span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {TONE_OPTIONS.map((item) => {
              const isSelected = tone === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTone(item.id)}
                  className={`p-2.5 rounded-xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? `bg-gradient-to-br ${item.color} border-amber-400 ring-2 ring-amber-400/30 shadow-lg scale-[1.02]`
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{item.icon}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </div>
                  <div className="mt-2">
                    <div
                      className={`text-xs font-bold font-bangers tracking-wide ${
                        isSelected ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-400 font-comic line-clamp-2 mt-0.5 leading-tight">
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Art Style Selector */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider font-bangers mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-amber-400" />
              Illustration Art Style (Stable Diffusion / Gemini Vision)
            </span>
            <span className="text-[11px] font-comic text-slate-400 font-normal">
              Sets linework, ink aesthetic, palette, and halftone rendering
            </span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
            {ART_STYLES.map((style) => {
              const isSelected = artStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setArtStyle(style.id)}
                  className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all ${
                    isSelected
                      ? "border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/10 scale-[1.02]"
                      : "border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="h-16 w-full overflow-hidden bg-slate-950 relative">
                    <img
                      src={style.sampleImg}
                      alt={style.label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[9px] font-bangers tracking-wider bg-slate-900/90 text-amber-300 border border-slate-700 rounded">
                      {style.badge}
                    </span>
                  </div>

                  {/* Label */}
                  <div className="p-2 bg-slate-950">
                    <div
                      className={`text-xs font-bold font-bangers tracking-wide leading-tight ${
                        isSelected ? "text-amber-400" : "text-slate-200"
                      }`}
                    >
                      {style.label}
                    </div>
                    <div className="text-[10px] text-slate-400 font-comic line-clamp-2 mt-0.5 leading-tight">
                      {style.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button Action Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-comic text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AI Pipeline: Gemini Storyboarder &rarr; Diffusers Art &rarr; Layout Engine</span>
          </div>

          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bangers text-lg tracking-wider rounded-xl shadow-xl shadow-amber-500/20 border-2 border-slate-950 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>CRAFTING STORY & ART...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>GENERATE COMIC STRIP</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
