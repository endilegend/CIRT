declare module "react-speech-kit" {
  interface SpeechSynthesisOptions {
    text: string;
    rate?: number;
    pitch?: number;
    voice?: SpeechSynthesisVoice;
  }

  interface SpeechSynthesisHook {
    speak: (options: SpeechSynthesisOptions) => void;
    speaking: boolean;
    cancel: () => void;
    voices: SpeechSynthesisVoice[];
  }

  export function useSpeechSynthesis(): SpeechSynthesisHook;
}
