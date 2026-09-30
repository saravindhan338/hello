import React from "react";
import { X, BookOpen, Trash2, Calendar, FileText, ArrowRight } from "lucide-react";
import { ComicStory } from "../types/comic";

interface LibraryModalProps {
  comics: ComicStory[];
  onSelectComic: (comic: ComicStory) => void;
  onDeleteComic: (id: string) => void;
  onClose: () => void;
  currentComicId?: string;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  comics,
  onSelectComic,
  onDeleteComic,
  onClose,
  currentComicId,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-3xl w-full bg-slate-900 border-4 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bangers tracking-wide text-white">
                COMIC VAULT & ARCHIVE
              </h2>
              <p className="text-xs text-slate-400 font-comic">
                Access previously created stories, preset scenarios, and saved issues
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comic List */}
        <div className="py-4 overflow-y-auto flex-1 space-y-3">
          {comics.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-comic">
              No comics found in your vault. Create one using the Studio!
            </div>
          ) : (
            comics.map((comic) => {
              const isCurrent = comic.id === currentComicId;
              const firstImg = comic.panels[0]?.imageUrl;

              return (
                <div
                  key={comic.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isCurrent
                      ? "bg-amber-500/10 border-amber-500/50 shadow-md"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                      {firstImg ? (
                        <img
                          src={firstImg}
                          alt={comic.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bangers text-xs text-amber-400">
                          COMIC
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-comic uppercase">
                          {comic.tone}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-comic uppercase">
                          {comic.artStyle}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {comic.panels.length} panels
                        </span>
                      </div>

                      <h4 className="text-base font-bangers text-white truncate mt-1">
                        {comic.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-comic line-clamp-1">
                        {comic.synopsis}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => {
                        onSelectComic(comic);
                        onClose();
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bangers tracking-wider flex items-center gap-1.5 transition-all ${
                        isCurrent
                          ? "bg-slate-800 text-amber-400 border border-amber-500/40"
                          : "bg-amber-500 hover:bg-amber-400 text-slate-950 border border-slate-900"
                      }`}
                    >
                      <span>{isCurrent ? "ACTIVE ISSUE" : "OPEN COMIC"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteComic(comic.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
                      title="Delete from vault"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-comic font-bold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
