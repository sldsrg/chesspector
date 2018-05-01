import { MoveData } from './movedata'
import { MoveParser } from './moveparser'
import { MoveRecord } from './moverecord'

export class Movekeeper {
  private __firstMove: MoveRecord | undefined

  constructor(lan?: string) {
    if (lan) {
      const parser = new MoveParser(lan)
      this.__firstMove = parser.parse()
    }
  }

  get hasMoves(): boolean {
    return this.__firstMove !== undefined
  }

  get first(): MoveRecord {
    if (!this.hasMoves) throw 'Failed to get first record on empty list'
    return this.__firstMove!
  }

  public add(move: MoveRecord) {
    if (this.hasMoves) {
      let scan = this.first
      while (scan.next) {
        scan = scan.next
      }
      scan.next = move
    } else {
      this.__firstMove = move
    }
  }

  public remove(move: MoveRecord) {
    if (this.hasMoves) {
      if (this.__firstMove === move) {
        delete this.__firstMove
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
