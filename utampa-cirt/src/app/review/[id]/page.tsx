import { MainLayout } from "@/components/layout/MainLayout";
import { ReviewForm } from "@/components/review/ReviewForm";

export default async function ReviewArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <MainLayout isAuthenticated={true}>
      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="ut-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Review Article</h1>
            <p className="text-gray-600">Review and provide feedback</p>
          </div>
          <ReviewForm articleId={id} />
        </div>
      </div>
    </MainLayout>
  );
}
