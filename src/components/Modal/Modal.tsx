import React from 'react';
import './Modal.css';

import { useGameContext } from '../../hooks';

export interface ModalProps {
  onOk: () => void;
}

const Modal: React.FC<ModalProps> = (props: ModalProps): React.ReactElement | null => {
  const { onOk: handleOnOkCallBack } = props;

  const {
    state: { isGameOver, score },
  } = useGameContext();

  if (!isGameOver) return null;

  return (
    <div className="modal" id="modal">
      <div className="modal__contentainer-wrapper">
        <div className="modal__overlay">
          <div className="modal__overlay-mask" />
        </div>
        <span className="modal__center-anchor">&#8203;</span>
        <div
          className="modal__container"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline">
          <div className="modal__body text-center text-2xl">
            <p>
              <span className="text-center text-5xl">
                GAME
                <br />
                OVER
              </span>
            </p>
            <p className="my-5">{`Score: ${score}`}</p>
            <button
              id="modal-button"
              className="button"
              title="New game!"
              aria-label="New game!"
              onClick={handleOnOkCallBack}>
              New game!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
