import {tetrisObjects} from "./TetrisObjects";


const levelPrologue = {
    name: "levelPrologue",
    rows : 1,
    columns : 1,
    tetrisPieces : [{
      ...tetrisObjects.singlePiece,
      location:
      {
        index: 0
      },
    }]
  }
  const level1 = {
    name: "level1",
    rows : 2,
    columns : 1,
    tetrisPieces : [{
      ...tetrisObjects.singlePiece,
      location:
      {
        index: 1
      },
    }]
  }
  
  const level2 = {
    name: "squarePiece",
    rows : 3,
    columns : 1,
    tetrisPieces : [{
      ...tetrisObjects.singlePiece,
      location:{
        index: 2
      }
    }]
  }
  
  const level3 = {
    name: "squarePiece",
    rows : 2,
    columns : 2,
    tetrisPieces : [{
      ...tetrisObjects.tPiece,
      location:{
        index: 2
      }
    }]
  }
  const level4 = {
    name: "lPiece",
    rows : 3,
    columns : 3,
    tetrisPieces : [{
      ...tetrisObjects.squarePiece,
      location:{
        index: 4
      }
    }],
    xGaps : [{x:2,y:1},{x:1,y:2},{x:2,y:3}]
  }
  
  const level5 = {
    name: "squarePiece",
    rows : 5,
    columns : 5,
    tetrisPieces : [{
      ...tetrisObjects.lPiece,
      location:{
        index: 12
      }
    }],
    xGaps : [{x:1,y:4},{x:4,y:5}],
    yGaps : [{x:0,y:2},{x:5,y:0},{x:4,y:0},{x:2,y:0}],
  }
  
  const level6 = {
    name: "squarePiece",
    rows : 3,
    columns : 1,
    tetrisPieces : [{
        ...tetrisObjects.singlePiece,
        location:{
          index: 2
        },
        firstPiece: true
      },
      {
        ...tetrisObjects.singlePiece,
        location:{
          index: 1
        },
        secondPiece: true
      }
      
    ],
    yGaps : [{x:0,y:2},{x:1,y:1}],

      
  }

  const level7 = {
    name: "squarePiece",
    rows : 3,
    columns : 1,
    tetrisPieces : [{
        ...tetrisObjects.singlePiece,
        location:{
          index: 2
        }
      },
      {
        ...tetrisObjects.singlePiece,
        location:{
          index: 1
        }
      }
      
    ],
    xGaps : [{x:0,y:2}],

      
  }
  const level8 = {
    name: "squarePiece",
    rows : 3,
    columns : 2,
    tetrisPieces : [{
        ...tetrisObjects.tPiece,
        location:{
          index: 2
        }
      },
      {
        ...tetrisObjects.singlePiece,
        location:{
          index: 3
        }
      }
      
    ],
      
  }
  const level9 = {
    name: "squarePiece",
    rows : 3,
    columns : 3,
    tetrisPieces : [
      {
        ...tetrisObjects.squarePiece,
        location:{
          index: 3
        }
      },
      {
        ...tetrisObjects.twoPiece,
        location:{
          index: 0
        }
      }
      
    ],
      
  }
  const level10 = {
    name: "squarePiece",
    rows : 3,
    columns : 3,
    tetrisPieces : [
      {
        ...tetrisObjects.squarePiece,
        location:{
          index: 6
        }
      },
      {
        ...tetrisObjects.twoPiece,
        location:{
          index: 7
        }
      }
      
    ],
      
  }

  const level11 = {
    name: "squarePiece",
    rows : 3,
    columns : 3,
    tetrisPieces : [
      {
        ...tetrisObjects.squarePiece,
        location:{
          index: 3
        }
      },
      {
        ...tetrisObjects.threePiece,
        location:{
          index: 4
        }
      }
      
    ],
      
  }
  const firstStageFinal = {
      name: "squarePiece",
      rows : 3,
      columns : 3,
      tetrisPieces : [
        {
          ...tetrisObjects.squarePiece,
          location:{
            index: 8
          }
        },
        {
          ...tetrisObjects.twoPiece,
          location:{
            index: 0
          }
        }
        
      ],
        
    }
  const level12 = {
    name: "squarePiece",
    rows : 3,
    columns : 7,
    tetrisPieces : [
      {
        ...tetrisObjects.threePieceVertical,
        location:{
          index: 7
        }
      },
      {
        ...tetrisObjects.threePieceVertical,
        location:{
          index: 13
        }
      },
      {
        ...tetrisObjects.threePiece,
        location:{
          index: 10
        }
      }
      
    ],
      
  }

  const level13 = {
    name: "squarePiece",
    rows : 4,
    columns : 4,
    tetrisPieces : [
      {
        ...tetrisObjects.threePieceVertical,
        location:{
          index: 13
        }
      },
      {
        ...tetrisObjects.threePieceVertical,
        location:{
          index: 14
        }
      },
      {
        ...tetrisObjects.fourPiece,
        location:{
          index: 4
        }
      }
      
    ],
    yGaps : [{x:3,y:1}]
      
  }
  const level14 = {
    name: "squarePiece",
    rows : 4,
    columns : 4,
    tetrisPieces : [
      {
        ...tetrisObjects.threePieceVertical,
        location:{
          index: 13
        }
      },
      {
        ...tetrisObjects.threePieceVertical,
        location:{
          index: 14
        }
      },
      {
        ...tetrisObjects.fourPiece,
        location:{
          index: 4
        }
      }
      
    ],
    yGaps : [{x:2,y:1}]
      
  }

  const level15 = {
    name: "squarePiece",
    rows : 5,
    columns : 5,
    tetrisPieces : [
      {
        ...tetrisObjects.fourPieceVertical,
        location:{
          index: 4
        }
      },
      {
        ...tetrisObjects.singlePiece,
        location:{
          index: 12
        }
      },
      {
        ...tetrisObjects.twoPiece,
        location:{
          index: 22
        }
      }
      
    ],
      
  }
  const level16 = {
    name: "squarePiece",
    rows : 5,
    columns : 5,
    tetrisPieces : [
      {
        ...tetrisObjects.lPieceLeft,
        location:{
          index: 0
        }
      },
      {
        ...tetrisObjects.twoPiece,
        location:{
          index: 4
        }
      },
      {
        ...tetrisObjects.threePieceVertical,
        location:{
          index: 21
        }
      },
      {
        ...tetrisObjects.threePiece,
        location:{
          index: 24
        }
      }
      
    ],
      
  }

  
 export const levels = [levelPrologue,level1,level2,level3,level4, 
  level5, level6, level7,level8,level9,level10,level11,firstStageFinal, level12,level13,level14,level15,level16];

  export const levelPhase2 = [];
  levels.concat(levelPhase2);
  

