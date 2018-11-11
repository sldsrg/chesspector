import { MoveData, MoveFlags } from './movedata'
import { Position } from './position'
import { IAction, ActionType } from './action'

import { Subject, Observable } from 'rxjs'

export class Inspector {
  public actions: Observable<IAction>
  private _actionsSubject: Subject<IAction>

  constructor(public position: Position) {
    this._actionsSubject = new Subject<IAction>()
    this.actions = this._actionsSubject.asObservable()
  }

  /**
   * @readonly
   * current position
   * @returns string with FEN represetation
   */
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
   * Make passed move: modify position, change turn to move and send related actions
   * @param md necessary data to make move
   */
  public makeMove(md: MoveData): void {
    if (md.flags === MoveFlags.Quiet || md.flags === MoveFlags.Capture) {
      this.position.movePiece(md.from, md.to)
    }

    for (const action of md.actions) {
      this._actionsSubject.next(action)
    }
    this.position.nextTurnToMove()
  }

  /**
   * Unmake passed move: modify position, change turn to move and send related actions
   * @param md necessary data to make move
   */
  public unmakeMove(md: MoveData): void {
    if (md.flags === MoveFlags.Quiet || md.flags === MoveFlags.Capture) {
      this.position.movePiece(md.to, md.from)
    }

    for (const action of md.actions.reverse()) {
      switch (action.type) {
      case ActionType.Insert:
        break
      case ActionType.Move:
        this._actionsSubject.next({
          type: ActionType.Move,
          from: action.to,
          to: action.from
        })
        break
      case ActionType.Delete:
        break
      }
    }
    this.position.nextTurnToMove()
  }
}
