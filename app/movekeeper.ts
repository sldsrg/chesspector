import MoveParser from "./moveparser"
import MoveRecord from "./moverecord"
import { MoveData } from "./pieces/movedata"

export default class Movekeeper {
  private mFirstMove: MoveRecord

  constructor(lan: string = null) {
    if (lan === null) {
      this.mFirstMove = null
    } else {
      const parser = new MoveParser(lan)
      this.mFirstMove = parser.parse()
    }
  }

  get hasMoves(): boolean {
    return this.mFirstMove !== null
  }

  get first(): MoveRecord {
    return this.mFirstMove
  }

  public add(move: MoveRecord) {
    if (this.hasMoves) {
      let scan = this.mFirstMove
      while (scan.next) {
        scan = scan.next
      }
      scan.next = move
    } else {
      this.mFirstMove = move
    }
  }

  public remove(move: MoveRecord) {
    if (this.hasMoves) {
      if (this.mFirstMove === move) {
        this.mFirstMove = null
      } else {
        let scan = this.mFirstMove
        while (scan !== move) {
          scan = scan.next
        }
        scan = null
      }
    }
  }
}
