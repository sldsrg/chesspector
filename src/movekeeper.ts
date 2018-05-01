import { MoveData } from './movedata'
import { MoveParser } from './moveparser'
import { MoveRecord } from './moverecord'

export class Movekeeper {
  private _firstMove: MoveRecord | undefined

  constructor(lan?: string) {
    if (lan) {
      const parser = new MoveParser(lan)
      this._firstMove = parser.parse()
    }
  }

  get hasMoves(): boolean {
    return this._firstMove !== undefined
  }

  get first(): MoveRecord {
    if (!this.hasMoves) throw new Error('Failed to get first record on empty list')
    return this._firstMove!
  }

  public add(move: MoveRecord) {
    if (this.hasMoves) {
      let scan = this.first
      while (scan.next) {
        scan = scan.next
      }
      scan.next = move
    } else {
      this._firstMove = move
    }
  }

  public remove(move: MoveRecord) {
    if (this.hasMoves) {
      if (this._firstMove === move) {
        delete this._firstMove
      } else {
        let scan = this.first
        while (scan.next && scan.next !== move) {
          scan = scan.next
        }
        if (scan.next) delete scan.next
      }
    }
  }
}
