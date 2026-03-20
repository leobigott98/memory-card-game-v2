import { GAME_CONFIG } from '../config/game-config';

export type CardItem = {
  uid: string;
  name: string;
  image: string;
  matched: boolean;
};

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createDeck(): CardItem[] {
  const duplicated = [...GAME_CONFIG.cards, ...GAME_CONFIG.cards];

  return shuffle(
    duplicated.map((card, index) => ({
      uid: `${card.name}-${index}-${Math.random().toString(36).slice(2, 8)}`,
      name: card.name,
      image: card.image,
      matched: false,
    })),
  );
}