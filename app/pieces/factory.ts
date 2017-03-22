import IPiece from './piece';
import Pawn from './pawn';
import Rook from './rook';
import Knight from './knight';
import Bishop from './bishop';
import Queen from './queen';
import King from './king';

export default function newPiece(code: string): IPiece {
  let isWhite = /[RNBQKP]/.test(code);
  switch (code.toUpperCase()) {
  case 'P': return new Pawn(isWhite); 
  case 'R': return new Rook(isWhite); 
  case 'N': return new Knight(isWhite); 
  case 'B': return new Bishop(isWhite); 
  case 'Q': return new Queen(isWhite); 
  case 'K': return new King(isWhite); 
  default:  return null;
  }
}