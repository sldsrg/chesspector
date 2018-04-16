import { IPiece } from './piece'
import { Bishop } from './bishop'
import { King } from './king'
import { Knight } from './knight'
import { Pawn } from './pawn'
import { Queen } from './queen'
import { Rook } from './rook'

export function newPiece(code: string, row: number, column: number): IPiece {
  const isWhite = /[RNBQKP]/.test(code)
  switch (code.toUpperCase()) {
  case 'P': return new Pawn(row, column, isWhite)
  case 'R': return new Rook(row, column, isWhite)
  case 'N': return new Knight(row, column, isWhite)
  case 'B': return new Bishop(row, column, isWhite)
  case 'Q': return new Queen(row, column, isWhite)
  case 'K': return new King(row, column, isWhite)
  default:  return null
  }
}
