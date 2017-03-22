import IPiece from './piece';

export default class Bishop implements IPiece {

  constructor(public readonly isWhite: boolean) {
  }

  get fenCode(): string {
    return this.isWhite ? 'B' : 'b';
  }
}