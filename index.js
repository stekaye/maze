
//Destructuring. Elements taken from Matter JS. Matter = Matter JS Library.
const {Engine, Render, Runner, World, Bodies} = Matter;

//Define width and height. Use later to randomly position shapes.

const width = 600;
const height = 600;

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


//Walls - stops shapes moving off screen. Will adapt to whatever height and width is defined up top.
const walls = [
  Bodies.rectangle(width/2, 0, width, 40, {isStatic: true}),
  Bodies.rectangle(width/2, height, width, 40, {isStatic: true}),
  Bodies.rectangle(0, height/2, 40, height, {isStatic: true}),
  Bodies.rectangle(width, height/2, 40, height, {isStatic: true})
]

//Can pass in array of shapes to world.
World.add(world, walls)

//Maze Generation
// 2D array that represents our grid and starts off with all false values inside of it.

// const grid = [];

//Nested array. First produces correct number of rows, and then nested array populates each row.

// for (let i = 0; i < 3; i++) {
//   grid.push([]);
//   for (let j = 0; j < 3; j++) {
//     grid[i].push(false);
//   } 
// }

//Better alternative to for loop. Create a new array with 3 empty spaces. Fill them with null values. Map over each and replace with an erray with three false values;

//NB We can just fill initially with an array as if we do this each array will be equal in memory. Therefore, if we edit one array, the others will be edited exactly the same way.
let rows = 3;
let cols = 3;

const grid = Array(rows).fill(null).map(() => Array(cols).fill(false));

//Vertical and horizontal arrays keep track off our inner walls. 
//If grid is 3x3, vertical 2D array has 3 rows and 2 columns.
//If grid is 3x3, horizontal 2D array has 2 rows and 3 columns.

const verticals = Array(rows).fill(null).map(() => Array(cols - 1).fill(false))
const horizontals = Array(rows-1).fill(null).map(() => Array(cols).fill(false))

console.log(grid)
console.log(verticals)
console.log(horizontals)