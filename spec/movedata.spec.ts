import Inspector from "../app/inspector"
import { MoveData, MoveFlags } from "../app/pieces/movedata"
import Position from "../app/position"

describe("The pawn has five legal moves:", () => {

  let whitesInspector: Inspector
  let blacksInspector: Inspector

  beforeAll(() => {
    whitesInspector = new Inspector(new Position("6k1/3pp3/8/4Pp2/5Pp1/5P1p/3P2PP/3K4 w - f"))
    blacksInspector = new Inspector(new Position("8/2ppp3/4Pp2/2P5/R4Ppk/8/8/3K4 b - f"))
  })

  describe(
    `a) The pawn moves forward to the unoccupied square
      immediately in front of it on the same file.`, () => {
      it("Inspector return valid data.", () => {
        let moveData = whitesInspector.getMove("d2", "d3")
        expect(moveData).not.toBeNull()
        expect(moveData.flags).toBe(MoveFlags.Quiet)
        moveData = blacksInspector.getMove("d7", "d6")
        expect(moveData).not.toBeNull()
        expect(moveData.flags).toBe(MoveFlags.Quiet)
      })

      it("Try to move backward fail.", () => {
        expect(whitesInspector.getMove("d5", "d4")).toBeNull()
        expect(blacksInspector.getMove("g4", "g5")).toBeNull()
      })

      it("Try to move on occuped square fail.", () => {
        expect(whitesInspector.getMove("f4", "f5")).toBeNull()
        expect(blacksInspector.getMove("e7", "e6")).toBeNull()
      })
    })

  describe(
    `b) On its first move each pawn may advance two squares along the same file
      provided both squares are unoccupied.`, () => {
      it("Inspector return valid data.", () => {
        let moveData = whitesInspector.getMove("d2", "d4")
        expect(moveData).not.toBeNull()
        expect(moveData.flags).toBe(MoveFlags.Quiet)
        moveData = blacksInspector.getMove("d7", "d5")
        expect(moveData).not.toBeNull()
        expect(moveData.flags).toBe(MoveFlags.Quiet)
      })

      it("Try to move over obstacle fail.", () => {
        expect(whitesInspector.getMove("h2", "h4")).toBeNull()
        expect(blacksInspector.getMove("e7", "e5")).toBeNull()
      })

      it("Try to move on occuped square fail.", () => {
        expect(whitesInspector.getMove("g2", "g4")).toBeNull()
        expect(blacksInspector.getMove("c7", "c5")).toBeNull()
      })
    })

  describe(
    `c) Capture: the pawn moves to a square occupied by an opponent’s
      piece which is diagonally in front of it on an adjacent file, capturing that piece.`, () => {
      it("Inspector return valid data.", () => {
        let moveData = whitesInspector.getMove("f3", "g4")
        expect(moveData).not.toBeNull()
        expect(moveData.flags).toBe(MoveFlags.Capture)
        expect(moveData.capturedPiece).not.toBeNull()

        moveData = blacksInspector.getMove("d7", "e6")
        expect(moveData).not.toBeNull()
        expect(moveData.flags).toBe(MoveFlags.Capture)
        expect(moveData.capturedPiece).not.toBeNull()
      })

      it("Try to capture own piece fail.", () => {
        expect(whitesInspector.getMove("g2", "f3")).toBeNull()
        expect(blacksInspector.getMove("e7", "f6")).toBeNull()
      })

      it("Try to move like capture on empty square fail.", () => {
        expect(whitesInspector.getMove("d2", "c3")).toBeNull()
        expect(blacksInspector.getMove("g4", "h3")).toBeNull()
      })
    })

  describe(
    `d) Capture en-passant: a pawn attacking a square crossed by an opponent’s pawn
      which has advanced two squares in one move from its original square
      may capture this opponent’s pawn as though the latter had been
      moved only one square. This capture can be made only on the move
      following this advance.`, () => {
      it("Inspector return valid data.", () => {
        let moveData = whitesInspector.getMove("e5", "f6")
        expect(moveData).not.toBeNull()
        expect(moveData.flags).toBe(MoveFlags.CaptureEnPassant)
        expect(moveData.capturedPiece).not.toBeNull()

        moveData = blacksInspector.getMove("g4", "f3")
        expect(moveData).not.toBeNull()
        expect(moveData.flags).toBe(MoveFlags.CaptureEnPassant)
        expect(moveData.capturedPiece).not.toBeNull()
      })
    })
  // TODO: check en-passant flag toggle

  describe(
    `e) Promotion: when a pawn reaches the rank furthest from its starting position
      it must be exchanged as part of the same move for a queen,
      rook, bishop or knight of the same color.`, () => {

    })
})

describe(`The king can move in two different ways, by:`, () => {
  describe(`a) moving to any adjoining square.`, () => {
    let inspector: Inspector

    beforeAll(() => {
      inspector = new Inspector(new Position("4k3/8/8/8/8/8/4n3/4K3"))
    })

    it("Inspector return valid data for valid move.", () => {
      let moveData = inspector.getMove("e1", "d2")
      expect(moveData).not.toBeNull()
      expect(moveData.flags).toBe(MoveFlags.Quiet)

      moveData = inspector.getMove("e1", "e2")
      expect(moveData).not.toBeNull()
      expect(moveData.flags).toBe(MoveFlags.Capture)
    })

    it("Invalid move fail.", () => {
      expect(inspector.getMove("e1", "a1")).toBeNull()
    })
  })
  describe(`b) castling.`, () => {
    it("Inspector return valid data on white king castrling.", () => {
      const inspector = new Inspector(new Position("r3k2r/8/8/8/8/8/8/R3K2R w QK -"))
      let moveData = inspector.getMove("e1", "g1")
      expect(moveData).not.toBeNull()
      expect(moveData.flags).toBe(MoveFlags.CastlingShort)

      moveData = inspector.getMove("e1", "c1")
      expect(moveData).not.toBeNull()
      expect(moveData.flags).toBe(MoveFlags.CastlingLong)
    })

    it("Inspector return valid data on black king castrling.", () => {
      const inspector = new Inspector(new Position("r3k2r/8/8/8/8/8/8/R3K2R b qk -"))
      let moveData = inspector.getMove("e8", "g8")
      expect(moveData).not.toBeNull()
      expect(moveData.flags).toBe(MoveFlags.CastlingShort)

      moveData = inspector.getMove("e8", "c8")
      expect(moveData).not.toBeNull()
      expect(moveData.flags).toBe(MoveFlags.CastlingLong)
    })

    it("Fails if castling not alowed", () => {
      let inspector = new Inspector(new Position("r3k2r/8/8/8/8/8/8/R3K2R w - -"))
      expect(inspector.getMove("e1", "c1")).toBeNull()
      expect(inspector.getMove("e1", "g1")).toBeNull()

      inspector = new Inspector(new Position("r3k2r/8/8/8/8/8/8/R3K2R b - -"))
      expect(inspector.getMove("e8", "c8")).toBeNull()
      expect(inspector.getMove("e8", "g8")).toBeNull()
    })

    it("Fails if obstacle present between rook and king", () => {
      let inspector = new Inspector(new Position("4k3/8/8/8/8/8/8/RN2KB1R w KQ -"))
      expect(inspector.getMove("e1", "c1")).toBeNull()
      expect(inspector.getMove("e1", "g1")).toBeNull()

      inspector = new Inspector(new Position("rn2kb1r/8/8/8/8/8/8/4K3 b qk -"))
      expect(inspector.getMove("e8", "c8")).toBeNull()
      expect(inspector.getMove("e8", "g8")).toBeNull()
    })
  })
})

describe(`The queen moves to any square along the file, the rank
  or a diagonal on which it stands. When making these moves the queen cannot
  move over any intervening pieces.`, () => {

    let inspector: Inspector

    beforeAll(() => {
      inspector = new Inspector(new Position("4k3/8/8/5b2/8/3Q4/2P5/4K3 w - -"))
    })

    it("Inspector return valid data for valid move.", () => {
      let moveData = inspector.getMove("d3", "d5")
      expect(moveData).not.toBeNull()
      expect(moveData.flags).toBe(MoveFlags.Quiet)

      moveData = inspector.getMove("d3", "c4")
      expect(moveData).not.toBeNull()
      expect(moveData.flags).toBe(MoveFlags.Quiet)

      moveData = inspector.getMove("d3", "f5")
      expect(moveData).not.toBeNull()
      expect(moveData.flags).toBe(MoveFlags.Capture)
    })

    it("Move not diagonal, vertical or horizontal fail.", () => {
      expect(inspector.getMove("d3", "c6")).toBeNull()
    })

    it("Move over any intervening pieces fail.", () => {
      expect(inspector.getMove("d3", "b1")).toBeNull()
    })

    it("Capture own pieces fail.", () => {
      expect(inspector.getMove("d3", "c2")).toBeNull()
    })
  })

describe(`The rook moves to any square along the file or the rank
  on which it stands. When making these moves the rook cannot
  move over any intervening pieces.`, () => {

    let inspector: Inspector

    beforeAll(() => {
      inspector = new Inspector(new Position("4k2r/8/8/8/8/8/p7/R3K3 w - -"))
    })

    it("Inspector return valid data for valid move.", () => {
      let moveData = inspector.getMove("a1", "c1")
      expect(moveData).not.toBeNull()
      expect(moveData.flags).toBe(MoveFlags.Quiet)

      moveData = inspector.getMove("a1", "a2")
      expect(moveData).not.toBeNull()
      expect(moveData.flags).toBe(MoveFlags.Capture)
    })

    it("Move not vertical or horizontal fail.", () => {
      expect(inspector.getMove("a1", "c3")).toBeNull()
    })

    it("Move over any intervening pieces fail.", () => {
      expect(inspector.getMove("a1", "a8")).toBeNull()
    })

    it("Capture own pieces fail.", () => {
      expect(inspector.getMove("a1", "e1")).toBeNull()
    })
  })

describe(`The bishop moves to any square along a diagonal on which it stands.
  When making these moves the bishop cannot move over any intervening pieces.`, () => {

    let inspector: Inspector

    beforeAll(() => {
      inspector = new Inspector(new Position("4k3/8/8/5b2/8/3B4/2P5/4K3 w - -"))
    })

    it("Inspector return valid data for valid move.", () => {
      let moveData = inspector.getMove("d3", "a6")
      expect(moveData).not.toBeNull()
      expect(moveData.flags).toBe(MoveFlags.Quiet)

      moveData = inspector.getMove("d3", "f5")
      expect(moveData).not.toBeNull()
      expect(moveData.flags).toBe(MoveFlags.Capture)
    })

    it("Move not diagonal fail.", () => {
      expect(inspector.getMove("d3", "d6")).toBeNull()
    })

    it("Move over any intervening pieces fail.", () => {
      expect(inspector.getMove("d3", "h7")).toBeNull()
    })

    it("Capture own pieces fail.", () => {
      expect(inspector.getMove("d3", "c2")).toBeNull()
    })
  })

describe(`The knight moves to one of the squares nearest to that on
  which it stands but not on the same rank, file or diagonal.`, () => {

    let inspector: Inspector

    beforeAll(() => {
      inspector = new Inspector(new Position("3k4/8/8/8/2P1p3/8/3N4/3K4 w - -"))
    })

    it("Inspector return valid data for valid move.", () => {
      let moveData = inspector.getMove("d2", "f3")
      expect(moveData).not.toBeNull()
      expect(moveData.flags).toBe(MoveFlags.Quiet)

      moveData = inspector.getMove("d2", "e4")
      expect(moveData).not.toBeNull()
      expect(moveData.flags).toBe(MoveFlags.Capture)
    })

    it("Incorrect move fail.", () => {
      expect(inspector.getMove("d2", "d4")).toBeNull()
    })

    it("Capture own pieces fail.", () => {
      expect(inspector.getMove("d2", "c4")).toBeNull()
    })
  })
