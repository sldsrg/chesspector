import Position from '../app/position';
import Inspector from '../app/inspector';
import { MoveFlags } from "../app/pieces/piece";

describe("The pawn has five legal moves:", 
  function() {

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
            
        it("Try to move backward fail.", function() {
          expect(whitesInspector.getMove("d5", "d4")).toBeNull();
          expect(blacksInspector.getMove("g4", "g5")).toBeNull();
        });

        it("Try to move on occuped square fail.", function() {
          expect(whitesInspector.getMove("f4", "f5")).toBeNull();
          expect(blacksInspector.getMove("e7", "e6")).toBeNull();
        });
    });

    describe(
      `b) On its first move each pawn may advance two squares along the same file 
      provided both squares are unoccupied.`,
      function() {
        it("Inspector return valid data.", function() {
          let moveData = whitesInspector.getMove("d2", "d4");
          expect(moveData).not.toBeNull();
          expect(moveData.flags).toBe(MoveFlags.Quiet);
          moveData = blacksInspector.getMove("d7", "d5");
          expect(moveData).not.toBeNull();
          expect(moveData.flags).toBe(MoveFlags.Quiet);
        });

        it("Try to move over obstacle fail.", function() {
          expect(whitesInspector.getMove("h2", "h4")).toBeNull();
          expect(blacksInspector.getMove("e7", "e5")).toBeNull();
        });
        
        it("Try to move on occuped square fail.", function() {
          expect(whitesInspector.getMove("g2", "g4")).toBeNull();
          expect(blacksInspector.getMove("c7", "c5")).toBeNull();
        });
    });

    describe(
      `c) Capture: the pawn moves to a square occupied by an opponent’s
      piece which is diagonally in front of it on an adjacent file, capturing that piece.`,
      function() {
        it("Inspector return valid data.", function() {
          let moveData = whitesInspector.getMove("f3", "g4");
          expect(moveData).not.toBeNull();
          expect(moveData.flags).toBe(MoveFlags.Capture);
          expect(moveData.capturedPiece).not.toBeNull;

          moveData = blacksInspector.getMove("d7", "e6");
          expect(moveData).not.toBeNull();
          expect(moveData.flags).toBe(MoveFlags.Capture);
          expect(moveData.capturedPiece).not.toBeNull;
        });

        it("Try to capture own piece fail.", function() {
          expect(whitesInspector.getMove("g2", "f3")).toBeNull();
          expect(blacksInspector.getMove("e7", "f6")).toBeNull();
        });

        it("Try to move like capture on empty square fail.", function() {
          expect(whitesInspector.getMove("d2", "c3")).toBeNull();
          expect(blacksInspector.getMove("g4", "h3")).toBeNull();
        });
    });

    describe(
      `d) Capture en-passant: a pawn attacking a square crossed by an opponent’s pawn
      which has advanced two squares in one move from its original square
      may capture this opponent’s pawn as though the latter had been
      moved only one square. This capture can be made only on the move
      following this advance.`,
      function() {
        it("Inspector return valid data.", function() {
          let moveData = whitesInspector.getMove("e5", "f6");
          expect(moveData).not.toBeNull();
          expect(moveData.flags).toBe(MoveFlags.CaptureEnPassant);
          expect(moveData.capturedPiece).not.toBeNull;

          moveData = blacksInspector.getMove("g4", "f3");
          expect(moveData).not.toBeNull();
          expect(moveData.flags).toBe(MoveFlags.CaptureEnPassant);
          expect(moveData.capturedPiece).not.toBeNull;
        });
    });  
    // TODO: check en-passant flag toggle

    describe(
      `e) Promotion: when a pawn reaches the rank furthest from its starting position
      it must be exchanged as part of the same move for a queen,
      rook, bishop or knight of the same color.`,
      function() {

    });
});

describe(`The king can move in two different ways, by:`,
  function() {
    describe(`a) moving to any adjoining square.`, function() {
        let inspector: Inspector;

        beforeAll(function(){
            inspector = new Inspector(new Position("4k3/8/8/8/8/8/4n3/4K3"));
        });

        it("Inspector return valid data for valid move.", function() {
            let moveData = inspector.getMove("e1", "d2");
            expect(moveData).not.toBeNull();
            expect(moveData.flags).toBe(MoveFlags.Quiet);

            moveData = inspector.getMove("e1", "e2");
            expect(moveData).not.toBeNull();
            expect(moveData.flags).toBe(MoveFlags.Capture);
        });

        it("Invalid move fail.", function() {
            expect(inspector.getMove("e1", "a1")).toBeNull();
        });
    });
    describe(`b) castling.`, function() {
        let inspectorWhites;
        let inspectorBlacks;

        beforeAll(function(){
            inspectorWhites = new Inspector(new Position("r3k2r/8/8/8/8/8/8/R3K2R w QKqk -"));
            inspectorBlacks = new Inspector(new Position("r3k2r/8/8/8/8/8/8/R3K2R b QKqk -"));
        });

        it("Inspector return valid data for short castrling.", function() {
            let moveData = inspectorWhites.getMove("e1", "g1");
            expect(moveData).not.toBeNull();
            expect(moveData.flags).toBe(MoveFlags.CastlingShort);

            moveData = inspectorBlacks.getMove("e8", "g8");
            expect(moveData).not.toBeNull();
            expect(moveData.flags).toBe(MoveFlags.CastlingShort);
        });

        it("Inspector return valid data for long castrling.", function() {
            let moveData = inspectorWhites.getMove("e1", "c1");
            expect(moveData).not.toBeNull();
            expect(moveData.flags).toBe(MoveFlags.CastlingLong);
            
            moveData = inspectorBlacks.getMove("e8", "c8");
            expect(moveData).not.toBeNull();
            expect(moveData.flags).toBe(MoveFlags.CastlingLong);
        });

        it("Fails if castling not alowed", function() {
            inspectorWhites = new Inspector(new Position("r3k2r/8/8/8/8/8/8/R3K2R w - -"));
            inspectorBlacks = new Inspector(new Position("r3k2r/8/8/8/8/8/8/R3K2R b - -"));
  
        });
    });
});

describe(`The queen moves to any square along the file, the rank
  or a diagonal on which it stands. When making these moves the queen cannot
  move over any intervening pieces.`, 
  function() {

    let inspector: Inspector;

    beforeAll(function(){
      inspector = new Inspector(new Position("4k3/8/8/5b2/8/3Q4/2P5/4K3 w - -"));
    });

    it("Inspector return valid data for valid move.", function() {
      let moveData = inspector.getMove("d3", "d5");
      expect(moveData).not.toBeNull();
      expect(moveData.flags).toBe(MoveFlags.Quiet);

      moveData = inspector.getMove("d3", "c4");
      expect(moveData).not.toBeNull();
      expect(moveData.flags).toBe(MoveFlags.Quiet);

      moveData = inspector.getMove("d3", "f5");
      expect(moveData).not.toBeNull();
      expect(moveData.flags).toBe(MoveFlags.Capture);
    });

    it("Move not diagonal, vertical or horizontal fail.", function() {
      expect(inspector.getMove("d3", "c6")).toBeNull();
    });

    it("Move over any intervening pieces fail.", function() {
      expect(inspector.getMove("d3", "b1")).toBeNull();
    });

    it("Capture own pieces fail.", function() {
      expect(inspector.getMove("d3", "c2")).toBeNull();
    });   
});

describe(`The rook moves to any square along the file or the rank
  on which it stands. When making these moves the rook cannot
  move over any intervening pieces.`, 
  function() {

    let inspector: Inspector;

    beforeAll(function(){
      inspector = new Inspector(new Position("4k2r/8/8/8/8/8/p7/R3K3 w - -"));
    });

    it("Inspector return valid data for valid move.", function() {
      let moveData = inspector.getMove("a1", "c1");
      expect(moveData).not.toBeNull();
      expect(moveData.flags).toBe(MoveFlags.Quiet);

      moveData = inspector.getMove("a1", "a2");
      expect(moveData).not.toBeNull();
      expect(moveData.flags).toBe(MoveFlags.Capture);
    });

    it("Move not vertical or horizontal fail.", function() {
      expect(inspector.getMove("a1", "c3")).toBeNull();
    });

    it("Move over any intervening pieces fail.", function() {
      expect(inspector.getMove("a1", "a8")).toBeNull();
    });

    it("Capture own pieces fail.", function() {
      expect(inspector.getMove("a1", "e1")).toBeNull();
    });   
});

describe(`The bishop moves to any square along a diagonal on which it stands. 
  When making these moves the bishop cannot move over any intervening pieces.`, 
  function() {

    let inspector: Inspector;

    beforeAll(function(){
      inspector = new Inspector(new Position("4k3/8/8/5b2/8/3B4/2P5/4K3 w - -"));
    });

    it("Inspector return valid data for valid move.", function() {
      let moveData = inspector.getMove("d3", "a6");
      expect(moveData).not.toBeNull();
      expect(moveData.flags).toBe(MoveFlags.Quiet); 

      moveData = inspector.getMove("d3", "f5");
      expect(moveData).not.toBeNull();
      expect(moveData.flags).toBe(MoveFlags.Capture);    
    });

    it("Move not diagonal fail.", function() {
      expect(inspector.getMove("d3", "d6")).toBeNull();
    });

    it("Move over any intervening pieces fail.", function() {
      expect(inspector.getMove("d3", "h7")).toBeNull();
    });

    it("Capture own pieces fail.", function() {
      expect(inspector.getMove("d3", "c2")).toBeNull();
    }); 
});

describe(`The knight moves to one of the squares nearest to that on
  which it stands but not on the same rank, file or diagonal.`, 
  function() {

    let inspector: Inspector;

    beforeAll(function(){
      inspector = new Inspector(new Position("3k4/8/8/8/2P1p3/8/3N4/3K4 w - -"));
    });

    it("Inspector return valid data for valid move.", function() {
      let moveData = inspector.getMove("d2", "f3");
      expect(moveData).not.toBeNull();
      expect(moveData.flags).toBe(MoveFlags.Quiet); 

      moveData = inspector.getMove("d2", "e4");
      expect(moveData).not.toBeNull();
      expect(moveData.flags).toBe(MoveFlags.Capture);    
    });

    it("Incorrect move fail.", function() {
      expect(inspector.getMove("d2", "d4")).toBeNull();
    }); 

    it("Capture own pieces fail.", function() {
      expect(inspector.getMove("d2", "c4")).toBeNull();
    }); 
});