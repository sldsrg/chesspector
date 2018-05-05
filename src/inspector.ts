import { Piece } from './pieces/piece'
import { MoveData } from './movedata'
import { Position } from './position'
import { IAction, ActionType } from './action'

import {Observable, Observer, Subscriber} from 'rxjs'
import { Action } from 'rxjs/scheduler/Action';

export class Inspector {
  public actions: Observable<IAction>
  private _actionsObserver: Subscriber<IAction>

  constructor(private position: Position) {
    this.actions = new Observable(observer => this._actionsObserver = observer)
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
    return piece.getPseudoLegalMove(this.position, toRow, toCol)
  }

  /**
   * Do passed move: modify position, change turn to move and send related actions
   * @param md necessary data to make move 
   */
  public doMove(md: MoveData): void {
    for (const action of md.actions) {    
      switch (action.type) {
        case ActionType.Move:
          const {row, column} = action.from!
          const {row: toRow, column: toColumn} = action.to!
          const piece = this.position.at[row][column]
          piece.moveTo(this.position, toRow, toColumn)
          this._actionsObserver.next(action)
          this.position.nextTurnToMove()
          break
        default:
          throw new Error('Incorrect move action')
          
      }
    }
  }
}
