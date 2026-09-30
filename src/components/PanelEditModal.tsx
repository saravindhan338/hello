import React, { useState } from "react";
import { X, Sparkles, RefreshCw, Plus, Trash2, Volume2 } from "lucide-react";
import { ComicPanel, BubbleType, Dialogue } from "../types/comic";

interface PanelEditModalProps {
  panel: ComicPanel;
  onSave: (updatedPanel: ComicPanel) => void;
  onClose: () => void;
  onRegenerateImage: (panelNumber: number, customPrompt?: string) => void;
}

export const PanelEditModal: React.FC<PanelEditModalProps> = ({
  panel,
  onSave,
  onClose,
  onRegenerateImage,
}) => {
  const [panelTitle, setPanelTitle] = useState(panel.panelTitle);
  const [caption, setCaption] = useState(panel.caption);
  const [imagePrompt, setImagePrompt] = useState(panel.imagePrompt);
  const [soundEffect, setSoundEffect] = useState(panel.soundEffect || "");
  const [soundEffectColor, setSoundEffectColor] = useState(panel.soundEffectColor || "#ef4444");
  const [cameraAngle, setCameraAngle] = useState(panel.cameraAngle);
  const [dialogues, setDialogues] = useState<Dialogue[]>(panel.dialogues || []);

  const handleAddDialogue = () => {
    setDialogues([
      ...dialogues,
      { speaker: "Character", text: "New speech line...", type: "speech" },
    ]);
  };

  const handleUpdateDialogue = (index: number, key: keyof Dialogue, value: any) => {
    const updated = [...dialogues];
    updated[index] = { ...updated[index], [key]: value };
    setDialogues(updated);
  };

  const handleRemoveDialogue = (index: number) => {
    setDialogues(dialogues.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      ...panel,
      panelTitle,
      caption,
      imagePrompt,
      soundEffect,
      soundEffectColor,
      cameraAngle,
      dialogues,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-2xl w-full bg-slate-900 border-4 border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-bangers text-amber-400 tracking-wider">
              PANEL STUDIO EDITOR
            </span>
            <h3 className="text-lg sm:text-xl font-bangers text-white">
              EDIT PANEL #{panel.panelNumber}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="py-4 overflow-y-auto flex-1 space-y-4 text-xs font-comic">
          {/* Panel Title & Camera Angle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase font-bangers">
                Panel Title
              </label>
              <input
                type="text"
                value={panelTitle}
                onChange={(e) => setPanelTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase font-bangers">
                Camera Angle / Framing
              </label>
              <input
                type="text"
                value={cameraAngle}
                onChange={(e) => setCameraAngle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:border-amber-400"
              />
            </div>
          </div>

          {/* Narration Caption */}
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase font-bangers flex items-center justify-between">
              <span>Narration Caption (Yellow Box)</span>
              <span className="text-[10px] text-amber-400">Comic Storyteller voice</span>
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:border-amber-400 font-comic"
            />
          </div>

          {/* Image Prompt & Re-render button */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-bold uppercase font-bangers">
                Art / Illustration Prompt (Stable Diffusion / Gemini)
              </label>
              <button
                type="button"
                onClick={() => onRegenerateImage(panel.panelNumber, imagePrompt)}
                className="text-amber-400 hover:text-amber-300 text-[11px] font-bangers flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>RE-RENDER ART NOW</span>
              </button>
            </div>
            <textarea
              rows={2}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:border-amber-400 font-comic"
            />
          </div>

          {/* Sound Effect (Onomatopoeia) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase font-bangers">
                Comic Sound Effect (e.g. BAM!, WHOOSH!)
              </label>
              <input
                type="text"
                value={soundEffect}
                onChange={(e) => setSoundEffect(e.target.value)}
                placeholder="e.g. CRUNCH! or ZAP!"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:border-amber-400 font-bangers tracking-wider text-base uppercase"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase font-bangers">
                SFX Badge Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={soundEffectColor}
                  onChange={(e) => setSoundEffectColor(e.target.value)}
                  className="w-10 h-9 p-0 bg-transparent rounded cursor-pointer border border-slate-700"
                />
                <span className="font-mono text-slate-400">{soundEffectColor}</span>
              </div>
            </div>
          </div>

          {/* Dialogues & Speech Balloons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-bold uppercase font-bangers">
                Dialogues & Speech Balloons
              </label>
              <button
                type="button"
                onClick={handleAddDialogue}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg border border-slate-700 text-[11px] font-bold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Balloon</span>
              </button>
            </div>

            {dialogues.map((dlg, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={dlg.speaker}
                    onChange={(e) => handleUpdateDialogue(idx, "speaker", e.target.value)}
                    placeholder="Speaker name"
                    className="w-1/3 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 font-bangers"
                  />
                  <select
                    value={dlg.type}
                    onChange={(e) => handleUpdateDialogue(idx, "type", e.target.value as BubbleType)}
                    className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-slate-300 text-xs font-comic"
                  >
                    <option value="speech">Speech (Normal)</option>
                    <option value="thought">Thought (Cloud)</option>
                    <option value="shout">Shout (Jagged)</option>
                    <option value="whisper">Whisper (Dashed)</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveDialogue(idx)}
                    className="p-1 text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={dlg.text}
                  onChange={(e) => handleUpdateDialogue(idx, "text", e.target.value)}
                  placeholder="Dialogue words..."
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-comic"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-comic font-bold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bangers text-sm tracking-wider rounded-xl border border-slate-900 shadow-md shadow-amber-500/20"
          >
            SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
};
