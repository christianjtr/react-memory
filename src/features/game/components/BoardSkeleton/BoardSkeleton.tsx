import type { ReactElement } from 'react';

export interface BoardSkeletonProps {
  count?: number;
}

export function BoardSkeleton({ count = 12 }: BoardSkeletonProps): ReactElement {
  return (
    <div aria-hidden="true" className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="relative aspect-square overflow-hidden rounded-2xl border border-white/70 bg-white/60">
          <div
            className="absolute inset-0 animate-shimmer opacity-80"
            style={{
              backgroundImage:
                'linear-gradient(110deg, transparent 20%, rgb(255 255 255 / 0.9) 50%, transparent 80%)',
              backgroundSize: '220% 100%',
            }}
          />
        </div>
      ))}
    </div>
  );
}
