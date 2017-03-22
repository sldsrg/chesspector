import IPiece from './piece';

export default class Rook implements IPiece {

  constructor(public readonly isWhite: boolean) {
  }

  get fenCode(): string {
    return this.isWhite ? 'R' : 'r';
  }
}