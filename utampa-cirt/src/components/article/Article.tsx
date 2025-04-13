import { TextToSpeech } from "./TextToSpeech";

type MyType = Record<string, unknown>;

interface ArticleProps {
  article: {
    id: string;
  };
}

export function Article({ article }: ArticleProps) {
  return <TextToSpeech articleId={article.id} />;
}
