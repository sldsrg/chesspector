import MoveRecord from "../app/moverecord";

describe(`When parsed from LAN string`, () => {
  it(`pawn's quiet move format back to same representation`, () => {
    expect(MoveRecord.fromLAN("e2-e4", 1).LAN).toBe("e2-e4");
  });
  it(`knight's quiet move format back to same representation`, () => {
    expect(MoveRecord.fromLAN("Ng1-f3", 1).LAN).toBe("Ng1-f3");
  });
});