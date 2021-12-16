export const tetrisObjects = {

    singlePiece : {
        img: require("../assets/Tetris/TetrisPieceSingle.png"),
        tetrisBlocks :
        {
            noChild :true 
        },
    },
    tPiece: {
        img: require("../assets/Tetris/TetrisPiece1.png"),
  
        tetrisBlocks :
        {
          childDown : {
            childRight : {
              noChild :true 
            },
           }
        },
    },
    lPiece: {
        img: require("../assets/Tetris/TetrisPieceL.png"),
  
        tetrisBlocks :
        {
          childLeft: {
            childDown : {
                childDown : {
                    noChild :true 
                }
            },
           }
        },
    },
    twoPiece: {
        img: require("../assets/Tetris/TetrisPieceDouble.png"),
  
        tetrisBlocks :
        {
            childRight : {
              noChild :true 
            },
        },
    },
    twoPieceVertical: {
        img: require("../assets/Tetris/TetrisPieceDouble.png"),
  
        tetrisBlocks :
        {
            childDown : {
              noChild :true 
            },
        },
    },
    squarePiece: {
        img: require("../assets/Tetris/TetrisPieceSquare.png"),
        name: "Square",
        tetrisBlocks :
        {
                childDown:{
                    childRight:{
                        childUp :{
                            noChild:true

                        },
                    }
                },
            
        },
    },
}