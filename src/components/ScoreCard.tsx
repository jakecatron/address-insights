interface ScoreCardProps {
    title: string;
    score: number | string;
    subtitle?: string;
  }
  
  export default function ScoreCard({ title, score, subtitle }: ScoreCardProps) {
    return (
      <div className="rounded-2xl border border-[#e8e8ea] bg-white p-6 shadow-sm transition hover:border-[#ff4f00]/25">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-[#1a1a1a]">
          {score}
        </p>
        {subtitle && (
          <p className="mt-1.5 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
    );
  }