
//Destructuring. Elements taken from Matter JS. Matter = Matter JS Library.
const {Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse} = Matter;

//Define width and height. Use later to randomly position shapes.

const height = 600;
const width = 800;

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

// Enable click and drag mouse effects
World.add(world, MouseConstraint.create(engine, {
  mouse: Mouse.create(render.canvas)
}))

//Walls - stops shapes moving off screen
const walls = [
  Bodies.rectangle(width/2, 0, width, 40, {isStatic: true, render: {fillStyle: "#434e52"}}),
  Bodies.rectangle(width/2, height, width, 40, {isStatic: true, render: {fillStyle: "#434e52"}}),
  Bodies.rectangle(0, height/2, 40, height, {isStatic: true, render: {fillStyle: "#434e52"}}),
  Bodies.rectangle(width, height/2, 40, height, {isStatic: true, render: {fillStyle: "#434e52"}})
]

//Can pass in array of shapes to world.
World.add(world, walls)

//Random shapes with random positions and customised colours.

for (let i = 0; i < 30; i++) {
  if (Math.random() <= 0.33) {
    World.add(world, Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50, {
      render: {
        fillStyle: "#df8543"
      }
    }))
  } else if (Math.random() <= 0.66) {
    World.add(world, Bodies.circle(Math.random() * width, Math.random() * height, 30, {
      render: {
        fillStyle: "#5b8c85"
      }
    }))
  } else {
    World.add(world, Bodies.polygon(Math.random() * width, Math.random() * height, 5, 40, {
      render: {
        fillStyle: "#ecce6d"
      }
    }))
  }
}












//Create a shape (x pos of center, y pos of center, width, height)
// const shape = Bodies.rectangle(200, 200, 50, 50, {
  //isStatis:true ensures that the shape does not move. If we remove this, the shape will immediately fall on refresh.
  // isStatic: true
// });
//Add to the world object. If we search for world in the console at any time and look under bodies, we can see all the shapes and properties contained.
// World.add(world, shape)

