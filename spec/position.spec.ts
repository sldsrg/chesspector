import Piece from '../app/pieces/piece';
import Position from '../app/position';

describe("Piece", function() {
  it("constructed with code in upper case must be white piece", function() {
    let pce = new Piece('P');
    expect(pce.isWhite).toBe(true);
  }); 
  it("constructed with code in lower case must be black piece", function() {
    let pce = new Piece('p');
    expect(pce.isWhite).toBe(false);
  });
});

describe("Chessboard position", function() {
  it("must be invalid if white king missed", function() {
    let pos = new Position("4k3/8/8/8/8/8/8/8 w - -");
    expect(pos.isValid()).toBeFalsy();
    expect(pos.violations).toContain(Position.NOTES.MISSING_WHITE_KING);
  });

  it("must be invalid if black king missed", function() {
    let pos = new Position("8/8/8/8/8/8/8/4K3 w - -");
    expect(pos.isValid()).toBeFalsy();
    expect(pos.violations).toContain(Position.NOTES.MISSING_BLACK_KING);
  });

  it("must be invalid with many white kings", function() {
    let pos = new Position("4k3/8/8/8/8/8/8/3KK3 w - -");
    expect(pos.isValid()).toBeFalsy();
    expect(pos.violations).toContain(Position.NOTES.TOO_MANY_WHITE_KINGS);
  });

  it("must be invalid with many black kings", function() {
    let pos = new Position("3kk3/8/8/8/8/8/8/4K3 w - -");
    expect(pos.isValid()).toBeFalsy();
    expect(pos.violations).toContain(Position.NOTES.TOO_MANY_BLACK_KINGS);
  });

  it("must be invalid if white pieces count greater then 16", function() {
    let pos = new Position("4k3/8/8/8/8/7P/PPPPPPPP/RNBQKBNR w - -");
    expect(pos.isValid()).toBeFalsy();
    expect(pos.violations).toContain(Position.NOTES.TOO_MANY_WHITE_PIECES);
  });

  it("must be invalid if black pieces count greater then 16", function() {
    let pos = new Position("rnbqkbnr/pppppppp/n7/8/8/8/8/4K3 w - -");
    expect(pos.isValid()).toBeFalsy();
    expect(pos.violations).toContain(Position.NOTES.TOO_MANY_BLACK_PIECES);
  });

  it("detect 'blacks to move' flag", function() {
    let pos = new Position("r3k2r/8/8/8/8/8/8/R3K2R b QKqk -");
    expect(pos.whitesToMove).toBeFalsy();
  });

  it("detect 'white king castling enabled' flags", function() {
    let pos = new Position("r3k2r/8/8/8/8/8/8/R3K2R w QK -");
    expect(pos.whiteCastlingLongEnabled).toBeTruthy();
    expect(pos.whiteCastlingShortEnabled).toBeTruthy();
  });

  it("detect 'black king castling enabled' flags", function() {
    let pos = new Position("r3k2r/8/8/8/8/8/8/R3K2R w qk -");
    expect(pos.blackCastlingLongEnabled).toBeTruthy();
    expect(pos.blackCastlingShortEnabled).toBeTruthy();
 });

  it("detect 'all castlings disabled' flags", function() {
    let pos = new Position("r3k2r/8/8/8/8/8/8/R3K2R w - -");
    expect(pos.whiteCastlingLongEnabled).toBeFalsy();
    expect(pos.whiteCastlingShortEnabled).toBeFalsy();
    expect(pos.blackCastlingLongEnabled).toBeFalsy();
    expect(pos.blackCastlingShortEnabled).toBeFalsy();
  });

  it("detect capture en-passant target", function() {
    let pos = new Position("8/3pp3/4Pp2/8/R4Ppk/8/8/3K4 b - f");
    expect(pos.captureEnpassantTarget).toBe(5);

    pos = new Position("8/3pp3/4Pp2/8/R4Ppk/8/8/3K4 b - -");
    expect(pos.captureEnpassantTarget).toBe(-1);
  });
});

describe("Initial chessboard position", function() {
  it("must be valid", function() {
    let pos = new Position(Position.INITIAL);
    expect(pos.isValid()).toBeTruthy();
  });

  it("whites to move", function() {
    let pos = new Position(Position.INITIAL);
    expect(pos.whitesToMove).toBeTruthy();
  });
});