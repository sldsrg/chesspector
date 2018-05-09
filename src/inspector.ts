import { Piece } from './pieces/piece'
import { MoveData, MoveFlags } from './movedata'
import { Position } from './position'
import { IAction, ActionType } from './action'

import { Observable } from 'rxjs/Observable'
import { Observer} from 'rxjs/Observer'
import { Subscriber} from 'rxjs/Subscriber'

export class Inspector {
  public actions: Observable<IAction>
  private _actionsObserver: Subscriber<IAction>

  constructor(private position: Position) {
    this.actions = new Observable((observer: any) => this._actionsObserver = observer)
  }

  public get FEN(): string {
    return this.position.toString()
  }

  /**
   * Check if square not ocuped by any piece.
   * @param row zero-based index from top
   * @param column zero-based index from left
   */
  public isSquareBare(
    row: number,
    column: number
  ): boolean {
    return this.position.at[row][column] === undefined
  }

  /**
   * Check if square ocuped by piece with color to move.
   * Pinned state not considered.
   * @param row zero-based index from top
   * @param column zero-based index from left
   */
  public canMoveFrom(
    row: number,
    column: number
  ): boolean {
    return this.position.at[row][column].isWhite === this.position.whitesToMove
  }

  public getMove(sqFrom: string, sqTo: string): MoveData | undefined {
    const fromFile = sqFrom.charCodeAt(0) - 97
    const fromRank = sqFrom.charCodeAt(1) - 48
    const toFile = sqTo.charCodeAt(0) - 97
    const toRank = sqTo.charCodeAt(1) - 48
    const fromRow = 8 - fromRank
    const fromCol = fromFile
    const toRow = 8 - toRank
    const toCol = toFile
    const piece = this.position.at[fromRow][fromCol]
    if (!piece) throw new Error(`Piece not found at ${sqFrom}`)
    if (piece.isWhite !== this.position.whitesToMove) {
      const turn = this.position.whitesToMove ? 'whites' : 'blacks'
      throw new Error(`Try to move ${piece.isWhite ? 'white' : 'black'} piece on ${turn} turn`)
    }
    return piece.getPseudoLegalMove(this.position, toRow, toCol)
  }

  /**
   * Do passed move: modify position, change turn to move and send related actions
   * @param md necessary data to make move
   */
  public doMove(md: MoveData): void {
    if (md.flags === MoveFlags.Quiet || md.flags === MoveFlags.Capture) {
      this.position.movePiece(md.from, md.to)
    }

    for (const action of md.actions) {
      this._actionsObserver.next(action)
    }
    this.position.nextTurnToMove()
  }
}
