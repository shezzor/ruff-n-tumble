import { RnTGame } from 'RnTGame';
import { throwIfFalsy } from '@shezzor/bb-engine';

window.onload = function init(): void {
  const playButton = throwIfFalsy(document.querySelector('main > button'), 'Oh no! Unable to find start button! :(');
  const game = new RnTGame();

  game.initialise().then(function handleCompleted() {
    playButton.classList.add('load-completed');
    playButton.setAttribute('title', 'Click to play game');

    playButton.addEventListener('click', function handleStartButtonClick() {
      game.start();
    }, { once: true });
  }); 
};