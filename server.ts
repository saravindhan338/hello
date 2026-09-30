import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Comic Story Generation Endpoint using Gemini 3.8 Flash
app.post("/api/comic/generate-story", async (req, res) => {
  try {
    const {
      prompt,
      characterName = "Hero",
      setting = "Enchanted Realm",
      tone = "dramatic",
      artStyle = "comic book",
      panelCount = 4,
      secondaryCharacters = "",
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Story prompt is required" });
    }

    if (!ai) {
      // Fallback generator if API key is not present in local test
      const fallbackStory = generateMockComicStory({
        prompt,
        characterName,
        setting,
        tone,
        artStyle,
        panelCount: Number(panelCount) || 4,
        secondaryCharacters,
      });
      return res.json(fallbackStory);
    }

    const systemInstruction = `You are a master comic book writer and visual storyboard director for ComicCraft AI.
Your job is to transform a user's story prompt into an engaging, cohesive panel-by-panel comic strip script.

Follow these strict creative guidelines:
1. Tone adaptation: If tone is 'funny', incorporate humor, playful dialogue, and slapstick or witty visual gags. If 'dramatic', create cinematic tension and suspense. If 'action', dynamic movement and explosive pacing.
2. Art style awareness: Specify visual details in 'imagePrompt' that match '${artStyle}', including lighting, composition, camera angles, color palette, and character expressions.
3. Dialogue & Captions: Provide authentic comic book narration (caption) and punchy character dialogues.
4. Sound Effects: Include comic onomatopoeia (e.g., 'BAM!', 'SWOOSH!', 'CRUNCH!', 'GASP!').
5. Output format: Must strictly match the requested JSON schema.`;

    const promptText = `Create a ${panelCount}-panel comic book episode based on:
- Story Prompt: "${prompt}"
- Main Character: "${characterName}"
- Setting / Environment: "${setting}"
- Tone / Mood: "${tone}"
- Art Style: "${artStyle}"
${secondaryCharacters ? `- Supporting Characters: "${secondaryCharacters}"` : ""}

Generate a cohesive, complete story arc across all ${panelCount} panels with high visual consistency.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Catchy, evocative comic title",
            },
            synopsis: {
              type: Type.STRING,
              description: "A 1-2 sentence dramatic summary of the episode",
            },
            tone: { type: Type.STRING },
            artStyle: { type: Type.STRING },
            mainCharacter: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                visualDescription: {
                  type: Type.STRING,
                  description: "Consistent visual appearance across all panels",
                },
              },
              required: ["name", "visualDescription"],
            },
            panels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  panelNumber: { type: Type.INTEGER },
                  panelTitle: { type: Type.STRING },
                  cameraAngle: {
                    type: Type.STRING,
                    description: "e.g., Close-up, Wide landscape, Low heroic angle, Bird's eye",
                  },
                  imagePrompt: {
                    type: Type.STRING,
                    description:
                      "Detailed prompt for comic illustrator/Stable Diffusion. Include art style, character look, environment, lighting, and composition.",
                  },
                  caption: {
                    type: Type.STRING,
                    description: "Narration box text (1-2 sentences)",
                  },
                  dialogues: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        speaker: { type: Type.STRING },
                        text: { type: Type.STRING },
                        type: {
                          type: Type.STRING,
                          description: "'speech', 'thought', 'shout', or 'whisper'",
                        },
                      },
                      required: ["speaker", "text", "type"],
                    },
                  },
                  soundEffect: {
                    type: Type.STRING,
                    description: "Optional comic sound effect word like 'WHOOSH!' or 'ZAP!'",
                  },
                },
                required: [
                  "panelNumber",
                  "panelTitle",
                  "cameraAngle",
                  "imagePrompt",
                  "caption",
                  "dialogues",
                ],
              },
            },
          },
          required: ["title", "synopsis", "tone", "artStyle", "mainCharacter", "panels"],
        },
      },
    });

    const responseText = response.text || "";
    const parsedData = JSON.parse(responseText);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini story generation error:", error);
    // Return structured fallback if Gemini quota is exceeded or transient failure occurs
    const fallbackStory = generateMockComicStory(req.body);
    return res.json(fallbackStory);
  }
});

// Image Generation & Optimization Endpoint
app.post("/api/comic/generate-image", async (req, res) => {
  try {
    const { imagePrompt, artStyle = "comic book", panelNumber = 1, seed } = req.body;
    
    // Style keywords enhancements for Stable Diffusion / Image models
    const styleModifiers: Record<string, string> = {
      "comic book": "classic western comic book art, vibrant ink lines, bold cel shading, halftone dots, Jack Kirby aesthetic, dramatic shadows, sharp outlines, masterpiece, graphic novel illustration",
      "anime": "anime manga style, high quality anime screencap, Studio Ghibli and Makoto Shinkai aesthetic, detailed linework, expressive eyes, vibrant cinematic lighting, 4k digital art",
      "noir graphic novel": "gritty comic noir style, high contrast chiaroscuro, black and white with deep shadows, Frank Miller Sin City style, muted accents, heavy ink washes",
      "watercolor fantasy": "dreamy watercolor storybook illustration, soft pigments, expressive wet-on-wet paint textures, delicate pencil lineart, fairytale atmosphere",
      "cyberpunk synthwave": "cyberpunk neon comic art, glowing synthwave colors, magenta and cyan lighting, holographic reflections, futuristic gritty manga, detailed background",
      "cartoon": "playful modern cartoon style, bold colorful shapes, cheerful Disney/Pixar comic strip, bright saturated colors, clean vector outlines, funny expressive gestures",
      "vintage halftone": "1960s silver age vintage comic print, CMYK dot pattern, aged yellowed paper texture, retro comic book cover art, nostalgic pulp illustration",
    };

    const styleAddition = styleModifiers[artStyle.toLowerCase()] || styleModifiers["comic book"];
    const refinedPrompt = `${imagePrompt}, ${styleAddition}, panel #${panelNumber}, highly detailed, sequential storytelling art, no text, clean composition`;

    // Fast, reliable image generator with Stable Diffusion XL / Flux via pollinations
    const cleanPrompt = encodeURIComponent(refinedPrompt.slice(0, 450));
    const randomSeed = seed || Math.floor(Math.random() * 999999);
    const imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=768&height=768&seed=${randomSeed}&nologo=true&model=flux`;

    return res.json({
      imageUrl,
      refinedPrompt,
      seed: randomSeed,
      artStyle,
    });
  } catch (error: any) {
    console.error("Image generation route error:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

// Audio Speech / Narration Endpoint (Gemini 3.8 Flash Lite TTS)
app.post("/api/comic/generate-speech", async (req, res) => {
  try {
    const { text, voice = "Kore" } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash-lite-tts",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: text,
                speechMetadata: {
                  style: "Engaging, dramatic comic book narrator",
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice || "Kore" },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({ audioBase64: `data:audio/wav;base64,${base64Audio}` });
      }
    }

    // Fallback: indicate client to use SpeechSynthesis
    return res.json({ audioBase64: null, useClientTTS: true });
  } catch (error) {
    console.warn("TTS generation warning, falling back to client synthesis:", error);
    return res.json({ audioBase64: null, useClientTTS: true });
  }
});

// Layout Binding Simulation (Matching layout_builder.py from Scenario 3)
app.post("/api/comic/layout-builder", (req, res) => {
  const { title, panels, layoutType = "grid" } = req.body;
  
  const layout = {
    layoutType,
    pageCount: Math.ceil((panels?.length || 4) / (layoutType === "strip" ? 3 : 4)),
    panelsPerPage: layoutType === "strip" ? 3 : 4,
    assembledAt: new Date().toISOString(),
    status: "READY_FOR_EXPORT",
    title: title || "Untitled Comic",
    totalPanels: panels?.length || 0,
  };

  res.json(layout);
});

// Project specs & architecture metadata (requested in the user brief)
app.get("/api/project-specs", (req, res) => {
  res.json({
    name: "ComicCraft AI",
    version: "2.4.0",
    stats: {
      epics: 8,
      tasks: 13,
      subtasks: 0,
    },
    team: [
      { name: "Aravindhan", role: "TeamLead", avatar: "A" },
      { name: "Abishek Kumar", role: "Member", avatar: "AK" },
      { name: "Rithika M", role: "Member", avatar: "RM" },
      { name: "Nilin Jenilia", role: "Member", avatar: "NJ" },
    ],
    technicalArchitecture: {
      frontend: "React 19 + Tailwind CSS + Lucide Icons + jsPDF",
      backend: "FastAPI / Node.js Express Hybrid Engine",
      aiModels: "Google Gemini 3.8 Flash + Gemini TTS + Stable Diffusion (Diffusers)",
      layoutPipeline: "layout_builder.py & exporters.py (FPDF)",
      hardwareRequirements: {
        processor: "Intel Core i5 (8th Gen+) / AMD Ryzen 5 or equivalent",
        ram: "Minimum 8 GB (Recommended: 16 GB for multitasking)",
        storage: "256 GB SSD (or 500 GB HDD minimum)",
        internet: "High-speed (10-20 Mbps recommended)",
      },
      softwareRequirements: {
        os: "Windows 10/11, macOS (Monterey+), or Linux (Ubuntu 20.04+)",
        browser: "Google Chrome, Mozilla Firefox, or Microsoft Edge",
        python: "Python 3.8+",
      },
    },
    scenarios: [
      {
        id: 1,
        title: "Scenario 1: Dramatic Enchanted Adventure",
        prompt: "A brave fox exploring an enchanted forest.",
        characterName: "Rusty",
        setting: "Enchanted Lumina Forest",
        tone: "dramatic",
        artStyle: "anime",
      },
      {
        id: 2,
        title: "Scenario 2: Light-Hearted Comic Book Iteration",
        prompt: "A clumsy robot detective trying to solve the mystery of the missing blueberry pie.",
        characterName: "Gizmo",
        setting: "Downtown Neo-Bakery",
        tone: "funny",
        artStyle: "comic book",
      },
      {
        id: 3,
        title: "Scenario 3: Layout Binding & Timestamped PDF Export",
        action: "Export comic using layout_builder and exporters with timestamped PDF download.",
      },
    ],
  });
});

// Fallback Mock Story Generator
function generateMockComicStory(params: {
  prompt: string;
  characterName: string;
  setting: string;
  tone: string;
  artStyle: string;
  panelCount: number;
  secondaryCharacters?: string;
}) {
  const { prompt, characterName, setting, tone, artStyle, panelCount } = params;
  const isFunny = tone.toLowerCase().includes("fun") || tone.toLowerCase().includes("humor");

  const title = isFunny
    ? `The Hilarious Adventures of ${characterName} in the ${setting}`
    : `The Chronicles of ${characterName}: Quest through the ${setting}`;

  const synopsis = isFunny
    ? `${characterName} sets out with grand plans in the ${setting}, only for ridiculous mishaps and surprising revelations to turn everything upside down!`
    : `Braving the perils of the ${setting}, ${characterName} confronts an unexpected revelation that will test courage and resolve.`;

  const panelTemplates = [
    {
      title: "The Journey Begins",
      angle: "Wide establishing shot",
      caption: `In the heart of the ${setting}, ${characterName} takes the fateful first steps into the unknown.`,
      dialogues: isFunny
        ? [
            { speaker: characterName, text: "I have a map! Well, actually it's a napkin recipe, but how hard can it be?!", type: "speech" },
          ]
        : [
            { speaker: characterName, text: "The ancient legends were true. There's no turning back now.", type: "thought" },
          ],
      sfx: isFunny ? "SQUEAK!" : "RUMBLE...",
      prompt: `${characterName}, courageous explorer, standing at the grand entrance of ${setting}, glowing mystical atmosphere, cinematic lighting, ${artStyle} comic art style`,
    },
    {
      title: "An Unexpected Obstacle",
      angle: "Dramatic low angle",
      caption: `Without warning, a strange disturbance rattles the quiet of the ${setting}.`,
      dialogues: isFunny
        ? [
            { speaker: characterName, text: "WHOA! That is definitely NOT on the vegetarian menu!", type: "shout" },
          ]
        : [
            { speaker: characterName, text: "Stay sharp. The shadows are breathing.", type: "whisper" },
          ],
      sfx: isFunny ? "BONK!" : "CRRAAACK!",
      prompt: `${characterName} startled reaction as an obstacle emerges in ${setting}, dynamic comic action shot, expressive eyes, vibrant colors, ${artStyle} illustration`,
    },
    {
      title: "The Turning Point",
      angle: "Extreme Close-up",
      caption: `With the stakes higher than ever, ${characterName} must think fast.`,
      dialogues: isFunny
        ? [
            { speaker: characterName, text: "Plan B: Smile, nod, and offer a shiny trinket!", type: "speech" },
          ]
        : [
            { speaker: characterName, text: "If we don't hold the line here, everything we fought for is lost!", type: "shout" },
          ],
      sfx: isFunny ? "BOING!" : "ZZZZAP!",
      prompt: `Intense close-up of ${characterName} making a pivotal decision, vibrant magical glow illuminating the face, detailed comic book panel, ${artStyle}`,
    },
    {
      title: "A Triumphant Revelation",
      angle: "Epic panoramic shot",
      caption: `The dust settles across the ${setting}, revealing the dawn of a brand-new legend.`,
      dialogues: isFunny
        ? [
            { speaker: characterName, text: "Told ya! Flawless execution from start to finish. Now... where's lunch?", type: "speech" },
          ]
        : [
            { speaker: characterName, text: "Peace returns to the realm. But the horizon beckons anew.", type: "speech" },
          ],
      sfx: isFunny ? "TA-DA!" : "SHHHRRRING!",
      prompt: `Heroic victory shot of ${characterName} standing tall against the sunrise in ${setting}, epic comic finale, gorgeous painted background, ${artStyle}`,
    },
  ];

  const panels = Array.from({ length: panelCount }, (_, i) => {
    const template = panelTemplates[i % panelTemplates.length];
    return {
      panelNumber: i + 1,
      panelTitle: `Panel ${i + 1}: ${template.title}`,
      cameraAngle: template.angle,
      imagePrompt: `${template.prompt}, prompt context: ${prompt}`,
      caption: template.caption,
      dialogues: template.dialogues,
      soundEffect: template.sfx,
    };
  });

  return {
    title,
    synopsis,
    tone,
    artStyle,
    mainCharacter: {
      name: characterName,
      visualDescription: `Distinctive stylized ${characterName} suited for ${artStyle} comic storytelling with expressive features`,
    },
    panels,
  };
}

// Development and production Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true, port: Number(PORT), host: "0.0.0.0" },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ComicCraft AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
