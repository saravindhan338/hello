export type ComicTone =
  | "dramatic"
  | "funny"
  | "action"
  | "mysterious"
  | "whimsical"
  | "dark-noir"
  | "heartwarming";

export type ComicArtStyle =
  | "comic book"
  | "anime"
  | "noir graphic novel"
  | "watercolor fantasy"
  | "cyberpunk synthwave"
  | "cartoon"
  | "vintage halftone";

export type BubbleType = "speech" | "thought" | "shout" | "whisper";

export interface Dialogue {
  id?: string;
  speaker: string;
  text: string;
  type: BubbleType;
}

export interface ComicPanel {
  panelNumber: number;
  panelTitle: string;
  cameraAngle: string;
  imagePrompt: string;
  imageUrl?: string;
  isImageLoading?: boolean;
  caption: string;
  dialogues: Dialogue[];
  soundEffect?: string;
  soundEffectColor?: string;
}

export interface MainCharacter {
  name: string;
  visualDescription: string;
}

export interface ComicStory {
  id: string;
  title: string;
  synopsis: string;
  prompt: string;
  characterName: string;
  setting: string;
  tone: ComicTone;
  artStyle: ComicArtStyle;
  panelCount: number;
  createdAt: string;
  mainCharacter: MainCharacter;
  panels: ComicPanel[];
}

export interface ExportResult {
  filename: string;
  timestamp: string;
  fileSizeBytes: number;
  pageCount: number;
  panelCount: number;
  layoutType: string;
  pdfBlobUrl?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  skills?: string[];
}

export interface ProjectSpecs {
  name: string;
  version: string;
  stats: {
    epics: number;
    tasks: number;
    subtasks: number;
  };
  team: TeamMember[];
  technicalArchitecture: {
    frontend: string;
    backend: string;
    aiModels: string;
    layoutPipeline: string;
    hardwareRequirements: {
      processor: string;
      ram: string;
      storage: string;
      internet: string;
    };
    softwareRequirements: {
      os: string;
      browser: string;
      python: string;
    };
  };
  scenarios: Array<{
    id: number;
    title: string;
    prompt: string;
    characterName: string;
    setting: string;
    tone: string;
    artStyle: string;
  }>;
}
