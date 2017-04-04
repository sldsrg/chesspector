import MoveRecord from "../app/moverecord"
import Position from "../app/position"

describe(`MoveRecord`, () => {
    describe(`when evaluated in positional context`, () => {
        let position: Position;

        beforeAll(() => {
            position = new Position(Position.INITIAL);
        });

    it(`return valid MoveData object`, () => {
        let rec = new MoveRecord(1, "e2-e4");
        let data = rec.eval(position);
        expect(data).not.toBeNull();
    });
    // it(`pawn's quiet move format back to same representation`, () => {
    // it(`knight's quiet move format back to same representation`, () => {
    //   expect(MoveRecord.fromLAN("Ng1-f3", 1).LAN).toBe("Ng1-f3");
    // });
    });
});