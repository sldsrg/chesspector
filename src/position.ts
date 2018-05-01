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

  private position: Piece[][] = [[], [], [], [], [], [], [], []]
  private mWhitePieces: Piece[] = [] // White King first
  private mBlackPieces: Piece[] = [] // Black King first

  private mWhitesToMove: boolean
  private mWhiteCastlingLongEnabled: boolean
  private mWhiteCastlingShortEnabled: boolean
  private mBlackCastlingLongEnabled: boolean
  private mBlackCastlingShortEnabled: boolean
  private mCaptureEnpassantTarget: number

  private mViolations: string[]

  /** construct Position from given FEN representation
   *  @param fen - FEN representation
   */
  constructor(fen: string) {
    this.parse(fen)
  }

  public isValid(): boolean {
    return this.mViolations.length === 0
  }

  get violations(): string[] {
    return this.mViolations
  }

  get whitesToMove(): boolean {
    return this.mWhitesToMove
  }

  get whiteCastlingLongEnabled(): boolean {
    return this.mWhiteCastlingLongEnabled
  }

  get whiteCastlingShortEnabled(): boolean {
    return this.mWhiteCastlingShortEnabled
  }

  get blackCastlingLongEnabled(): boolean {
    return this.mBlackCastlingLongEnabled
  }

  get blackCastlingShortEnabled(): boolean {
    return this.mBlackCastlingShortEnabled
  }

  get captureEnpassantTarget(): number {
    return this.mCaptureEnpassantTarget
  }

  get at(): Piece[][] {
    return this.position
  }

  get whitePieces(): Piece[] {
    return this.mWhitePieces
  }

  get blackPieces(): Piece[] {
    return this.mBlackPieces
  }

  public clear() {
    // TODO: position
    this.mViolations = []
    this.mWhitePieces = []
    this.mBlackPieces = []
  }

  /** Set current position from given FEN representation
   *  @param fen - FEN representation
   */
  public parse(fen: string) {
    this.clear()
    this.mWhitesToMove = false
    const l = fen.length
    if (l === 0) {
      this.mViolations.push(Position.NOTES.MISSING_WHITE_KING)
      this.mViolations.push(Position.NOTES.MISSING_BLACK_KING)
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
            if (this.mWhitePieces.length > 0 && this.mWhitePieces[0].fenCode === 'K') {
              this.mViolations.push(Position.NOTES.TOO_MANY_WHITE_KINGS)
            }
            this.mWhitePieces.unshift(piece)
          } else {
            this.mWhitePieces.push(piece)
          }
        } else {
          if (piece.fenCode === 'k') {
            if (this.mBlackPieces.length > 0 && this.mBlackPieces[0].fenCode === 'k') {
              this.mViolations.push(Position.NOTES.TOO_MANY_BLACK_KINGS)
            }
            this.mBlackPieces.unshift(piece)
          } else {
            this.mBlackPieces.push(piece)
          }
        }
        if (/p/i.test(piece.fenCode)) {
          if (curRow === 0) this.mViolations.push(Position.NOTES.PAWN_ON_LAST_RANK)
          if (curRow === 7) this.mViolations.push(Position.NOTES.PAWN_ON_FIRST_RANK)
        }

        this.position[curRow][curCol] = piece
        curCol++
      }
      if (curCol === 8) {
          curCol = 0
          curRow++
      }
    }

    if (this.mWhitePieces.length === 0 || this.mWhitePieces[0].fenCode !== 'K') {
      this.mViolations.push(Position.NOTES.MISSING_WHITE_KING)
    }
    if (this.mBlackPieces.length === 0 || this.mBlackPieces[0].fenCode !== 'k') {
      this.mViolations.push(Position.NOTES.MISSING_BLACK_KING)
    }
    if (this.mWhitePieces.length > 16) {
      this.mViolations.push(Position.NOTES.TOO_MANY_WHITE_PIECES)
    }
    if (this.mBlackPieces.length > 16) {
      this.mViolations.push(Position.NOTES.TOO_MANY_BLACK_PIECES)
    }
    const parts = fen.slice(k).trim().split(' ')
    const castlingAbility = parts[1]
    const enpassantTarget = parts[2]

    if (parts.length > 0) {
        this.mWhitesToMove = (parts[0] === 'w')
    } else this.mWhitesToMove = true

    if (parts.length > 1) {
      this.mWhiteCastlingLongEnabled = parts[1].includes('Q')
      this.mWhiteCastlingShortEnabled = parts[1].includes('K')
      this.mBlackCastlingLongEnabled = parts[1].includes('q')
      this.mBlackCastlingShortEnabled = parts[1].includes('k')
    }

    if (parts.length > 2) {
      if (parts[2][0] === '-') {
        this.mCaptureEnpassantTarget = -1
      } else {
         this.mCaptureEnpassantTarget = parts[2].toLowerCase().charCodeAt(0) - 97
      }
    }
  }
}
