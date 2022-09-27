import React from 'react';
import { Contributor } from '../../types/Contributor';

interface CardProps {
  data: Contributor;
  className?: string;
}

const Card: React.FC<CardProps> = (props: CardProps): React.ReactElement => {
  const {
    data: { loginName, avatarURL },
    className = undefined,
  } = props;

  return (
    <div className={className}>
      <figure>
        <img src={avatarURL} alt={loginName} />
      </figure>
    </div>
  );
};

export default Card;
