import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useSpeechSynthesis } from "react-speech-kit";

interface TextToSpeechProps {
  articleId: string;
}

export function TextToSpeech({ articleId }: TextToSpeechProps) {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { speak, speaking, cancel } = useSpeechSynthesis();

  useEffect(() => {
    const fetchText = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/articles/${articleId}/text`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        if (!data.text) {
          throw new Error("No text content available in the response");
        }
        setText(data.text);
      } catch (error) {
        console.error("Error fetching text:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch text. Please ensure the article has a valid PDF file."
        );
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchText();
    }
  }, [articleId]);

  const handleSpeak = () => {
    if (speaking) {
      cancel();
    } else if (text) {
      speak({ text });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSpeak}
        disabled={loading || !text || !!error}
        className="flex items-center gap-2"
      >
        {speaking ? (
          <>
            <VolumeX className="h-4 w-4" />
            Stop Reading
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4" />
            Read Aloud
          </>
        )}
      </Button>
      {loading && (
        <span className="text-sm text-gray-500">Loading text...</span>
      )}
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
