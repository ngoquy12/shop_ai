import { Metadata } from 'next';
import { AIToolDetailPage } from '@/components/ai-tool-detail-page';

export const metadata: Metadata = {
  title: 'Chi tiết Công cụ AI',
  description: 'Tính năng và thông tin chi tiết về công cụ AI',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <AIToolDetailPage id={resolvedParams.id} />;
}
