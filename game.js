
// Declare the global variables
let sounds = ['sound/sound1.ogg', 'sound/sound2.mp3']; // sounds for grabbing fruit
let effect = document.createElement('audio');
let players = ['boy', 'girl']; // Player character array
// Fruit types
let fruits = ['apple', 'banana', 'cactus', 'lemon', 'orange', 'pear', 'spiky_ball', 'strawberry']
let score = 0; // Score initialization
let gameSpeed = 0; // Game speed initialization
let fruitArray = []; // Moving fruits
let game_over = false; // If game over of no

// Canvas initialization
let cnvs = document.getElementById("game_canvas");
let ctx = cnvs.getContext('2d');
// Setting canvas height and width
cnvs.width = 800;
cnvs.height = 500;
// Setting font size and font-face for canvas
ctx.font = '30px ubuntu';
// Get canvas position
let canvasPosition = cnvs.getBoundingClientRect();

// Initialize mouse object with initial position
let mouse = {
  x: cnvs.width / 2,
  y: cnvs.height / 2,
  click: false
}

// Window onload function
onload = function () {

  // Mouse event to move the player towards fruit
  cnvs.addEventListener('mousedown', function (event) {
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
  });

  // Prevent the player move on keyup.
  cnvs.addEventListener('mouseup', function (event) {
    mouse.click = false;
  });

  // Store the user information and start the game
  document.getElementById("play_game").onclick = function () {
    let player_name = document.getElementById('player_name').value; // Get player name 
    let player_age = document.getElementById('player_age').value; // Get player age    
    if (player_name != '' && player_age != '') {
      if (!isNaN(parseInt(player_age))) {
        localStorage.setItem('player_name', player_name); // Save name to localStorage
        localStorage.setItem('player_age', player_age); // Save age to localStorage
        game_over = false; // Set to false to start the game
        playSound('sound/play.mp3'); // Play the sound
        showPlayerDetail();// Show player detail function
        animate(); // Animate the fruit objects
      } else {
        alert('Please enter valid age.');
      }
    } else {
      alert('Please enter player detail first.');
    }
  }

  // Restart the game by refreshing the page
  document.querySelector('.modal button').onclick = function () {
    history.go(0);
  }

}

// Player prototype class with methods
class Player {
  constructor() {
    this.x = cnvs.width / 2;
    this.y = cnvs.height / 2;
    this.radius = 10;
  }

  update() {
    const dx = this.x - mouse.x; // player horizontal position
    const dy = this.y - mouse.y; // player vertical position
    if (mouse.x != this.x) {
      this.x -= (dx / 15);
    }
    if (mouse.y != this.y) {
      this.y -= (dy / 15);
    }
  }

  draw(face) {
    let playerFace = new Image();
    playerFace.src = "images/" + face + "_face.png"; // Setting the player face according to selected character
    ctx.drawImage(playerFace, 2, 2, 450, 350, this.x - 100, this.y - 100, 200, 160);
    if (mouse.click = true) {
      ctx.moveTo(this.x, this.y); // move player face towards the friuts
    }
  }
}

let player = new Player(); // Create player object

// Fruit prototype class with methods
class Fruit {

  // Class constructor to initilize object with default values
  constructor() {
    this.x = Math.random() * cnvs.width;
    this.y = cnvs.height + 100;
    this.radius = 58;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = sounds[Math.floor(Math.random() * sounds.length)];
    this.fruit_type = fruits[Math.floor(Math.random() * fruits.length)];
  }

  // Update function for object postion
  update() {
    this.y -= this.speed;
    let dist_x = this.x - player.x;
    let dist_y = this.y - player.y;
    this.distance = Math.sqrt(dist_x * dist_x + dist_y * dist_y);
  }

  // Draw the fruit to canvas with dynamic fruit image
  draw() {
    // Show the randomly generated fruit image
    let fruitImage = new Image();
    fruitImage.src = "images/" + this.fruit_type + ".png";
    ctx.drawImage(fruitImage, 0, 0, 520, 480, this.x - 43, this.y - 57, 130, 150);

    // Created circle around the fruit to measure the collison
    ctx.fillStyle = 'transparent';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    // ctx.stroke(); // Removed the stroke of circle
  }

}

function handleFruit() {
  if (gameSpeed % 50 == 0) {
    // Continuously add fruits to array
    fruitArray.push(new Fruit());
  }
  // Draw all the fruits to canvas
  for (let i = 0; i < fruitArray.length; i++) {
    fruitArray[i].update();
    fruitArray[i].draw();
  }

  for (let i = 0; i < fruitArray.length; i++) {

    // Remove the fruit if passed out of canvas top
    if (fruitArray[i].y < (0 - this.radius * 2)) {
      fruitArray.splice(i, 1);
    }
    // Checking colison and perform score update and remove the fruit from canvas
    if (fruitArray[i] && (fruitArray[i].distance < fruitArray[i].radius + player.radius)) {
      if (!fruitArray[i].counted) { // Avoid multiple points for one colison                 
        if (fruitArray[i].fruit_type != 'cactus' && fruitArray[i].fruit_type != 'spiky_ball') {
          playSound(fruitArray[i].sound);
          score++;
          fruitArray[i].counted = true;
          fruitArray.splice(i, 1);
        } else {
          // Logic to over the game
          game_over = true;
          playSound('sound/game_over.mp3');
          fruitArray.splice(i, 1);
          ctx.clearRect(0, 0, cnvs.width, cnvs.height);
          document.querySelector('.modal').style.opacity = 1;
          document.querySelector('.modal').style.pointerEvents = 'all';
        }
      }
    }
  }
}

// Animate function : Main animation function to animate all the game objects
function animate() {
  ctx.clearRect(0, 0, cnvs.width, cnvs.height);
  handleFruit();
  let player_character = getPlayer();
  player.update();
  player.draw(player_character);

  ctx.fillStyle = "#f00";
  ctx.font = "20px ubuntu"
  ctx.fillText('Hi! ' + localStorage.getItem('player_name') + ", Use mouse clicks to move towards the fruits. Beware of spikes.", 10, 30);
  
  ctx.fillStyle = "#000";
  ctx.font = "30px ubuntu"
  ctx.fillText('Score:' + score, 10, 65);

  gameSpeed++;
  // If game is not over it will recursively call function
  if (!game_over) {
    requestAnimationFrame(animate); // animation function recursion
  }
}

// Drag the player character for selection
function selectTheCharacter(e) {
  // Setting player character to event data
  e.dataTransfer.setData("gender", e.target.dataset.character);
}

// Apply some effect if drag over
function overTheDroppable(e) {
  e.target.style.borderColor = '#CF9B7D';
  e.preventDefault();
}

// Revert the box border to defailt if not dropped
function revertBack(e) {
  e.target.style.borderColor = '#000';
}

// Function : Character selection
function characterDropped(e) {
  e.preventDefault();
  var character = e.dataTransfer.getData('gender'); // Get character type from event data
  let person_image = document.getElementById(character); // Get the image
  let existing_player = document.getElementById(localStorage.getItem('player')); // Check already selected character
  let divContains_image = e.target.contains(existing_player); // Check if already selected character
  if (!divContains_image) { // Avoid multiple character selection
    playSound('sound/select-player.mp3'); // Play sound on character selection
    localStorage.setItem('player', character); // Set player character to locastorage
    e.target.appendChild(person_image); // Append player image to selection box
    e.target.style.borderColor = '#000'; // Revert back the border
    document.querySelector('.player-detail').style.opacity = 1; // Show player detail
    setTimeout(function () {
      document.querySelector('.player-detail').style.display = 'block';
    }, 600);
  }
}

// Generalize function to play any sound from the folder
function playSound(sound) {
  effect.src = sound;
  effect.play();
}

// Get the player character name from localStorage
function getPlayer() {
  let player_face = localStorage.getItem('player');
  return player_face;
}

// Show player detail once start game
function showPlayerDetail() {
  document.querySelector('.player-detail').style.opacity = 0;
  setTimeout(function () {
    document.querySelector('.player-detail').style.display = 'none';
    document.querySelector('.player-info').style.display = 'block';
  }, 600);
  document.getElementById('p_name').innerHTML = localStorage.getItem('player_name');
  document.getElementById('p_age').innerHTML = localStorage.getItem('player_age');
  document.querySelector('.player-info').style.opacity = 1;
}



