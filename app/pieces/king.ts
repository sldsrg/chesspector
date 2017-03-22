import IPiece from './piece';

export default class King implements IPiece {
  
  constructor(public readonly isWhite: boolean) {
  }

  get fenCode(): string {
    return this.isWhite ? 'K' : 'k';
  }
}