import { Piece } from './pieces/piece'
import { newPiece } from './pieces/factory'

/** class represent chess pieces with its coordinates and
 *  ability to make special move, i.e castling and capture en-passant
 */
export class Position {

  public static readonly NOTES = {
    MISSING_WHITE_KING: 'Missing white King',
    MISSING_BLACK_KING: 'Missing black King',
    TOO_MANY_WHITE_PIECES: 'Too many white pieces',
    TOO_MANY_BLACK_PIECES: 'Too many black pieces',
    TOO_MANY_WHITE_KINGS: 'Too many white king',
    TOO_MANY_BLACK_KINGS: 'Too many black king',
    PAWN_ON_FIRST_RANK: 'Pawn on first rank illegal',
    PAWN_ON_LAST_RANK: 'Pawn on last rank illegal',
  }

  /** FEN representation of initial position */
  public static readonly INITIAL: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w QKqk -'

  private _rows: Piece[][] = [[], [], [], [], [], [], [], []]
  private _whitePieces: Piece[] = [] // White King first
  private _blackPieces: Piece[] = [] // Black King first

  private _whitesToMove: boolean
  private _whiteCastlingLongEnabled: boolean
  private _whiteCastlingShortEnabled: boolean
  private _blackCastlingLongEnabled: boolean
  private _blackCastlingShortEnabled: boolean
  private _captureEnpassantTarget: number

  private _violations: string[]

  /** construct Position from given FEN representation
   *  @param fen FEN representation
   */
  constructor(fen: string) {
    this.parse(fen)
  }

  public isValid(): boolean {
    return this._violations.length === 0
  }

  get violations(): string[] {
    return this._violations
  }

  get whitesToMove(): boolean {
    return this._whitesToMove
  }

  /**
   * Switch next turn to move
   */
  public nextTurnToMove() {
    this._whitesToMove = !this._whitesToMove
  }

  get whiteCastlingLongEnabled(): boolean {
    return this._whiteCastlingLongEnabled
  }

  get whiteCastlingShortEnabled(): boolean {
    return this._whiteCastlingShortEnabled
  }

  get blackCastlingLongEnabled(): boolean {
    return this._blackCastlingLongEnabled
  }

  get blackCastlingShortEnabled(): boolean {
    return this._blackCastlingShortEnabled
  }

  get captureEnpassantTarget(): number {
    return this._captureEnpassantTarget
  }

  get at(): Piece[][] {
    return this._rows
  }

  get whitePieces(): Piece[] {
    return this._whitePieces
  }

  get blackPieces(): Piece[] {
    return this._blackPieces
  }

  public clear() {
    // TODO: position
    this._violations = []
    this._whitePieces = []
    this._blackPieces = []
  }

  /** Set current position from given FEN representation
   *  @param fen - FEN representation
   */
  public parse(fen: string) {
    this.clear()
    this._whitesToMove = false
    const l = fen.length
    if (l === 0) {
      this._violations.push(Position.NOTES.MISSING_WHITE_KING)
      this._violations.push(Position.NOTES.MISSING_BLACK_KING)
      return
    }
    let curRow = 0
    let curCol = 0
    let k
    for (k = 0; k < l && curRow < 8 && curCol < 8; k++) {
      const ch = fen[k]
      if (ch === ' ') continue
      if (/\d/.test(ch)) {
        curCol += Number.parseInt(ch)
      } else if (ch === '/') {
        if (curCol !== 0) {
          console.log(`Invalid FEN at position ${k} (char ${ch}) row ${curRow}, col ${curCol}`)
          throw new Error('Invalid FEN')
        }
      } else {
        const piece = newPiece(ch, curRow, curCol)
        if (piece.isWhite) {
          if (piece.fenCode === 'K') {
            if (this._whitePieces.length > 0 && this._whitePieces[0].fenCode === 'K') {
              this._violations.push(Position.NOTES.TOO_MANY_WHITE_KINGS)
            }
            this._whitePieces.unshift(piece)
          } else {
            this._whitePieces.push(piece)
          }
        } else {
          if (piece.fenCode === 'k') {
            if (this._blackPieces.length > 0 && this._blackPieces[0].fenCode === 'k') {
              this._violations.push(Position.NOTES.TOO_MANY_BLACK_KINGS)
            }
            this._blackPieces.unshift(piece)
          } else {
            this._blackPieces.push(piece)
          }
        }
        if (/p/i.test(piece.fenCode)) {
          if (curRow === 0) this._violations.push(Position.NOTES.PAWN_ON_LAST_RANK)
          if (curRow === 7) this._violations.push(Position.NOTES.PAWN_ON_FIRST_RANK)
        }

        this._rows[curRow][curCol] = piece
        curCol++
      }
      if (curCol === 8) {
          curCol = 0
          curRow++
      }
    }

    if (this._whitePieces.length === 0 || this._whitePieces[0].fenCode !== 'K') {
      this._violations.push(Position.NOTES.MISSING_WHITE_KING)
    }
    if (this._blackPieces.length === 0 || this._blackPieces[0].fenCode !== 'k') {
      this._violations.push(Position.NOTES.MISSING_BLACK_KING)
    }
    if (this._whitePieces.length > 16) {
      this._violations.push(Position.NOTES.TOO_MANY_WHITE_PIECES)
    }
    if (this._blackPieces.length > 16) {
      this._violations.push(Position.NOTES.TOO_MANY_BLACK_PIECES)
    }
    const parts = fen.slice(k).trim().split(' ')
    const castlingAbility = parts[1]
    const enpassantTarget = parts[2]

    if (parts.length > 0) {
        this._whitesToMove = (parts[0] === 'w')
    } else this._whitesToMove = true

    if (parts.length > 1) {
      this._whiteCastlingLongEnabled = parts[1].includes('Q')
      this._whiteCastlingShortEnabled = parts[1].includes('K')
      this._blackCastlingLongEnabled = parts[1].includes('q')
      this._blackCastlingShortEnabled = parts[1].includes('k')
    }

    if (parts.length > 2) {
      if (parts[2][0] === '-') {
        this._captureEnpassantTarget = -1
      } else {
         this._captureEnpassantTarget = parts[2].toLowerCase().charCodeAt(0) - 97
      }
    }
  }
}
