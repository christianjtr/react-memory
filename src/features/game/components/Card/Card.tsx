import { memo, type ReactElement } from 'react';
import type { GameCard } from '../../types';

export interface CardProps {
  card: GameCard;
  disabled?: boolean;
  onSelect: (cardId: number) => void;
}

export const Card = memo(function Card({
  card,
  disabled = false,
  onSelect,
}: CardProps): ReactElement {
  const { cardId, contributor, isFaceDown, isMatched } = card;
  const isFlipped = !isFaceDown;
  const isDisabled = disabled || isMatched || isFlipped;
  const label = isFaceDown
    ? `Carta ${cardId + 1} boca abajo`
    : isMatched
      ? `${contributor.loginName}, pareja encontrada`
      : `${contributor.loginName}, carta volteada`;

  const handleClick = (): void => {
    onSelect(cardId);
  };

  return (
    <button
      type="button"
      className="group aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-default"
      aria-label={label}
      aria-pressed={isFlipped}
      disabled={isDisabled}
      title={isFaceDown ? 'Voltear carta' : contributor.loginName}
      onClick={handleClick}>
      <span
        className={`flex h-full w-full items-center justify-center rounded-[inherit] ${
          isFaceDown
            ? 'bg-slate-300 group-hover:border-4 group-hover:border-sky-700 [&>img]:opacity-0'
            : 'bg-white'
        }`}>
        <img
          src={contributor.avatarURL}
          alt=""
          className="h-full w-full rounded-[inherit] object-cover"
          width={128}
          height={128}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </span>
    </button>
  );
});
