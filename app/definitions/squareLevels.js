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

  const level3 = {
    name: "level3Square",
    rows : 2,
    columns : 2,
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
        colour: "black",
        location:
        {
          index: 2
        },
      },
      {
        colour: "white",
        location:
        {
          index: 3
        },
      }
    ]
  }

  const level4 = {
    name: "level4Square",
    rows : 3,
    columns : 3,
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
        colour: "black",
        location:
        {
          index: 2
        },
      },
      {
        colour: "black",
        location:
        {
          index: 3
        },
        
      },
      {
        colour: "white",
        location:
        {
          index: 4
        },
        
      },   {
        colour: "black",
        location:
        {
          index: 5
        },
        
      },   {
        colour: "white",
        location:
        {
          index: 6
        },
        
      },
      {
        colour: "white",
        location:
        {
          index: 7
        },
        
      },   {
        colour: "white",
        location:
        {
          index: 8
        },
        
      },  
    ]
  }


  const level5 = {
    name: "level5Square",
    rows : 3,
    columns : 3,
    startLocation : [0,3],
    endLocation: [0,2],
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
        colour: "black",
        location:
        {
          index: 2
        },
      },
      {
        colour: "black",
        location:
        {
          index: 3
        },
        
      },
      {
        colour: "white",
        location:
        {
          index: 4
        },
        
      },   {
        colour: "black",
        location:
        {
          index: 5
        },
        
      },   {
        colour: "white",
        location:
        {
          index: 6
        },
        
      },
      {
        colour: "white",
        location:
        {
          index: 7
        },
        
      },   {
        colour: "white",
        location:
        {
          index: 8
        },
        
      },  
    ]
  }

  const level6 = {
    name: "level6square",
    rows : 4,
    columns : 4,
    squarePieces : [{colour: "black",location: {index: 0}},
    {colour: "white",location: {index: 2}},
    {colour: "black",location: {index: 3}},
    {colour: "black",location: {index: 4}},
    {colour: "black",location: {index: 5}},
    {colour: "black",location: {index: 6}},
    {colour: "black",location: {index: 7}},
    {colour: "black",location: {index: 8}},
    {colour: "white",location: {index: 9}},
    {colour: "black",location: {index: 10}},
    {colour: "black",location: {index: 11}},
    {colour: "white",location: {index: 12}},
    {colour: "white",location: {index: 13}},
    {colour: "white",location: {index: 14}},
    {colour: "black",location: {index: 15}},
  ],
  endLocation: [2,0]
  }

  const level7 = {
    name: "level7square",
    rows : 4,
    columns : 4,
    squarePieces : [{colour: "black",location: {index: 0}},
    {colour: "white",location: {index: 2}},
    {colour: "black",location: {index: 3}},
    {colour: "black",location: {index: 4}},
    {colour: "black",location: {index: 5}},
    {colour: "black",location: {index: 6}},
    {colour: "black",location: {index: 7}},
    {colour: "black",location: {index: 8}},
    {colour: "white",location: {index: 9}},
    {colour: "black",location: {index: 10}},
    {colour: "black",location: {index: 11}},
    {colour: "white",location: {index: 12}},
    {colour: "white",location: {index: 13}},
    {colour: "white",location: {index: 14}},
    {colour: "black",location: {index: 15}},
  ],
  endLocation: [4,2]
  }

  const level8 = {
    name: "level8square",
    rows : 4,
    columns : 4,
    squarePieces : [{colour: "black",location: {index: 0}},
    {colour: "white",location: {index: 2}},
    {colour: "black",location: {index: 3}},
    {colour: "black",location: {index: 4}},
    {colour: "black",location: {index: 7}},
    {colour: "black",location: {index: 8}},
    {colour: "white",location: {index: 9}},
    {colour: "black",location: {index: 10}},
    {colour: "black",location: {index: 11}},
    {colour: "white",location: {index: 12}},
    {colour: "white",location: {index: 13}},
    {colour: "white",location: {index: 14}},
    {colour: "black",location: {index: 15}},
  ],
  endLocation: [3,4]
  }

  const level9 = {
    name: "level9square",
    rows : 4,
    columns : 4,
    squarePieces : [{colour: "white",location: {index: 0}},
    {colour: "black",location: {index: 3}},
    {colour: "black",location: {index: 12}},
    {colour: "white",location: {index: 15}},
  ],
  // endLocation: [3,4]
  }

  const level10 = {
    name: "level10square",
    rows : 3,
    columns : 3,
    squarePieces : [{colour: "green",location: {index: 0}},
    {colour: "purple",location: {index: 8}},
  ],
  // endLocation: [3,4]
  }
  const level11 = {
    name: "level11square",
    rows : 3,
    columns : 3,
    squarePieces : [{colour: "green",location: {index: 0}},
    {colour: "purple",location: {index: 8}},
    {colour: "white",location: {index: 4}},
  ],
}
const level12 = {
  name: "level12square",
  rows : 3,
  columns : 3,
  squarePieces : [{colour: "green",location: {index: 1}},
  {colour: "green",location: {index: 5}},
  {colour: "purple",location: {index: 3}},
  {colour: "purple",location: {index: 7}},
  {colour: "white",location: {index: 6}},
],
}
const level13 = {
  name: "level13square",
  rows : 3,
  columns : 3,
  squarePieces : [
    {colour: "green",location: {index: 0}},
    {colour: "white",location: {index: 1}},
  {colour: "white",location: {index: 2}},
  {colour: "white",location: {index: 3}},
  {colour: "white",location: {index: 4}},
  
  {colour: "purple",location: {index: 5}},
  {colour: "purple",location: {index: 6}},
  {colour: "purple",location: {index: 7}},
  {colour: "purple",location: {index: 8}},
],
}


const level14 = {
  name: "level14square",
  rows : 4,
  columns : 4,
  squarePieces : [
  {colour: "purple",location: {index: 2}},
  {colour: "white",location: {index: 6}},
  {colour: "purple",location: {index: 10}},
  {colour: "white",location: {index: 12}},
  {colour: "green",location: {index: 15}},

],
}

const level15 = {
  name: "level15square",
  rows : 3,
  columns : 3,
  squarePieces : [
  {colour: "yellow",location: {index: 0}},
  {colour: "white",location: {index: 2}},
  {colour: "blue",location: {index: 6}},
  {colour: "pink",location: {index: 8}},

],
}

const level16 = {
  name: "level16square",
  rows : 4,
  columns : 4,
  squarePieces : [
  {colour: "blue",location: {index: 0}},
  {colour: "blue",location: {index: 12}},
  {colour: "pink",location: {index: 3}},
  {colour: "pink",location: {index: 15}},
  {colour: "white",location: {index: 6}},
  {colour: "white",location: {index: 10}},
  {colour: "yellow",location: {index: 5}},
  {colour: "yellow",location: {index: 9}},


],
}

const level17 = {
  name: "level17square",
  rows : 4,
  columns : 4,
  squarePieces : [
  {colour: "blue",location: {index: 0}},
  {colour: "blue",location: {index: 12}},
  {colour: "pink",location: {index: 3}},
  {colour: "pink",location: {index: 15}},
  {colour: "white",location: {index: 6}},
  {colour: "yellow",location: {index: 10}},
  {colour: "white",location: {index: 5}},
  {colour: "yellow",location: {index: 9}},


],
}


const level18= {
  name: "level19square",
  rows : 4,
  columns : 5,
  squarePieces : [
  {colour: "blue",location: {index: 0}},
  {colour: "blue",location: {index: 5}},
  {colour: "blue",location: {index: 10}},
  {colour: "white",location: {index: 1}},
  {colour: "white",location: {index: 2}},
  {colour: "white",location: {index: 18}},
  {colour: "white",location: {index: 19}},


  {colour: "pink",location: {index: 7}},
  {colour: "pink",location: {index: 12}},
  {colour: "yellow",location: {index: 4}},
  {colour: "yellow",location: {index: 9}},
  {colour: "yellow",location: {index: 14}},



],
}
  
  export const squareLevels = [ levelPrologue,level1,level2,level3,level4,
    level5,level6,level7,level8,level9,level10,level11,level12,level13,
    level14,level15,level16,level17,level18];