import React from 'react';
import './Card.css';
import { GameCard } from '../../types';

export interface CardProps {
  data: GameCard;
  onClick: (gameCardId: number, uniqueId: number) => void;
  className?: string;
}

const Card: React.FC<CardProps> = (props: CardProps): React.ReactElement => {
  const {
    data: {
      data: { id, loginName, avatarURL },
      id: gameCardId,
      isFaceDown,
    },
    onClick: onClickCardCallback,
    className = '',
  } = props;

  return (
    <div
      className={`memory-card border-solid border-1 border-grey-200 rounded-lg ${className}`}
      tabIndex={0}
      role="button"
      aria-pressed={false}
      title="Click to flip the card"
      onClick={(): void => onClickCardCallback(gameCardId, id)}>
      <div
        className={`memory-card__image rounded-lg ${
          isFaceDown && 'memory-card__overlay'
        }`}>
        <img src={avatarURL} alt={loginName} className="rounded-lg" />
      </div>
    </div>
  );
};

export default Card;
