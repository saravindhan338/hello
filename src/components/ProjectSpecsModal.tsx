import React, { useState } from "react";
import {
  X,
  Users,
  Cpu,
  Layers,
  Code2,
  CheckCircle,
  FileCode,
  Shield,
  Server,
  Zap,
} from "lucide-react";

interface ProjectSpecsModalProps {
  onClose: () => void;
}

export const ProjectSpecsModal: React.FC<ProjectSpecsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "team" | "architecture" | "pythonCode">(
    "overview"
  );

  const team = [
    {
      name: "Aravindhan",
      role: "TeamLead",
      badge: "Lead Architect",
      skills: ["FastAPI", "Gemini AI", "Pipeline Orchestration", "Diffusers"],
    },
    {
      name: "Abishek Kumar",
      role: "Member",
      badge: "Full-Stack Dev",
      skills: ["Frontend UI", "Layout Binding", "Tailwind CSS", "API Integration"],
    },
    {
      name: "Rithika M",
      role: "Member",
      badge: "AI & Image Specialist",
      skills: ["Stable Diffusion", "Prompt Engineering", "Art Styles", "Hugging Face"],
    },
    {
      name: "Nilin Jenilia",
      role: "Member",
      badge: "Backend & PDF Exporter",
      skills: ["FPDF", "exporters.py", "Timestamped Archives", "FastAPI Endpoints"],
    },
  ];

  const epics = [
    { id: "EPIC-1", title: "Project Inception & Architecture Planning", status: "Completed", tasks: 2 },
    { id: "EPIC-2", title: "Gemini 3.8 Story & Script Generator Pipeline", status: "Completed", tasks: 2 },
    { id: "EPIC-3", title: "Stable Diffusion / Diffusers Art Synthesis Engine", status: "Completed", tasks: 2 },
    { id: "EPIC-4", title: "Interactive Comic Reader & Speech Balloon Studio", status: "Completed", tasks: 2 },
    { id: "EPIC-5", title: "layout_builder.py Panel & Grid Binding Module", status: "Completed", tasks: 1 },
    { id: "EPIC-6", title: "exporters.py FPDF Timestamped PDF Export", status: "Completed", tasks: 2 },
    { id: "EPIC-7", title: "Export Success Routing & Confetti Confirmation", status: "Completed", tasks: 1 },
    { id: "EPIC-8", title: "Deployment, Cross-Platform Testing & Performance", status: "Completed", tasks: 1 },
  ];

  const pythonLayoutBuilderCode = `# layout_builder.py
# ComicCraft AI - Structured Comic Panel & Layout Binder
from typing import List, Dict, Any
from dataclasses import dataclass
from datetime import datetime

@dataclass
class ComicLayoutConfig:
    layout_type: str = "grid"  # 'grid', 'strip', 'dynamic', 'webtoon'
    panels_per_page: int = 2
    include_cover: bool = True
    margin_mm: float = 14.0

class LayoutBuilder:
    """Assembles panel titles, images, speech bubbles, and captions into printable pages."""
    def __init__(self, config: ComicLayoutConfig = None):
        self.config = config or ComicLayoutConfig()

    def bind_panels(self, story_data: Dict[str, Any]) -> Dict[str, Any]:
        title = story_data.get("title", "ComicCraft Adventure")
        panels = story_data.get("panels", [])
        
        pages = []
        for i in range(0, len(panels), self.config.panels_per_page):
            page_chunk = panels[i:i + self.config.panels_per_page]
            pages.append({
                "page_number": len(pages) + 1,
                "panels": page_chunk
            })
            
        return {
            "title": title,
            "tone": story_data.get("tone", "dramatic"),
            "art_style": story_data.get("art_style", "comic book"),
            "total_pages": len(pages),
            "total_panels": len(panels),
            "pages": pages,
            "timestamp": datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        }`;

  const pythonExportersCode = `# exporters.py
# ComicCraft AI - FPDF Compilation & Timestamped Exporter
from fpdf import FPDF
from datetime import datetime
import os
from typing import Dict, Any

class ComicPDFExporter:
    """Compiles bound comic layouts into printable PDF format with cover & metadata."""
    def __init__(self, output_dir: str = "./exports"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_pdf(self, layout_data: Dict[str, Any]) -> str:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_title = "".join(c for c in layout_data["title"] if c.isalnum() or c == "_")[:24]
        filename = f"ComicCraft_{safe_title}_{timestamp}.pdf"
        filepath = os.path.join(self.output_dir, filename)

        pdf = FPDF(orientation="P", unit="mm", format="A4")
        pdf.set_auto_page_break(auto=True, margin=15)
        
        # 1. Build Cover Page
        pdf.add_page()
        pdf.set_fill_color(15, 23, 42)
        pdf.rect(0, 0, 210, 297, "F")
        pdf.set_font("Helvetica", "B", 20)
        pdf.set_text_color(254, 240, 138)
        pdf.cell(0, 30, layout_data["title"], ln=True, align="C")

        # 2. Add Story Pages with Panels, Captions & Speech Balloons
        for page in layout_data["pages"]:
            pdf.add_page()
            for panel in page["panels"]:
                pdf.set_font("Helvetica", "B", 12)
                pdf.cell(0, 10, f"PANEL {panel['panel_number']}: {panel['panel_title']}", ln=True)
                # Image, Caption & Dialogues binding...

        pdf.output(filepath)
        return filepath`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-4xl w-full bg-slate-900 border-4 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bangers tracking-wide text-white">
                COMICCRAFT AI &bull; SPECS & ARCHITECTURE
              </h2>
              <p className="text-xs text-slate-400 font-comic">
                Project Stats, Team Members, Technical Architecture & Source Modules
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

        {/* Tabs */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-slate-800/80 overflow-x-auto">
          {[
            { id: "overview", label: "Project Stats & Epics", icon: Layers },
            { id: "team", label: "Team Members", icon: Users },
            { id: "architecture", label: "Technical Architecture", icon: Cpu },
            { id: "pythonCode", label: "Python Pipeline Code", icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                  active
                    ? "bg-amber-500 text-slate-950 font-bangers tracking-wider"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="py-4 overflow-y-auto flex-1 space-y-6">
          {/* Overview & Epics */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Project Stats Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                  <div className="text-2xl font-bangers text-amber-400 tracking-wider">8</div>
                  <div className="text-xs text-slate-400 font-comic uppercase">Total Epics</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                  <div className="text-2xl font-bangers text-emerald-400 tracking-wider">13</div>
                  <div className="text-xs text-slate-400 font-comic uppercase">Total Tasks</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                  <div className="text-2xl font-bangers text-blue-400 tracking-wider">0</div>
                  <div className="text-xs text-slate-400 font-comic uppercase">Subtasks</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                  <div className="text-2xl font-bangers text-purple-400 tracking-wider">100%</div>
                  <div className="text-xs text-slate-400 font-comic uppercase">Completion</div>
                </div>
              </div>

              {/* Epics List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-bangers">
                  PROJECT EPICS BREAKDOWN (8 EPICS):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {epics.map((epic) => (
                    <div
                      key={epic.id}
                      className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-slate-200">{epic.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {epic.id} &bull; {epic.tasks} Tasks
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                        {epic.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Team Members */}
          {activeTab === "team" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-bangers">
                  CORE TEAM MEMBERS:
                </span>
                <span className="text-xs text-slate-400 font-comic">
                  Mentor: <span className="italic text-slate-500">No mentor assigned yet</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {team.map((member, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-bangers text-lg flex items-center justify-center border-2 border-slate-900 shadow">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bangers tracking-wide text-base text-white">
                            {member.name}
                          </div>
                          <div className="text-xs font-semibold text-amber-400 font-comic">
                            {member.role}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono">
                        {member.badge}
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 font-comic uppercase mb-1">
                        Core Competencies:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Architecture */}
          {activeTab === "architecture" && (
            <div className="space-y-4 text-xs font-comic">
              {/* Hardware Requirements */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <span className="font-bangers tracking-wider text-amber-400 text-sm block">
                  HARDWARE SYSTEM REQUIREMENTS:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block">Processor:</span>
                    <span>Intel Core i5 (8th Gen or above) / AMD Ryzen 5 or equivalent</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block">RAM:</span>
                    <span>Minimum 8 GB (Recommended: 16 GB for multitasking & AWS Labs)</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block">Storage:</span>
                    <span>256 GB SSD (or 500 GB HDD minimum)</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block">Internet Connectivity:</span>
                    <span>Stable high-speed (Min 10 Mbps, Recommended 20 Mbps)</span>
                  </div>
                </div>
              </div>

              {/* Software Requirements */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <span className="font-bangers tracking-wider text-emerald-400 text-sm block">
                  SOFTWARE & STACK REQUIREMENTS:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300">
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block">Operating System:</span>
                    <span>Windows 10/11, macOS Monterey+, or Linux Ubuntu 20.04+</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block">Web Browser:</span>
                    <span>Google Chrome, Mozilla Firefox, or Microsoft Edge</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block">Additional Tools:</span>
                    <span>Python 3.8+, AWS CLI (latest), Git, VS Code</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Python Code Viewer */}
          {activeTab === "pythonCode" && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-bangers block mb-1">
                  1. layout_builder.py (Scenario 3 Layout Binding Engine):
                </span>
                <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 overflow-x-auto max-h-52">
                  {pythonLayoutBuilderCode}
                </pre>
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-bangers block mb-1">
                  2. exporters.py (FPDF Timestamped PDF Generation):
                </span>
                <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 overflow-x-auto max-h-52">
                  {pythonExportersCode}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bangers text-sm tracking-wider rounded-xl border border-slate-900 transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
