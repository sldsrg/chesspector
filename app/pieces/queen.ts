import IPiece from './piece';

export default class Queen implements IPiece {

  constructor(public readonly isWhite: boolean) {
  }

  get fenCode(): string {
    return this.isWhite ? 'Q' : 'q';
  }
}