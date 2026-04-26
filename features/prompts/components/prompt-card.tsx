import Link from 'next/link';
import { Prompt } from '../types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Download, MessageSquare } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PromptCardProps {
  prompt: Prompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        {/* Placeholder cho ảnh cover của Prompt nếu có */}
        <div className="w-full h-40 bg-muted/50 flex items-center justify-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground opacity-20" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-5 space-y-3">
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className="font-semibold text-xs">
            {prompt.modelType}
          </Badge>
          <div className="flex items-center space-x-1 text-yellow-500 text-sm font-medium">
            <span>{prompt.averageRating > 0 ? prompt.averageRating.toFixed(1) : 'Mới'}</span>
            <Star className="w-4 h-4 fill-current" />
          </div>
        </div>
        
        <Link href={`/prompt-mien-phi/${prompt.slug}`} className="hover:underline line-clamp-2">
          <h3 className="text-xl font-bold leading-tight">{prompt.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {prompt.description}
        </p>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Download className="w-4 h-4" />
          <span>{prompt.purchaseCount || 0}</span>
        </div>
        <div className="font-bold text-lg text-primary">
          {prompt.isFree ? 'Miễn phí' : formatCurrency(prompt.price ?? 0)}
        </div>
      </CardFooter>
    </Card>
  );
}
