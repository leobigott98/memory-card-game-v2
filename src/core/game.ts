import { GAME_CONFIG } from "../config/game-config";
import { createDeck } from "./deck";
import type { CardItem } from "./deck";

type GameElements = {
  boardElement: HTMLDivElement;
  timeElement: HTMLSpanElement;
  attemptsElement: HTMLSpanElement;
  restartButton: HTMLButtonElement;
  modalElement: HTMLDivElement;
  modalTitle: HTMLHeadingElement;
  modalText: HTMLParagraphElement;
  modalActionButton: HTMLButtonElement;
  closeModalButton: HTMLButtonElement;
};

type GameState = {
  deck: CardItem[];
  firstCardIndex: number | null;
  secondCardIndex: number | null;
  attempts: number;
  matches: number;
  lockBoard: boolean;
  gameOver: boolean;
  remainingSeconds: number;
  timerId: number | null;
};

export function createGame(elements: GameElements): void {
  const state: GameState = {
    deck: [],
    firstCardIndex: null,
    secondCardIndex: null,
    attempts: 0,
    matches: 0,
    lockBoard: false,
    gameOver: false,
    remainingSeconds: GAME_CONFIG.rules.timeLimitSeconds,
    timerId: null,
  };

  function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function updateHud(): void {
    elements.timeElement.textContent = formatTime(state.remainingSeconds);
    elements.attemptsElement.textContent = `${state.attempts} / ${GAME_CONFIG.rules.maxAttempts}`;
  }

  function stopTimer(): void {
    if (state.timerId !== null) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function startTimer(): void {
    stopTimer();
    state.timerId = window.setInterval(() => {
      if (state.gameOver) return;

      state.remainingSeconds -= 1;
      updateHud();

      if (state.remainingSeconds <= 0) {
        loseGame(GAME_CONFIG.texts.loseMessage);
      }
    }, 1000);
  }

  function openModal(title: string, text: string, actionText: string): void {
    elements.modalTitle.textContent = title;
    elements.modalText.textContent = text;
    elements.modalActionButton.textContent = actionText;
    elements.modalElement.classList.remove("hidden");
    elements.modalElement.setAttribute("aria-hidden", "false");
  }

  function closeModal(): void {
    elements.modalElement.classList.add("hidden");
    elements.modalElement.setAttribute("aria-hidden", "true");
  }

  function resetSelections(): void {
    state.firstCardIndex = null;
    state.secondCardIndex = null;
    state.lockBoard = false;
  }

  function renderBoard(): void {
    elements.boardElement.innerHTML = "";

    state.deck.forEach((card, index) => {
      const cardElement = document.createElement("button");
      cardElement.className = "memory-card";
      cardElement.type = "button";
      cardElement.dataset.index = String(index);
      cardElement.setAttribute("aria-label", `Carta ${index + 1}`);

      cardElement.innerHTML = `
  <div class="memory-card__inner">
    <div
      class="memory-card__face memory-card__face--front"
      style="background-image: url('${card.image}')"
    ></div>
    <div
      class="memory-card__face memory-card__face--back"
      style="background-image: url('${GAME_CONFIG.brand.cardBack}')"
    ></div>
  </div>
`;

      if (card.matched) {
        cardElement.classList.add("is-flipped", "is-matched");
        cardElement.disabled = true;
      }

      cardElement.addEventListener("click", () => handleCardClick(index));
      elements.boardElement.appendChild(cardElement);
    });
  }

  function getCardElement(index: number): HTMLButtonElement | null {
    return elements.boardElement.querySelector(
      `.memory-card[data-index="${index}"]`,
    ) as HTMLButtonElement | null;
  }

  function flipCard(index: number): void {
    const cardElement = getCardElement(index);
    if (!cardElement) return;

    cardElement.offsetHeight;
    cardElement.classList.add("is-flipped");
  }

  function unflipCard(index: number): void {
    const cardElement = getCardElement(index);
    if (!cardElement) return;

    cardElement.classList.remove("is-flipped");
  }

  function markMatched(index: number): void {
    const cardElement = getCardElement(index);
    if (!cardElement) return;

    cardElement.classList.add("is-flipped", "is-matched");
    cardElement.disabled = true;
    cardElement.style.pointerEvents = "none";
  }

  function checkWin(): void {
    if (state.matches === GAME_CONFIG.board.pairs) {
      state.gameOver = true;
      stopTimer();
      window.setTimeout(() => {
        openModal(
          GAME_CONFIG.texts.winTitle,
          GAME_CONFIG.texts.winMessage,
          GAME_CONFIG.texts.playAgain,
        );
      }, GAME_CONFIG.rules.winDelayMs);
    }
  }

  function loseGame(message: string): void {
    if (state.gameOver) return;
    state.gameOver = true;
    state.lockBoard = true;
    stopTimer();

    openModal(GAME_CONFIG.texts.loseTitle, message, GAME_CONFIG.texts.tryAgain);
  }

  function handleMatch(firstIndex: number, secondIndex: number): void {
    state.deck[firstIndex].matched = true;
    state.deck[secondIndex].matched = true;
    state.matches += 1;

    markMatched(firstIndex);
    markMatched(secondIndex);

    resetSelections();
    checkWin();
  }

  function handleMismatch(firstIndex: number, secondIndex: number): void {
    window.setTimeout(() => {
      if (state.gameOver) return;

      unflipCard(firstIndex);
      unflipCard(secondIndex);

      state.firstCardIndex = null;
      state.secondCardIndex = null;
      state.lockBoard = false;
    }, GAME_CONFIG.rules.flipBackDelayMs);
  }

  function handleCardClick(index: number): void {
    if (state.deck[index].matched) return;
    if (state.gameOver || state.lockBoard) return;
    if (state.firstCardIndex === index) return;
    if (state.deck[index].matched) return;

    flipCard(index);

    if (state.firstCardIndex === null) {
      state.firstCardIndex = index;
      return;
    }

    state.secondCardIndex = index;
    state.lockBoard = true;
    state.attempts += 1;
    updateHud();

    const firstIndex = state.firstCardIndex;
    const secondIndex = state.secondCardIndex;

    if (firstIndex === null || secondIndex === null) return;

    const isMatch =
      state.deck[firstIndex].name === state.deck[secondIndex].name;

    if (isMatch) {
      window.setTimeout(() => {
        handleMatch(firstIndex, secondIndex);
      }, 450);
      return;
    }

    if (state.attempts >= GAME_CONFIG.rules.maxAttempts) {
      window.setTimeout(() => {
        loseGame(GAME_CONFIG.texts.loseMessage);
      }, 500);
      return;
    }

    handleMismatch(firstIndex, secondIndex);
  }

  function restartGame(): void {
    stopTimer();

    state.deck = createDeck();
    state.firstCardIndex = null;
    state.secondCardIndex = null;
    state.attempts = 0;
    state.matches = 0;
    state.lockBoard = false;
    state.gameOver = false;
    state.remainingSeconds = GAME_CONFIG.rules.timeLimitSeconds;

    closeModal();
    updateHud();
    renderBoard();
    startTimer();
  }

  elements.restartButton.addEventListener("click", restartGame);
  elements.modalActionButton.addEventListener("click", restartGame);
  elements.closeModalButton.addEventListener("click", restartGame);

  restartGame();
}
