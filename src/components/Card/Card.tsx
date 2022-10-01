import React from 'react';
import './Card.css';
import { GameCard } from '../../types';

interface CardProps {
  data: GameCard;
  onClick: (cardId: number) => void;
}

const Card: React.FC<CardProps> = (props: CardProps): React.ReactElement => {
  const {
    data: {
      data: { loginName, avatarURL },
      id,
      isFaceDown,
    },
    onClick: onClickCardCallback,
  } = props;

  return (
    <div
      className="memory-card border-solid border-1 border-grey-200 rounded-lg"
      tabIndex={0}
      role="button"
      aria-pressed={false}
      title="Click to flip the card"
      onClick={(): void => onClickCardCallback(id)}>
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
