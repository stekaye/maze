
//Destructuring. Elements taken from Matter JS. Matter = Matter JS Library.
//Body allows us to move the object.
//Events allows us to detect events (such as collisions).
const {Engine, Render, Runner, World, Bodies, Body, Events} = Matter;

//Define rows, columns, width, height cellWidth and cellHeight. Use later to draw maze.

const cellsHorizontal = 5;
const cellsVertical = 4;
const width = window.innerWidth; 
const height = window.innerHeight;
const unitLengthX = width/cellsHorizontal;
const unitLengthY = height/cellsVertical;

// Create new Engine
const engine = Engine.create();
//Remove gravity;
engine.world.gravity.y = 0;
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

//********* WALLS ********* 
//stops shapes moving off screen

const walls = [
  Bodies.rectangle(width/2, 0, width, 10, {isStatic: true, render: {fillStyle: "#ecce6d"}}),
  Bodies.rectangle(width/2, height, width, 10, {isStatic: true, render: {fillStyle: "#ecce6d"}}),
  Bodies.rectangle(0, height/2, 10, height, {isStatic: true, render: {fillStyle: "#ecce6d"}}),
  Bodies.rectangle(width, height/2, 10, height, {isStatic: true, render: {fillStyle: "#ecce6d"}})
]

World.add(world, walls)

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

const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));

//Vertical and horizontal arrays keep track off our inner walls. 
//If grid is 3x3, vertical 2D array has 3 rows and 2 columns.
//If grid is 3x3, horizontal 2D array has 2 rows and 3 columns.

const verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal - 1).fill(false))
const horizontals = Array(cellsVertical-1).fill(null).map(() => Array(cellsHorizontal).fill(false))

//Randomly generate row and col index to choose starting position.

const startRow = Math.floor(Math.random() * cellsVertical)
const startCol = Math.floor(Math.random() * cellsHorizontal)

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

    if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
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
      columnIndex * unitLengthX + unitLengthX / 2,  //position on x
      rowIndex * unitLengthY + unitLengthY,       //position on y
      unitLengthX,                                //width
      5,                                       //height
      {isStatic: true,
        label: 'wall',
        render: {
          fillStyle: '#ecce6d'
        }}
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
      columnIndex * unitLengthX + unitLengthX,      //position on x
      rowIndex * unitLengthY + unitLengthY / 2,   //position on y
      5,                                       //width
      unitLengthY,                               //height
      {isStatic: true,
        label: 'wall',
        render: {
          fillStyle: '#ecce6d'
        }}
    );
    
    World.add(world, wall);

  });
});

//********* GOAL ********* 

const goal = Bodies.rectangle(
  width - (unitLengthX/2) + 2.5,        //position on x
  height - (unitLengthY/2) + 2.5,      //position on y
  unitLengthX * 0.65,                   //width
  unitLengthY * 0.65,                  //height
  {
    isStatic: true,
    render: {fillStyle: "#ecce6d"},
    label: 'goal'
  }
);

World.add(world, goal);

//********* BALL ********* 

const ballRadius = Math.min(unitLengthX, unitLengthY) / 4
const ball = Bodies.circle(
  unitLengthX / 2,                  //position on x
  unitLengthY / 2,                  //position on y
  ballRadius,                       //radius
  {
    isStatic: false,
    render: {fillStyle: "#ecce6d"},
    label: 'ball'
  },
    
);

World.add(world, ball);

//********* KEYPRESS ********* 

document.addEventListener('keydown', event => {

  const {x, y} = ball.velocity;
  
  if (event.code === 'KeyW' || event.code === 'ArrowUp') {
    //Negative velocity moves ball up. X remains the same.
    Body.setVelocity(ball, {x, y : y - 5})
  }

  if (event.code === 'KeyS' || event.code === 'ArrowDown') {
    Body.setVelocity(ball, {x, y : y + 5})
  }

  if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
    Body.setVelocity(ball, {x: x - 5, y})
  }

  if (event.code === 'KeyD' || event.code === 'ArrowRight') {
    Body.setVelocity(ball, {x: x + 5, y})
  }

})

//********* WIN CONDITION ********* 

Events.on(engine, 'collisionStart', event => {
  
  event.pairs.forEach((collision) => {
    const labels = ['ball', 'goal'];

    if (
      labels.includes(collision.bodyA.label) && 
      labels.includes(collision.bodyB.label)) {
      //Display message
      document.querySelector('.winner').classList.remove('hidden');
      //Turn gravity back on.
      world.gravity.y = 1;
      //Turn isStatic to off for all 'wall' labels in world.bodies...
      world.bodies.forEach((body) => {
        if (body.label = 'wall') {
          Body.setStatic(body, false);
        }
      });
    }

  });

});