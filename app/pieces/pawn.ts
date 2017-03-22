import IPiece from './piece';

export default class Pawn implements IPiece {

  constructor(public readonly isWhite: boolean) {
  }

  get fenCode(): string {
    return this.isWhite ? 'P' : 'p';
  }
}