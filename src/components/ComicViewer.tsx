import React, { useState } from "react";
import {
  FileDown,
  Volume2,
  VolumeX,
  Edit3,
  RefreshCw,
  Maximize2,
  Columns,
  Grid,
  Scroll,
  Layers,
  Sparkles,
  Share2,
  MessageSquare,
  Zap,
} from "lucide-react";
import { ComicPanel, ComicStory } from "../types/comic";

interface ComicViewerProps {
  comic: ComicStory;
  onExportPdf: () => void;
  onEditPanel: (panel: ComicPanel) => void;
  onRegeneratePanelImage: (panelNumber: number) => void;
  isExporting: boolean;
  onRegenerateStory: () => void;
}

export type LayoutMode = "grid" | "strip" | "dynamic" | "webtoon";

export const ComicViewer: React.FC<ComicViewerProps> = ({
  comic,
  onExportPdf,
  onEditPanel,
  onRegeneratePanelImage,
  isExporting,
  onRegenerateStory,
}) => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("grid");
  const [playingAudioPanel, setPlayingAudioPanel] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Play narration and dialogue via browser SpeechSynthesis
  const handlePlaySpeech = (panel: ComicPanel) => {
    if ("speechSynthesis" in window) {
      if (playingAudioPanel === panel.panelNumber) {
        window.speechSynthesis.cancel();
        setPlayingAudioPanel(null);
        return;
      }

      window.speechSynthesis.cancel();
      setPlayingAudioPanel(panel.panelNumber);

      const dialoguesText = panel.dialogues
        .map((d) => `${d.speaker} says: ${d.text}`)
        .join(". ");
      const fullText = `Panel ${panel.panelNumber}. ${panel.caption}. ${dialoguesText}`;

      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setPlayingAudioPanel(null);
      };
      utterance.onerror = () => {
        setPlayingAudioPanel(null);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Comic Header Banner */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        {/* Comic dots pattern */}
        <div className="absolute inset-0 comic-halftone pointer-events-none opacity-30" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          {/* Title & Metadata */}
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-bangers tracking-wider bg-red-600 text-white rounded-md border border-slate-900">
                COMICCRAFT ISSUE #1
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-md uppercase font-comic">
                Tone: {comic.tone}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-md uppercase font-comic">
                Art Style: {comic.artStyle}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-md font-comic">
                {comic.panels.length} Panels
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bangers tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">
              {comic.title}
            </h1>

            {/* Synopsis Box */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 font-comic text-xs sm:text-sm text-slate-300 relative">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-bangers mb-0.5">
                SYNOPSIS & CHARACTER DOSSIER:
              </span>
              <p className="leading-relaxed">{comic.synopsis}</p>
              <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">Hero:</span>
                <span>{comic.mainCharacter.name} &bull; {comic.mainCharacter.visualDescription}</span>
              </div>
            </div>
          </div>

          {/* Action Tools & Layout Controls */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 w-full lg:w-auto">
            {/* Scenario 3 Primary PDF Export Button */}
            <button
              onClick={onExportPdf}
              disabled={isExporting}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bangers text-base tracking-wider rounded-xl shadow-xl shadow-amber-500/20 border-2 border-slate-950 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>COMPILING PDF (FPDF)...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-5 h-5" />
                  <span>EXPORT COMIC (PDF)</span>
                </>
              )}
            </button>

            {/* Layout Mode Switcher */}
            <div className="flex items-center justify-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
              {[
                { id: "grid", label: "2x2 Grid", icon: Grid },
                { id: "strip", label: "Strip", icon: Columns },
                { id: "dynamic", label: "Magazine", icon: Layers },
                { id: "webtoon", label: "Webtoon", icon: Scroll },
              ].map((mode) => {
                const Icon = mode.icon;
                const active = layoutMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setLayoutMode(mode.id as LayoutMode)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      active
                        ? "bg-amber-500 text-slate-950 font-bangers tracking-wider"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                    title={`Switch to ${mode.label} layout`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Panels Display Area */}
      <div
        className={`transition-all duration-300 ${
          layoutMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
            : layoutMode === "strip"
            ? "flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4"
            : layoutMode === "webtoon"
            ? "max-w-2xl mx-auto space-y-8"
            : "grid grid-cols-1 lg:grid-cols-3 gap-6"
        }`}
      >
        {comic.panels.map((panel, idx) => {
          const isLargePanel = layoutMode === "dynamic" && (idx === 0 || idx === 3);

          return (
            <div
              key={panel.panelNumber}
              className={`bg-white text-slate-950 rounded-2xl border-4 border-slate-900 overflow-hidden shadow-2xl relative flex flex-col justify-between transition-all hover:shadow-amber-500/10 ${
                isLargePanel ? "lg:col-span-2" : ""
              } ${layoutMode === "strip" ? "min-w-[340px] sm:min-w-[420px]" : ""}`}
            >
              {/* Panel Top Bar (Comic Tag) */}
              <div className="bg-slate-900 text-white px-3.5 py-2 flex items-center justify-between border-b-2 border-slate-900">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500 text-slate-950 font-bangers text-xs px-2 py-0.5 rounded tracking-wider">
                    PANEL #{panel.panelNumber}
                  </span>
                  <span className="font-bangers tracking-wide text-xs sm:text-sm text-slate-200 truncate max-w-[180px] sm:max-w-xs">
                    {panel.panelTitle}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono hidden sm:inline">
                    {panel.cameraAngle}
                  </span>
                  <button
                    onClick={() => handlePlaySpeech(panel)}
                    className={`p-1 rounded text-xs transition-colors ${
                      playingAudioPanel === panel.panelNumber
                        ? "bg-amber-500 text-slate-950 animate-pulse"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                    title="Listen to narration and dialogue"
                  >
                    {playingAudioPanel === panel.panelNumber ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => onEditPanel(panel)}
                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    title="Edit panel text, dialogue, and prompts"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Panel Image Container */}
              <div className="relative aspect-square sm:aspect-4/3 w-full bg-slate-950 overflow-hidden group">
                {panel.imageUrl ? (
                  <img
                    src={panel.imageUrl}
                    alt={panel.panelTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900">
                    <Sparkles className="w-10 h-10 text-amber-400 animate-pulse mb-2" />
                    <p className="text-xs text-slate-400 font-comic">Generating artwork...</p>
                  </div>
                )}

                {/* Comic Halftone Overlay on Image */}
                <div className="absolute inset-0 comic-halftone-dark pointer-events-none opacity-20" />

                {/* Sound Effect Graphic Overlay */}
                {panel.soundEffect && (
                  <div className="absolute top-3 right-3 transform rotate-6 animate-pulse select-none pointer-events-none z-10">
                    <div
                      className="font-bangers text-2xl sm:text-3xl tracking-wider text-white px-3 py-1 rounded-lg border-2 border-slate-950 shadow-2xl uppercase"
                      style={{
                        backgroundColor: panel.soundEffectColor || "#ef4444",
                        textShadow: "2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000",
                      }}
                    >
                      {panel.soundEffect}
                    </div>
                  </div>
                )}

                {/* Overlay hover controls */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                  <button
                    onClick={() => panel.imageUrl && setLightboxImage(panel.imageUrl)}
                    className="p-2.5 bg-slate-900/90 text-white rounded-xl hover:bg-amber-500 hover:text-slate-950 border border-slate-700 transition-all shadow-lg"
                    title="Expand illustration"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRegeneratePanelImage(panel.panelNumber)}
                    className="px-3 py-2 bg-amber-500 text-slate-950 font-bangers text-xs tracking-wider rounded-xl hover:bg-amber-400 border border-slate-900 transition-all shadow-lg flex items-center gap-1.5"
                    title="Regenerate this panel's image"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>RE-RENDER ART</span>
                  </button>
                </div>
              </div>

              {/* Comic Narrative Caption (Yellow Top/Bottom Box) */}
              <div className="bg-yellow-200 border-t-2 border-b-2 border-slate-900 p-3 font-comic text-xs sm:text-sm text-slate-950 font-semibold shadow-inner">
                <span className="font-bangers uppercase tracking-wider text-[11px] text-amber-900 block mb-0.5">
                  NARRATION:
                </span>
                <p className="italic leading-snug">"{panel.caption}"</p>
              </div>

              {/* Speech & Thought Bubbles Container */}
              <div className="p-3.5 sm:p-4 bg-slate-50 space-y-3 flex-1">
                {panel.dialogues && panel.dialogues.length > 0 ? (
                  panel.dialogues.map((dlg, dIdx) => (
                    <div
                      key={dIdx}
                      className={`relative p-3 rounded-2xl border-2 text-xs sm:text-sm font-comic transition-all ${
                        dlg.type === "thought"
                          ? "bg-slate-100 border-slate-400 border-dashed rounded-3xl"
                          : dlg.type === "shout"
                          ? "bg-amber-100 border-amber-500 font-bold shadow-md"
                          : dlg.type === "whisper"
                          ? "bg-slate-50 border-slate-300 italic text-slate-600"
                          : "bg-white border-slate-900 shadow-[3px_3px_0px_#0f172a]"
                      }`}
                    >
                      {/* Speaker Badge */}
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bangers tracking-wider text-xs uppercase text-amber-700">
                          {dlg.speaker}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 font-comic">
                          {dlg.type}
                        </span>
                      </div>
                      <p className="text-slate-900 leading-snug">"{dlg.text}"</p>

                      {/* Speech bubble pointer / tail */}
                      {dlg.type === "speech" && (
                        <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white border-r-2 border-b-2 border-slate-900 transform rotate-45" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-2 text-xs text-slate-400 font-comic italic">
                    Silent panel with dramatic visual impact.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 border-4 border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={lightboxImage}
              alt="Comic Panel Zoom"
              className="w-full h-full object-contain max-h-[85vh]"
            />
            <div className="p-3 bg-slate-950 text-center font-comic text-xs text-slate-400">
              Click anywhere to close full screen preview
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
