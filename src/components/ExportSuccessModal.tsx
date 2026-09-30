import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  FileDown,
  Printer,
  Share2,
  ArrowLeft,
  Sparkles,
  Layers,
  Clock,
  HardDrive,
  Copy,
  BookOpen,
} from "lucide-react";
import { ExportResult } from "../types/comic";

interface ExportSuccessModalProps {
  exportResult: ExportResult;
  onClose: () => void;
  onNewComic: () => void;
}

export const ExportSuccessModal: React.FC<ExportSuccessModalProps> = ({
  exportResult,
  onClose,
  onNewComic,
}) => {
  useEffect(() => {
    // Launch comic celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#ef4444", "#3b82f6", "#10b981", "#8b5cf6"],
      });
    } catch (e) {
      console.warn("Confetti error:", e);
    }
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleCopyFilename = () => {
    navigator.clipboard?.writeText(exportResult.filename);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-2xl w-full bg-slate-900 border-4 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8">
        {/* Comic Halftone texture */}
        <div className="absolute inset-0 comic-halftone pointer-events-none opacity-30" />

        <div className="relative z-10 space-y-6">
          {/* Header Banner */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="block px-3 py-0.5 text-xs font-bangers tracking-wider bg-amber-500 text-slate-950 rounded-full mx-auto w-max border border-slate-900">
              SCENARIO 3 &bull; EXPORT COMPLETE
            </span>

            <h2 className="text-3xl sm:text-4xl font-bangers tracking-wide text-white">
              COMIC BOOK EXPORTED SUCCESSFULLY!
            </h2>
            <p className="text-sm text-slate-400 font-comic max-w-md mx-auto">
              Your comic has been compiled into a professional, print-ready PDF with high-resolution layout binding and timestamped archiving.
            </p>
          </div>

          {/* Filename & Timestamp Box */}
          <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 sm:p-5 relative">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider font-bangers">
                GENERATED ARTIFACT FILENAME:
              </span>
              <button
                onClick={handleCopyFilename}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-comic"
                title="Copy filename"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>

            <div className="font-mono text-sm sm:text-base text-emerald-300 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 break-all select-all">
              {exportResult.filename}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80">
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center">
                <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 font-comic uppercase">Timestamp</div>
                <div className="text-xs font-mono font-bold text-slate-200 truncate">
                  {exportResult.timestamp}
                </div>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center">
                <HardDrive className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 font-comic uppercase">File Size</div>
                <div className="text-xs font-mono font-bold text-slate-200">
                  {formatFileSize(exportResult.fileSizeBytes)}
                </div>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center">
                <BookOpen className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 font-comic uppercase">Pages Bound</div>
                <div className="text-xs font-mono font-bold text-slate-200">
                  {exportResult.pageCount} Pages
                </div>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-center">
                <Layers className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 font-comic uppercase">Panels Included</div>
                <div className="text-xs font-mono font-bold text-slate-200">
                  {exportResult.panelCount} Panels
                </div>
              </div>
            </div>
          </div>

          {/* Scenario 3 Architecture Verification steps */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-bangers block">
              TECHNICAL EXPORT PIPELINE VERIFICATION:
            </span>

            <div className="space-y-2 text-xs font-comic text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono font-bold">1. layout_builder.py:</span>
                <span className="text-slate-400">
                  Assembled each panel title, high-resolution graphic, dialogue speech bubbles, and narrative captions into structured pages.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono font-bold">2. exporters.py (FPDF):</span>
                <span className="text-slate-400">
                  Compiled structured elements into consecutive PDF pages with standard print margins, comic cover page, and author metadata.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono font-bold">3. Export Success:</span>
                <span className="text-slate-400">
                  Confirmed download trigger with timestamped identifier. Ready for printing, distribution, or portfolio sharing.
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-2 transition-colors font-comic"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Comic Preview</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {exportResult.pdfBlobUrl && (
                <a
                  href={exportResult.pdfBlobUrl}
                  download={exportResult.filename}
                  className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-bangers tracking-wider bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  <span>DOWNLOAD AGAIN</span>
                </a>
              )}

              <button
                onClick={onNewComic}
                className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-bangers tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl border border-slate-900 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>CREATE ANOTHER COMIC</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
