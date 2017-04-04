import Movekeeper from "../app/movekeeper";
import MoveRecord from "../app/moverecord";

describe(`Movekeeper`, function() {
  describe(`when created without parameters`, () => {
    let movekeeper: Movekeeper;

    beforeAll(()=> {
      movekeeper = new Movekeeper;
    });

    it(`contains empty move list`, () => {
      expect(movekeeper.hasMoves).toBe(false);
    });

    it(`and no more empty, when added new move`, () => {
      movekeeper.add(new MoveRecord(1, "e2-e4"));
      expect(movekeeper.hasMoves).toBe(true);
    });

    it(`then is empty again, when last move removed`, ()=> {
      movekeeper.remove(movekeeper.first);
      expect(movekeeper.hasMoves).toBe(false);
    });
  });
});