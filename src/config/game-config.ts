export const GAME_CONFIG = {
  brand: {
    title: 'Doritos',
    logo: '/assets/branding/logo.png',
    background: '/assets/branding/background.webp',
    cardBack: '/assets/branding/card-back.webp',
  },
  board: {
    rows: 4,
    cols: 3,
    pairs: 6,
  },
  rules: {
    maxAttempts: 12,
    timeLimitSeconds: 60,
    flipBackDelayMs: 850,
    winDelayMs: 500,
  },
  texts: {
    attempts: 'Intentos',
    time: 'Tiempo',
    restart: 'Reiniciar juego',
    winTitle: '🎉 ¡Felicidades!',
    winMessage: 'Has ganado',
    loseTitle: '😢 ¡Lo sentimos!',
    loseMessage: 'Has agotado el número de intentos.',
    playAgain: 'Jugar de nuevo',
    tryAgain: 'Intentar de nuevo',
  },
  cards: [
    { name: 'card-01', image: '/assets/cards/card-01.webp' },
    { name: 'card-02', image: '/assets/cards/card-02.webp' },
    { name: 'card-03', image: '/assets/cards/card-03.webp' },
    { name: 'card-04', image: '/assets/cards/card-04.webp' },
    { name: 'card-05', image: '/assets/cards/card-05.webp' },
    { name: 'card-06', image: '/assets/cards/card-06.webp' },
  ],
};