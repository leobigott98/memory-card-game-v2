import './styles/base.css';
import './styles/layout.css';
import './styles/board.css';
import './styles/card.css';
import './styles/modal.css';
import './styles/kiosk.css';

import { GAME_CONFIG } from './config/game-config';
import { createGame } from './core/game';
import { preloadImages } from './core/preload';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root not found');
}

app.innerHTML = `
  <main class="app-shell" style="background-image: url('${GAME_CONFIG.brand.background}')">
    <header class="topbar">
      <img class="brand-logo" src="${GAME_CONFIG.brand.logo}" alt="${GAME_CONFIG.brand.title}" />
      <div class="hud">
      <!--
        <div class="hud-card">
          <span class="hud-label">${GAME_CONFIG.texts.time}</span>
          <span class="hud-value" id="timeValue">00:45</span>
        </div>
      -->
        <div class="hud-card">
          <span class="hud-label">${GAME_CONFIG.texts.attempts}</span>
          <span class="hud-value" id="attemptsValue">0 / ${GAME_CONFIG.rules.maxAttempts}</span>
        </div>
      </div>
    </header>

    <section class="board-section">
      <div id="board" class="board"></div>
    </section>

    <footer class="footer-bar">
      <button id="restartButton" class="primary-button">
        ${GAME_CONFIG.texts.restart}
      </button>
    </footer>

    <div id="gameModal" class="modal hidden" aria-hidden="true">
      <div class="modal-overlay"></div>
      <div class="modal-card">
        <button id="closeModalButton" class="modal-close" aria-label="Cerrar">×</button>
        <h2 id="modalTitle"></h2>
        <p id="modalText"></p>
        <button id="modalActionButton" class="modal-action-button"></button>
      </div>
    </div>
  </main>
`;

try {
  await preloadImages([
    GAME_CONFIG.brand.logo,
    GAME_CONFIG.brand.background,
    GAME_CONFIG.brand.cardBack,
    ...GAME_CONFIG.cards.map(card => card.image),
  ]);
} catch (error) {
  console.error('Image preload failed:', error);
}

createGame({
  boardElement: document.getElementById('board') as HTMLDivElement,
  timeElement: document.getElementById('timeValue') as HTMLSpanElement,
  attemptsElement: document.getElementById('attemptsValue') as HTMLSpanElement,
  restartButton: document.getElementById('restartButton') as HTMLButtonElement,
  modalElement: document.getElementById('gameModal') as HTMLDivElement,
  modalTitle: document.getElementById('modalTitle') as HTMLHeadingElement,
  modalText: document.getElementById('modalText') as HTMLParagraphElement,
  modalActionButton: document.getElementById('modalActionButton') as HTMLButtonElement,
  closeModalButton: document.getElementById('closeModalButton') as HTMLButtonElement,
});
