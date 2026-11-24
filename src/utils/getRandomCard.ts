import type { Card } from '../main/types/card';

export const getRandomCard = (cards: Array<Card>): Card | null => {
  if (cards.length === 0) return null;

  const getWeight = (card: Card) => (6 - card.grade) ** 2;
  const sum = cards.reduce((acc, card) => acc + getWeight(card), 0);
  let randomNumber = Math.random() * sum;

  for (const card of cards) {
    randomNumber -= getWeight(card);
    if (randomNumber < 0) return card;
  }

  return cards[cards.length - 1];
};
