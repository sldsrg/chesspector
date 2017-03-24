import Position from '../app/position';
import Inspector from '../app/inspector';
import { MoveFlags } from "../app/pieces/piece";

describe("The pawn has five legal moves:", function() {

  let whitesInspector: Inspector; 
  let blacksInspector: Inspector;

  beforeAll(function () {
    whitesInspector = new Inspector(new Position("6k1/3pp3/8/4Pp2/5Pp1/5P1p/3P2PP/3K4 w - f"));
    blacksInspector = new Inspector(new Position("8/2ppp3/4Pp2/2P5/R4Ppk/8/8/3K4 b - f"));
  });

  describe(
    `a) The pawn moves forward to the unoccupied square 
    immediately in front of it on the same file.`, 
    function() {
      it("Inspector return valid data.", function() {
        let moveData = whitesInspector.getMove("d2", "d3");
        expect(moveData).not.toBeNull();
        expect(moveData.flags).toBe(MoveFlags.Quiet);
        moveData = blacksInspector.getMove("d7", "d6");
        expect(moveData).not.toBeNull();
        expect(moveData.flags).toBe(MoveFlags.Quiet);
      });
           
      it("Try to move pawn backward should to fail", function() {
        expect(whitesInspector.getMove("d5", "d4")).toBeNull();
        expect(blacksInspector.getMove("g4", "g5")).toBeNull();
      });

      it("Try to move on occuped square should to fail", function() {
        expect(whitesInspector.getMove("f4", "f5")).toBeNull();
        expect(blacksInspector.getMove("e7", "e6")).toBeNull();
      });

  });

  describe(
    `b) On its first move each pawn may advance two squares along the same file 
    provided both squares are unoccupied.`,
    function() {
      it("Inspector must return valid data.", function() {
        let moveData = whitesInspector.getMove("d2", "d4");
        expect(moveData).not.toBeNull();
        expect(moveData.flags).toBe(MoveFlags.Quiet);
        moveData = blacksInspector.getMove("d7", "d5");
        expect(moveData).not.toBeNull();
        expect(moveData.flags).toBe(MoveFlags.Quiet);
      });

      it("Try to move over obstacle should to fail", function() {
        expect(whitesInspector.getMove("h2", "h4")).toBeNull();
        expect(blacksInspector.getMove("e7", "e5")).toBeNull();
      });
      
      it("Try to move on occuped square should to fail", function() {
        expect(whitesInspector.getMove("g2", "g4")).toBeNull();
        expect(blacksInspector.getMove("c7", "c5")).toBeNull();
      });
  });

  describe(
    `c) Capture: the pawn moves to a square occupied by an opponent’s
    piece which is diagonally in front of it on an adjacent file, capturing that piece.`,
    function() {
      it("White pawn from f3 can capture piece on g4", function() {
        expect(whitesInspector.getMove("f3", "g4")).not.toBeNull();
      });

      it("Black pawn from d7 can capture piece on e6", function() {
        expect(blacksInspector.getMove("d7", "e6")).not.toBeNull();
      });

      it("White pawn from d2 can't move to c3 - empty square", function() {
        expect(whitesInspector.getMove("d2", "c3")).toBeNull();
      });
  });

  describe(
    `d) Capture en-passant: a pawn attacking a square crossed by an opponent’s pawn
    which has advanced two squares in one move from its original square
    may capture this opponent’s pawn as though the latter had been
    moved only one square. This capture can be made only on the move
    following this advance.`,
    function() {
      it("can capture en-passant pawn on f5", function() {
        expect(whitesInspector.getMove("e5", "f6")).not.toBeNull();
      });
  });

  describe(
    `e) Promotion: when a pawn reaches the rank furthest from its starting position
    it must be exchanged as part of the same move for a queen,
    rook, bishop or knight of the same color.`,
    function() {

  });













  // Assert.Null(inspector.GetMove(f4, f5), "Illegal pawn capture");
  // Assert.Null(inspector.GetMove(f4, e5), "Illegal pawn capture");
  // Assert.Null(inspector.GetMove(f3, f2), "Illegal pawn move");

  // TODO: check en-passant flag toggle
});