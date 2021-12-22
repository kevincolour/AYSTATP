export const tetrisObjects = {

    singlePiece : {
        img: require("../../assets/Tetris/TetrisPieceSingle.png"),
        tetrisBlocks :
        {
            noChild :true 
        },
    },
    tPiece: {
        img: require("../../assets/Tetris/TetrisPiece1.png"),
  
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
        img: require("../../assets/Tetris/TetrisPieceL.png"),
  
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
        img: require("../../assets/Tetris/TetrisPieceHorizontalDouble.png"),
  
        tetrisBlocks :
        {
            childRight : {
              noChild :true 
            },
        },
    },
    threePiece: {
        img: require("../../assets/Tetris/TetrisPieceHorizontalThree.png"),
  
        tetrisBlocks :
        {
            childRight : {
                childRight : {
                    noChild :true 
                  },
            },
        },
    },
    threePieceVertical: {
        img: require("../../assets/Tetris/TetrisPieceVerticalThree.png"),
  
        tetrisBlocks :
        {
            childDown : {
                childDown : {
                    noChild :true 
                  },
            },
        },
    },
    fourPiece: {
        img: require("../../assets/Tetris/TetrisPieceHorizontalFour.png"),
  
        tetrisBlocks :
        {
            childRight : {
                childRight : {
                    childRight : {
                        noChild :true 
                      }, 
                  },
            },
        },
    },
    twoPieceVertical: {
        img: require("../../assets/Tetris/TetrisPieceDouble.png"),
  
        tetrisBlocks :
        {
            childDown : {
              noChild :true 
            },
        },
    },
    squarePiece: {
        img: require("../../assets/Tetris/TetrisPieceSquare.png"),
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