import Piece from '../app/pieces/piece';
import Position from '../app/position';

describe("Piece", function() {
  it("constructed with code in upper case must be white piece", function() {
    let pce = new Piece('P');
    expect(pce.isWhite()).toBe(true);
  }); 
  it("constructed with code in lower case must be black piece", function() {
    let pce = new Piece('p');
    expect(pce.isWhite()).toBe(false);
  });
});

describe("Chessboard position", function() {
  it("must be invalid if white king missed", function() {
    let pos = new Position("4k3/8/8/8/8/8/8/8 w - -");
    expect(pos.isValid()).toBeFalsy();
    expect(pos.violations()).toContain(Position.NOTES[Position.MISSING_WHITE_KING]);
  });
});