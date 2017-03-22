import IPiece from './piece';

export default class Knight implements IPiece {
 
  constructor(public readonly isWhite: boolean) {
  }

  get fenCode(): string {
    return this.isWhite ? 'N' : 'n';
  }
}