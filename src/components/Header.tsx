import React from "react";
import { Sparkles, BookOpen, Layers, Users, Zap, FileDown, ShieldCheck } from "lucide-react";

interface HeaderProps {
  onSelectScenario: (scenarioId: number) => void;
  onOpenSpecs: () => void;
  onOpenLibrary: () => void;
  onNewComic: () => void;
  onExportPdf: () => void;
  isGenerating: boolean;
  hasComic: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectScenario,
  onOpenSpecs,
  onOpenLibrary,
  onNewComic,
  onExportPdf,
  isGenerating,
  hasComic,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b-2 border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onNewComic}>
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-lg flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform shadow-lg shadow-amber-500/20 border-2 border-slate-900">
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-slate-950 fill-slate-950" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bangers tracking-wider px-1.5 py-0.5 rounded-full border border-slate-900 shadow">
                AI
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bangers text-2xl sm:text-3xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400">
                  COMICCRAFT AI
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[11px] font-semibold bg-red-500/20 text-red-400 border border-red-500/40 rounded-full">
                  FASTAPI & GEMINI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-comic hidden sm:block">
                Personalized AI Comic Book & Graphic Story Studio
              </p>
            </div>
          </div>

          {/* Quick Scenario Buttons */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider font-comic">
              Scenarios:
            </span>
            <button
              onClick={() => onSelectScenario(1)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 transition-colors flex items-center gap-1.5"
              title="Scenario 1: Fox exploring enchanted forest (Dramatic Anime)"
            >
              <span>🦊</span>
              <span>1: Fox Adventure</span>
            </button>
            <button
              onClick={() => onSelectScenario(2)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 transition-colors flex items-center gap-1.5"
              title="Scenario 2: Funny Detective Robot (Light-Hearted Comic)"
            >
              <span>🤖</span>
              <span>2: Funny Detective</span>
            </button>
            <button
              onClick={() => onSelectScenario(3)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-slate-950 transition-colors flex items-center gap-1.5"
              title="Scenario 3: Layout Binding & PDF Export with Success Page"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>3: PDF Exporter</span>
            </button>
          </div>

          {/* Action Hub */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenSpecs}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-all flex items-center gap-1.5 shadow-sm"
              title="View Architecture, Epics, Tasks, and Team Members"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Team & Architecture</span>
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] bg-amber-500/20 text-amber-300 rounded font-mono">
                8 Epics
              </span>
            </button>

            <button
              onClick={onOpenLibrary}
              className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-all flex items-center gap-1.5 shadow-sm"
              title="Open Comic Vault & History"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Vault</span>
            </button>

            {hasComic && (
              <button
                onClick={onExportPdf}
                disabled={isGenerating}
                className="px-3.5 py-1.5 text-xs font-bangers tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 rounded-lg shadow-md shadow-amber-500/20 border-2 border-slate-900 transition-all flex items-center gap-1.5 transform active:scale-95 disabled:opacity-50"
              >
                <FileDown className="w-4 h-4" />
                <span>DOWNLOAD PDF</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
