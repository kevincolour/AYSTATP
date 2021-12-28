const levelPrologue = {
    name: "level0Square",
    rows : 2,
    columns : 1,
    startLocation : [0,1],
    endLocation: [1,1],
    squarePieces : [{
        colour: "black",
        location:
        {
          index: 0
        },
      },
      {
        colour: "white",
        location:
        {
          index: 1
        },
      }
    ]
  }
  const level1 = {
    name: "level1Square",
    rows : 2,
    columns : 1,
    squarePieces : [{
        colour: "black",
        location:
        {
          index: 0
        },
      },
      {
        colour: "white",
        location:
        {
          index: 1
        },
      }
    ]
  }
  const level2 = {
    name: "level2Square",
    rows : 3,
    columns : 1,
    squarePieces : [{
        colour: "black",
        location:
        {
          index: 0
        },
      },
      {
        colour: "black",
        location:
        {
          index: 1
        },
      },
      {
        colour: "white",
        location:
        {
          index: 2
        },
      }
    ]
  }

  const testLevel = {
    name: "level2Square",
    rows : 3,
    columns : 1,
    squarePieces : [{
        colour: "white",
        location:
        {
          index: 2
        },
      }
    ]
  }
  export const squareLevels = [testLevel, levelPrologue,level1,level2];