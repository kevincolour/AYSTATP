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
        }
      },
      {
        ...tetrisObjects.singlePiece,
        location:{
          index: 1
        }
      }
    ]
      
  }

  const level7 = {
    name: "squarePiece",
    rows : 5,
    columns : 5,
    tetrisPieces : [{
        ...tetrisObjects.singlePiece,
        location:{
          index: 2
        }
      }],
    xGaps :[{
        x:1,
        y:1
    }],
    yGaps : [{x:2,y:0}]
  }

  
 export const levels = [levelPrologue,level1,level2,level3,level4, level5, level6, level7];
  

