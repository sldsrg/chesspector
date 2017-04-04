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

  describe(`when created with three whites move 
    and two blacks move`, () => {
      let movekeeper: Movekeeper;
      
      beforeAll(()=> {
        movekeeper = new Movekeeper("1.e2-e4 e7-e5 2.Ng1-f3 Nb8-c6 3.Bf1-c4");
      });

      it(`is not empty`, () => {
        expect(movekeeper.hasMoves).toBe(true);
      });

      it(`length property evaluates to correct value`, () => {
        expect(movekeeper.length).toBe(5);
      });
    });

    describe(`can parse records with comment`, () => {
      let movekeeper: Movekeeper;
      
      beforeAll(()=> {
        movekeeper = new Movekeeper("1.e2-e4 e7-e5 {simple comment} 2.Ng1-f3 Nb8-c6 3.Bf1-c4");
      });

      it(`and length property evaluates to correct value`, () => {
        expect(movekeeper.length).toBe(5);
      });
    });
  });