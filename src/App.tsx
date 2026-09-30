import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ComicForm } from "./components/ComicForm";
import { ComicViewer } from "./components/ComicViewer";
import { ExportSuccessModal } from "./components/ExportSuccessModal";
import { ProjectSpecsModal } from "./components/ProjectSpecsModal";
import { LibraryModal } from "./components/LibraryModal";
import { PanelEditModal } from "./components/PanelEditModal";
import { ComicStory, ComicPanel, ExportResult, ComicTone, ComicArtStyle } from "./types/comic";
import { SAMPLE_COMICS } from "./utils/sampleData";
import { generateComicPdf } from "./utils/pdfExporter";
import { Sparkles, Wand2, RefreshCw, Zap, BookOpen, Layers, CheckCircle2, AlertCircle } from "lucide-react";

export default function App() {
  const [comics, setComics] = useState<ComicStory[]>(() => {
    const saved = localStorage.getItem("comiccraft_vault");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return SAMPLE_COMICS;
      }
    }
    return SAMPLE_COMICS;
  });

  const [currentComic, setCurrentComic] = useState<ComicStory>(SAMPLE_COMICS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [editingPanel, setEditingPanel] = useState<ComicPanel | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  // Sync vault to localStorage
  useEffect(() => {
    localStorage.setItem("comiccraft_vault", JSON.stringify(comics));
  }, [comics]);

  const showToast = (message: string, type: "success" | "info" | "error" = "info") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Scenario 1: Fox exploring enchanted forest (Dramatic Anime)
  const handleSelectScenario1 = () => {
    const scenario1 = SAMPLE_COMICS[0];
    setCurrentComic(scenario1);
    showToast("Loaded Scenario 1: 'A brave fox exploring an enchanted forest' (Dramatic Anime)", "success");
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  // Scenario 2: Clumsy robot detective (Funny Comic Book)
  const handleSelectScenario2 = () => {
    const scenario2 = SAMPLE_COMICS[1];
    setCurrentComic(scenario2);
    showToast("Loaded Scenario 2: Light-hearted funny comic book iteration with Gizmo!", "success");
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  // Scenario 3: Instant layout binding + PDF compilation + redirect to Export Success page
  const handleSelectScenario3 = async () => {
    showToast("Triggering Scenario 3: Layout binding & FPDF compilation pipeline...", "info");
    await handleExportPdf();
  };

  const handleSelectScenario = (id: number) => {
    if (id === 1) handleSelectScenario1();
    else if (id === 2) handleSelectScenario2();
    else if (id === 3) handleSelectScenario3();
  };

  // Story & Comic Generation Pipeline
  const handleGenerateComic = async (data: {
    prompt: string;
    characterName: string;
    setting: string;
    tone: ComicTone;
    artStyle: ComicArtStyle;
    panelCount: number;
    secondaryCharacters?: string;
  }) => {
    setIsGenerating(true);
    setGenerationStep("Analyzing prompt & writing story script with Gemini 3.8 Flash...");

    try {
      // 1. Call Gemini story script generation
      const storyRes = await fetch("/api/comic/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!storyRes.ok) {
        throw new Error("Failed to generate storyline from server");
      }

      const storyData = await storyRes.json();
      setGenerationStep("Drafting panel scripts & onomatopoeia...");

      // 2. Prepare empty/loading panels
      const newComicId = `comic-${Date.now()}`;
      const initialPanels: ComicPanel[] = storyData.panels.map((p: any) => ({
        ...p,
        imageUrl: undefined,
        isImageLoading: true,
        soundEffectColor: ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6"][
          (p.panelNumber - 1) % 5
        ],
      }));

      const newComic: ComicStory = {
        id: newComicId,
        title: storyData.title || "Untitled Comic",
        synopsis: storyData.synopsis || "An epic comic adventure.",
        prompt: data.prompt,
        characterName: data.characterName,
        setting: data.setting,
        tone: data.tone,
        artStyle: data.artStyle,
        panelCount: data.panelCount,
        createdAt: new Date().toISOString(),
        mainCharacter: storyData.mainCharacter || {
          name: data.characterName,
          visualDescription: "Distinctive comic hero",
        },
        panels: initialPanels,
      };

      setCurrentComic(newComic);
      setGenerationStep("Synthesizing panel illustrations via Stable Diffusion / Diffusers...");

      // 3. Generate artwork for all panels asynchronously
      const updatedPanels = [...initialPanels];
      for (let i = 0; i < updatedPanels.length; i++) {
        setGenerationStep(`Rendering artwork for Panel ${i + 1} of ${updatedPanels.length}...`);
        try {
          const imgRes = await fetch("/api/comic/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imagePrompt: updatedPanels[i].imagePrompt,
              artStyle: data.artStyle,
              characterName: data.characterName,
              panelNumber: updatedPanels[i].panelNumber,
            }),
          });
          const imgData = await imgRes.json();
          updatedPanels[i].imageUrl = imgData.imageUrl;
          updatedPanels[i].isImageLoading = false;

          // Progressive UI update
          setCurrentComic((prev) => ({
            ...prev,
            panels: [...updatedPanels],
          }));
        } catch (err) {
          console.warn(`Failed image generation for panel ${i + 1}:`, err);
          updatedPanels[i].isImageLoading = false;
        }
      }

      // Add to vault
      const finalComic: ComicStory = {
        ...newComic,
        panels: updatedPanels,
      };

      setCurrentComic(finalComic);
      setComics((prev) => [finalComic, ...prev.filter((c) => c.id !== finalComic.id)]);
      showToast("Comic strip generated successfully!", "success");

      // Smooth scroll down to viewer
      window.scrollTo({ top: 380, behavior: "smooth" });
    } catch (error: any) {
      console.error("Comic generation failed:", error);
      showToast("Generation error, please try again or adjust your prompt.", "error");
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  // Re-render single panel artwork
  const handleRegeneratePanelImage = async (panelNumber: number, customPrompt?: string) => {
    if (!currentComic) return;

    showToast(`Re-rendering artwork for Panel #${panelNumber}...`, "info");
    const targetIdx = currentComic.panels.findIndex((p) => p.panelNumber === panelNumber);
    if (targetIdx === -1) return;

    const panel = currentComic.panels[targetIdx];
    const promptToUse = customPrompt || panel.imagePrompt;

    try {
      const res = await fetch("/api/comic/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagePrompt: promptToUse,
          artStyle: currentComic.artStyle,
          characterName: currentComic.characterName,
          panelNumber,
          seed: Math.floor(Math.random() * 1000000),
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        const updatedPanels = [...currentComic.panels];
        updatedPanels[targetIdx] = {
          ...updatedPanels[targetIdx],
          imageUrl: data.imageUrl,
          imagePrompt: promptToUse,
        };

        const updatedComic = {
          ...currentComic,
          panels: updatedPanels,
        };

        setCurrentComic(updatedComic);
        setComics((prev) => prev.map((c) => (c.id === updatedComic.id ? updatedComic : c)));
        showToast(`Panel #${panelNumber} illustration updated!`, "success");
      }
    } catch (err) {
      console.error("Panel re-render error:", err);
      showToast("Failed to re-render panel image.", "error");
    }
  };

  // Save changes from Panel Studio Editor
  const handleSavePanel = (updatedPanel: ComicPanel) => {
    if (!currentComic) return;
    const updatedPanels = currentComic.panels.map((p) =>
      p.panelNumber === updatedPanel.panelNumber ? updatedPanel : p
    );
    const updatedComic = {
      ...currentComic,
      panels: updatedPanels,
    };
    setCurrentComic(updatedComic);
    setComics((prev) => prev.map((c) => (c.id === updatedComic.id ? updatedComic : c)));
    showToast(`Panel #${updatedPanel.panelNumber} saved!`, "success");
  };

  // Scenario 3: PDF Compilation & Export
  const handleExportPdf = async () => {
    if (!currentComic) return;
    setIsExporting(true);

    try {
      // 1. Layout Binding call to server
      await fetch("/api/comic/layout-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: currentComic.title,
          panels: currentComic.panels,
          layoutType: "grid",
        }),
      });

      // 2. Generate PDF using FPDF-compatible structured layout with jsPDF
      const result = await generateComicPdf(currentComic, "grid");

      // 3. Redirect to Export Success Page (Scenario 3 Requirement)
      setExportResult(result);
      showToast("PDF exported and download initiated!", "success");
    } catch (err) {
      console.error("PDF Export error:", err);
      showToast("Error generating PDF file. Please try again.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteComic = (id: string) => {
    setComics((prev) => prev.filter((c) => c.id !== id));
    if (currentComic.id === id) {
      const remaining = comics.filter((c) => c.id !== id);
      if (remaining.length > 0) setCurrentComic(remaining[0]);
    }
    showToast("Comic removed from vault.", "info");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-comic">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl border-2 shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-comic ${
              notification.type === "success"
                ? "bg-slate-900 border-emerald-500 text-emerald-300"
                : notification.type === "error"
                ? "bg-slate-900 border-red-500 text-red-300"
                : "bg-slate-900 border-amber-500 text-amber-300"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : notification.type === "error" ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            ) : (
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* App Header */}
      <Header
        onSelectScenario={handleSelectScenario}
        onOpenSpecs={() => setShowSpecsModal(true)}
        onOpenLibrary={() => setShowLibraryModal(true)}
        onNewComic={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onExportPdf={handleExportPdf}
        isGenerating={isGenerating}
        hasComic={Boolean(currentComic)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
        
        {/* Pipeline Generation Progress Banner */}
        {isGenerating && (
          <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border-2 border-amber-500/50 rounded-2xl p-4 sm:p-5 shadow-2xl animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bangers text-lg">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <span className="text-xs font-bangers text-amber-400 tracking-wider">
                  ACTIVE AI PIPELINE EXECUTION
                </span>
                <div className="text-base sm:text-lg font-bangers text-white">
                  {generationStep || "Processing comic generation request..."}
                </div>
                <div className="text-xs text-slate-400 font-comic">
                  Gemini 3.8 Flash &bull; Stable Diffusion Diffusers &bull; layout_builder.py
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comic Creation Studio Form */}
        <section id="studio-form">
          <ComicForm
            onGenerate={handleGenerateComic}
            isGenerating={isGenerating}
            activeTone={currentComic?.tone || "dramatic"}
            activeArtStyle={currentComic?.artStyle || "anime"}
            initialPrompt={currentComic?.prompt}
            initialCharacter={currentComic?.characterName}
            initialSetting={currentComic?.setting}
          />
        </section>

        {/* Comic Viewer / Reader / Studio Workspace */}
        {currentComic && (
          <section id="comic-viewer" className="pt-4">
            <ComicViewer
              comic={currentComic}
              onExportPdf={handleExportPdf}
              onEditPanel={(panel) => setEditingPanel(panel)}
              onRegeneratePanelImage={handleRegeneratePanelImage}
              isExporting={isExporting}
              onRegenerateStory={() =>
                handleGenerateComic({
                  prompt: currentComic.prompt,
                  characterName: currentComic.characterName,
                  setting: currentComic.setting,
                  tone: currentComic.tone,
                  artStyle: currentComic.artStyle,
                  panelCount: currentComic.panelCount,
                })
              }
            />
          </section>
        )}
      </main>

      {/* Scenario 3 Export Success Page / Modal */}
      {exportResult && (
        <ExportSuccessModal
          exportResult={exportResult}
          onClose={() => setExportResult(null)}
          onNewComic={() => {
            setExportResult(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {/* Project Specs & Architecture Modal */}
      {showSpecsModal && (
        <ProjectSpecsModal onClose={() => setShowSpecsModal(false)} />
      )}

      {/* Comic Vault / Library Modal */}
      {showLibraryModal && (
        <LibraryModal
          comics={comics}
          onSelectComic={(comic) => {
            setCurrentComic(comic);
            showToast(`Loaded issue: ${comic.title}`, "success");
          }}
          onDeleteComic={handleDeleteComic}
          onClose={() => setShowLibraryModal(false)}
          currentComicId={currentComic?.id}
        />
      )}

      {/* Panel Edit Studio Modal */}
      {editingPanel && (
        <PanelEditModal
          panel={editingPanel}
          onSave={handleSavePanel}
          onClose={() => setEditingPanel(null)}
          onRegenerateImage={(num, prompt) => {
            handleRegeneratePanelImage(num, prompt);
            setEditingPanel(null);
          }}
        />
      )}

      {/* App Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 mt-16 text-center text-xs text-slate-500 font-comic">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bangers text-base text-amber-400">COMICCRAFT AI</span>
            <span>&bull;</span>
            <span>Personalized AI Comic Book & Graphic Story Studio</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>FastAPI & Gemini Engine</span>
            <span>&bull;</span>
            <button
              onClick={() => setShowSpecsModal(true)}
              className="text-amber-400 hover:underline font-bold"
            >
              8 Epics / Team Specs
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
