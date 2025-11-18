export interface CardDTO {
  id: string;
  value: string;
  suit: string;
  depth: number;
  playable: boolean;
  locked: boolean;
  power?: boolean;
}
