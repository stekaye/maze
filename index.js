
//Destructuring. Elements taken from Matter JS. Matter = Matter JS Library.
const {Engine, Render, Runner, World, Bodies} = Matter;

//Define rows, columns, width, height cellWidth and cellHeight. Use later to draw maze.

const rows = 10;
const cols = 10;
const width = 600;
const height = 600;
const cellWidth = width/cols;
const cellHeight = height/rows;


// Create new Engine
const engine = Engine.create();
//Access World that got created along with the engine.
const { world } = engine;
//create render object, which will show content on screen.
const render = Render.create({
  //Tell the render where we want to show representation of everything inside HTML document (adds new element inside the body);
  element: document.body,
  //Which engine to use
  engine: engine,
  //Pass in an options object specifying height and width of canvas element used to display content. If we make wireframes false, shapes will be solid with random colour;
  options: {
    width,
    height,
    wireframes: false
  }
});

//Tell render object to start.
Render.run(render);
Runner.run(Runner.create(), engine);

// ********* MAZE GENERATION *********

//Function to randomly shuffle values in an array.

const shuffle = (arr) => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter)
    
    counter--;

    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }

  return arr;
}

// 2D array that represents our grid and starts off with all false values inside of it.

//Better alternative to for loop. Create a new array with 3 empty spaces. Fill them with null values. Map over each and replace with an erray with three false values;

//NB We can just fill initially with an array as if we do this each array will be equal in memory. Therefore, if we edit one array, the others will be edited exactly the same way.

const grid = Array(rows).fill(null).map(() => Array(cols).fill(false));

//Vertical and horizontal arrays keep track off our inner walls. 
//If grid is 3x3, vertical 2D array has 3 rows and 2 columns.
//If grid is 3x3, horizontal 2D array has 2 rows and 3 columns.

const verticals = Array(rows).fill(null).map(() => Array(cols - 1).fill(false))
const horizontals = Array(rows-1).fill(null).map(() => Array(cols).fill(false))

//Randomly generate row and col index to choose starting position.

const startRow = Math.floor(Math.random() * rows)
const startCol = Math.floor(Math.random() * cols)

//Define function for building our maze.

const buildMaze = (row, column) => {
  // If I have visited the cell at row[col], return;

  if (grid[row][column] === true) {
    return;
  }

  // Mark this cell as having been visited (true)

  grid[row][column] = true;

  // Assemble randomly ordered list of neighbour cells.

  const neighbours = shuffle([
    [row - 1, column, 'up'], //above
    [row + 1, column, 'down'], //below
    [row, column + 1, 'right'], //right
    [row, column - 1, 'left'] //left
  ]);

  //For each neighbour... 

  for (let neighbour of neighbours) {

    const [nextRow, nextColumn, direction] = neighbour;

  // (1) Check to see if neighbour cell is out of bounds

    if (nextRow < 0 || nextRow >= rows || nextColumn < 0 || nextColumn >= cols) {
      //Don't leave, but don't do anything else...
      continue;
    }

  // (2) If we have visited neighbour, continue to next option.

    if (grid[nextRow][nextColumn] === true) {
      continue;
    } 

  // (3) Remove wall from either horizontal/vertical array.

    if (direction === 'right') {
      verticals[row][column] = true;
    } else if (direction === 'left') {
      verticals[row][column - 1] = true;
    } else if (direction === 'up') {
      horizontals[row - 1][column] = true;
    } else if (direction === 'down') {
      horizontals[row][column] = true;
    }

    // (4) Visit next cell (recall function)
    buildMaze(nextRow, nextColumn)

  }

}

buildMaze(startRow, startCol)

//Iterate over horizontals and build rectangles where values are false.

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open === true) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * cellWidth + cellWidth / 2,  //position on x
      rowIndex * cellHeight + cellHeight,       //position on y
      cellWidth,                                //width
      10,                                       //height
      {isStatic: true}
    );

    World.add(world, wall);

  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * cellWidth + cellWidth,      //position on x
      rowIndex * cellHeight + cellHeight / 2,   //position on y
      10,                                       //width
      cellHeight,                               //height
      {isStatic: true}
    );
    
    World.add(world, wall);

  });
});