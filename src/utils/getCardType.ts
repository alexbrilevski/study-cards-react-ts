import type { Card, CardType } from '../main/types/card';

export const getCardType = (card: Pick<Card, 'type'>): CardType =>
  card.type === 'image' ? 'image' : 'text';
