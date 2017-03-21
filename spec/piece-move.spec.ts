import Piece from '../app/pieces/piece';
import Position from '../app/position';
import Inspector from '../app/inspector';

describe("White pawn on board with FEN: 6k1/3pp3/8/4Pp2/5Pp1/5P1p/3P2PP/3K4 w - f", function() {
  let pos: Position;
  let inspector: Inspector;

  beforeAll(function () {
    pos = new Position("6k1/3pp3/8/4Pp2/5Pp1/5P1p/3P2PP/3K4 w - f");
    inspector = new Inspector(pos);
  });

  it("can move from d2 to d3", function() {
    expect(inspector.getMove("d2", "d3")).not.toBeNull();
  });

  it("can move from d2 to d4", function() {
    expect(inspector.getMove("d2", "d4")).not.toBeNull();
  });

  it("can capture piece on g4", function() {
    expect(inspector.getMove("f3", "g4")).not.toBeNull();
  });

  it("can capture en-passant pawn on f5", function() {
    expect(inspector.getMove("e5", "f6")).not.toBeNull();
  });

  it("can't move from d2 to c3", function() {
    expect(inspector.getMove("d2", "c3")).toBeNull();
  });

  it("can't move over obstacle", function() {
    expect(inspector.getMove("h2", "h4")).toBeNull();
  });


    // Assert.Null(inspector.GetMove(f4, f5), "Illegal pawn capture");
    // Assert.Null(inspector.GetMove(f4, e5), "Illegal pawn capture");
    // Assert.Null(inspector.GetMove(f3, f2), "Illegal pawn move");

});