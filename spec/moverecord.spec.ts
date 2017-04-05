import MoveRecord from "../app/moverecord"
import Position from "../app/position"
import { MoveFlags } from "../app/pieces/movedata";

describe(`MoveRecord`, () => {
    describe(`when constructed with LAN`, () => {
        let recPawn: MoveRecord;
        let recKnight: MoveRecord;

        beforeAll(() => {
            recPawn = new MoveRecord(1, "e2-e4");
            recKnight = new MoveRecord(1, "Ng1-f3");
        });

        describe(`and evaluated in positional context`, () => {
            let position: Position;

            beforeAll(() => {
                position = new Position(Position.INITIAL);
            });

            it(`return valid MoveData object for pawn move`, () => {
                let data = recPawn.eval(position);
                expect(data).not.toBeNull();
                expect(data.flags).toBe(MoveFlags.Quiet);
                expect(data.fromRow).toBe(6);
                expect(data.toRow).toBe(4);
                expect(data.fromColumn).toBe(4);
                expect(data.toColumn).toBe(4);
                expect(data.capturedPiece).toBeNull();
            });

            it(`return valid MoveData object for knight move`, () => {
                let data = recKnight.eval(position);
                expect(data).not.toBeNull();
                expect(data.flags).toBe(MoveFlags.Quiet);
                expect(data.fromRow).toBe(7);
                expect(data.toRow).toBe(5);
                expect(data.fromColumn).toBe(6);
                expect(data.toColumn).toBe(5);
                expect(data.capturedPiece).toBeNull();
            });
        });
    });

    describe(`when constructed with SAN`, () => {
        let recPawn: MoveRecord;
        let recKnight: MoveRecord;

        beforeAll(() => {
            recPawn = new MoveRecord(1, "e4");
            recKnight = new MoveRecord(1, "Nf3");
        });

        describe(`and evaluated in positional context`, () => {
            let position: Position;

            beforeAll(() => {
                position = new Position(Position.INITIAL);
            });

            it(`return valid MoveData object for pawn move`, () => {
                let data = recPawn.eval(position);
                expect(data).not.toBeNull();
                expect(data.flags).toBe(MoveFlags.Quiet);
                expect(data.fromRow).toBe(6);
                expect(data.toRow).toBe(4);
                expect(data.fromColumn).toBe(4);
                expect(data.toColumn).toBe(4);
                expect(data.capturedPiece).toBeNull();
            });

            it(`return valid MoveData object for knight move`, () => {
                let data = recKnight.eval(position);
                expect(data).not.toBeNull();
                expect(data.flags).toBe(MoveFlags.Quiet);
                expect(data.fromRow).toBe(7);
                expect(data.toRow).toBe(5);
                expect(data.fromColumn).toBe(6);
                expect(data.toColumn).toBe(5);
                expect(data.capturedPiece).toBeNull();
            });
        });
    });
});