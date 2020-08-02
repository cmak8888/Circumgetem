var px = 100;
var py = 150;
const minGridX = 100;
const minGridY = 100;
const maxGridX = 900;
const maxGridY = 300;
// to Create array of 5 different color squares 
var squares = [];

var waveNum = 1;
var playerScore = 0;
var selectedSquare = false;
var numTriangles = 0;

var gridWidth = 100;
var win = false;
var readyToContinue = false;

$("main-game").hide();
$("#gameCanvas").css({"display": "none"});
var img = document.createElement("img");
img.src = "Images/moneybag.jpg";
var startScreen = true;




const square = {
  id: 0,
  row: 0,           //Along the placeable Grid, not the canvas
  column: 0,
  size: 75,
  shape: "square",
  color: "black",
  cost: 0,
  ability: "",
  hits: 2,
  
};

const circle = {
  id: 0,
  row: 0,
  column: 9,
  radius: 25,
  shape: "circle",
  color: "white",
  reward: 10,
  variance: 5,
  ability: "melee",
  hits: 1,
};

const selectionSquare = {
	id: 0,
	coordX: 0,
	coordY: 0,
	size: gridWidth,
	typeId: 0,
}

const projectile = {
  id: 0,
  shape: "projectile",
  coordX: 0,
  coordY: 0,
  who: true,                   //Is it an enemy or player?
};
//Tracks all the sprites
var squareArray = [];
var squareList = [];
var circleArray = [];
var circleList = [];
var projectileArray = [];
var selectionArray = [];		//List of Squares to choose
var selectedSquares = [];


var s = {id: 1, coordX: 145, coordY: 480, who: true}; 
var r = {id: 2, coordX: 290, coordY:  480, who: true}; 
var u = {id: 3, coordX: 445, coordY: 480, who: true}; 
selectedSquares.push(s);
selectedSquares.push(r);
selectedSquares.push(u);

// document.addEventListener("mousemove", getPosition, false);
document.addEventListener("mousedown", getMouseClickPosition, false);
document.addEventListener("keydown", keysPressed, false);


/*
	Populate the different kinds of Circles
	Populate the different kinds of Squares
	Populate the different kinds of Abilities
*/
circleList[0] = Object.create(circle);
circleList[0].radius = 25;
circleList[0].ability = "melee";
circleList[0].reward = 5;
circleList[0].variance = 1;
circleList[0].color = "white";

circleList[1] = Object.create(circle);
circleList[1].radius = 20;
circleList[1].ability = "ranged";
circleList[1].reward = 4;
circleList[1].variance = 2;
circleList[1].color = "green";

circleList[2] = Object.create(circle);
circleList[2].radius = 25;
circleList[2].ability = "melee";
circleList[2].reward = 8;
circleList[2].variance = 4;
circleList[2].color = "blue";

circleList[3] = Object.create(circle);
circleList[3].radius = 25;
circleList[3].ability = "ranged";
circleList[3].reward = 12;
circleList[3].variance = 5;
circleList[3].color = "orange";

circleList[4] = Object.create(circle);
circleList[4].radius = 35;
circleList[4].ability = "heavy";
circleList[4].reward = 25;
circleList[4].variance = 10;
circleList[4].color = "magenta";

//Squares
squareList[0] = Object.create(square);
squareList[0].size = 25;
squareList[0].ability = "melee";
squareList[0].cost = 2;
squareList[0].color = "yellow";

squareList[1] = Object.create(square);
squareList[1].size = 20;
squareList[1].ability = "ranged";
squareList[1].cost = 4;
squareList[1].hits = 1;
squareList[1].color = "grey";

squareList[2] = Object.create(square);
squareList[2].size = 25;
squareList[2].ability = "melee";
squareList[2].cost = 3;
squareList[2].hits = 2;
squareList[0].color = "#20F82F";

squareList[3] = Object.create(square);
squareList[3].size = 25;
squareList[3].ability = "ranged";
squareList[3].cost = 5;
squareList[3].hits = 2;
squareList[3].color = "#87ceeb";

squareList[4] = Object.create(square);
squareList[4].size = 25;
squareList[4].ability = "heavy";
squareList[4].cost = 50;
squareList[4].hits = 4;
squareList[4].color = "pink";

squareList[5] = Object.create(square);
squareList[5].size = 75;
squareList[5].cost = 5;
squareList[5].hits = 6;
squareList[5].color = "brown";



function clearScreen(){
	var canvas = document.getElementById("gameCanvas");

	var context = canvas.getContext("2d");
	
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle="#000000";
	context.fillRect(0,0,canvas.width,canvas.height);
}

window.onload = function() {
	update_scores();
	playGame();

}

function drawMap(){
	
	
	var canvas = document.getElementById("gameCanvas");

	var context = canvas.getContext("2d");
	
    for (var x = 0; x <= 9; x += 1) {
        context.moveTo(1 + (x*gridWidth) + px, py);
        context.lineTo(1 + (x*gridWidth) + px, maxGridY + py);
    }

    for (var x = 0; x <= 3; x += 1) {
        context.moveTo(px, 1 + (gridWidth*x) + py);
        context.lineTo((maxGridX) + px, 1 + (gridWidth*x) + py);
    }
	
    context.strokeStyle = "blue";
    context.stroke();
	
	context.beginPath();
	
	context.fillStyle = "#F9A520";
    context.moveTo(20, 50);
    context.lineTo(45, 65);
    context.lineTo(45, 35);
    context.fill();
	
	context.font = "30px Arial";
	context.fillText(" " + numTriangles, 60, 60);
	
	
	context.font = "30px Arial";	
	context.fillText("Wave: " + waveNum, 900, 50);
	
	
	context.fillStyle = squareList[0].color;
	context.fillRect(145, 480, 100, 100);
	
	context.fillStyle = squareList[1].color;
	context.fillRect(290, 480, 100, 100);
	
	context.fillStyle = squareList[2].color;
	context.fillRect(445, 480, 100, 100);
	
	
}

function drawSquares() {
	var canvas = document.getElementById("gameCanvas");

	var context = canvas.getContext("2d");
	
	// Draw a square using the rect() method
	squares.push(drawStuff(75, 75,10, 500));
    squares.push(drawStuff(75, 75, 110, 500));
    squares.push(drawStuff(75, 75, 210, 500));
	squares.push(drawStuff(75, 75, 310, 500));
	squares.push(drawStuff(75, 75, 410, 500));
	for ( i=0;i<squares.length;i++){
        //context.fillStyle = squares[i].color;
		context.beginPath();
		context.strokeStyle = "green";
		
        context.rect(squares[i].left,squares[i].top,squares[i].width,squares[i].height);
		context.stroke();
    }
    
}

function drawStuff(width, height, x, y) {
    var shape={};
    shape.left = x;
    shape.top = y;
    shape.width = width;
    shape.height = height;
    //shape.color = color;
    return shape;
}


function drawMoneyBag()
{
	var canvas = document.getElementById("gameCanvas");

	var context = canvas.getContext("2d");
	img.addEventListener("load", () => {
    for (var x = 5; x < 10; x += 10) {
      context.drawImage(img, x, 5);
    }
  });
}


function hasGameEnded() {
	if(waveNum == 5) {
		return true;
	}
	
	for(var i = 0; i<circles.length; i++) {
		if(circles[i].x <= minGridX) {
			return true;
		}
		
	}
}



function drawStartScreen() {
	 let clickSubmit = false;

    $(".glossary-screen").hide();
    $(".back").hide();
	
	
    $(".start").click(function(e){

        var inp = $("#yourTextBoxId").val();

        $(".back").click(function(e){
            document.location.href = "index.html";
			//$(".start-menu").hide();
        })

		$(".enter-name").show();
        $(".user-name").text('');
        $(".group-buttons").html(" <form class='enter-name'> Enter name <input type='text' name='username' id='username'> <br> <button id='submit'> Start Game </button></form>")
		.css({"padding": "3px, 4px", "font-size": "14pt"});

        
        $(".back").show();

        $("#submit").click(function(e){
			
		   $("main-game").show();
		   e.preventDefault();
		   $("#username").val()
           if($("#username").val().trim() != '') {
			    drawMap();
				startScreen = false;
				console.log("sdaf");
				$("#gameCanvas").css({"display": "block"});
				$(".start-menu").hide();
				$("#error-one .group-buttons").fadeOut(2000);    
				
                $("body").animate({
                    top: '400px'
					
                })
				
				$("#error-one").hide();
            
            }

            else {
               
                $("#error-one").text("Please input a name");
            }

        })
});

	
}

if(startScreen) {
	drawStartScreen();
}
   

function drawTriangle(context, x, y, triangleWidth, triangleHeight, fillStyle){
	context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x + triangleWidth / 2, y + triangleHeight);
	context.lineTo(x - triangleWidth / 2, y + triangleHeight);
	context.closePath();
	context.fillStyle = fillStyle;
	context.font = "30px Verdana";
	context.strokeText("Text", 100, 100);
	context.fill();
}





function drawThreeSquares() {
	
	
	var canvas = document.getElementById("gameCanvas");

	var context = canvas.getContext("2d");
	
	clearScreen();
	//draw2by3Map();
	
	context.strokeRect(50,200,400,250);
	// Draw a square using the rect() method
	squares.push(drawStuff(75, 75,100, 300));
    squares.push(drawStuff(75, 75, 200, 300));
    squares.push(drawStuff(75, 75, 300, 300));

	for ( i=0;i<squares.length;i++){
        //context.fillStyle = squares[i].color;
		context.beginPath();
		context.strokeStyle = "green";
		
        context.rect(squares[i].left,squares[i].top,squares[i].width,squares[i].height);
		context.stroke();
    }
    
}

function draw2by3Map(){
	
	
	var canvas = document.getElementById("gameCanvas");

	var context = canvas.getContext("2d");
	
	//context.beginPath();
	
    for (var x = 0; x <= 2; x += 1) {
        context.moveTo(1 + (x*100) + px, py);
        context.lineTo(1 + (x*100) + px, 300 + py);
    }

    for (var x = 0; x <= 3; x += 1) {
        context.moveTo(px, 1 + (100*x) + py);
        context.lineTo((900) + px, 1 + (100*x) + py);
    }
	//context.beginPath();
    context.strokeStyle = "red";
    context.stroke();
}



function rng(limit) {
  return Math.floor(Math.random()*limit);  
}

function getGrid(x,y) {
	var factor = 0;
	if(x < 100) {
		return -1;
	}
	if(y < 100 + minY) {
		factor = 0;
	} else if (y < 200 + minY) {
		factor = 1;
	} else if (y < 300 + minY) {
		factor = 2;
	}
	if(x < minX) {
		return 9 * factor + 1;
	} else if(x < 100 + minX) {
		return 9 * factor + 2;
	} else if(x < 200 + minX) {
		return 9 * factor + 3;
	} else if(x < 300 + minX) {
		return 9 * factor + 4;
	} else if(x < 400 + minX) {
		return 9 * factor + 5;
	} else if(x < 500 + minX) {
		return 9 * factor + 6;
	} else if(x < 600 + minX) {
		return 9 * factor + 7;
	} else if(x < 700 + minX) {
		return 9 * factor + 8;
	} else if(x < 800 + minX) {
		return 9 * factor + 9;
	}
}

function newWave() {
	
	clearScreen();
	
	numTriangles += 3 * waveNum;
	waveNum += 1;
	let mobs = [];
	mobs[0] = 0;
	mobs[1] = 0;
	mobs[2] = 0;
	mobs[3] = 0;
	mobs[4] = 0;
	mobs[5] = 0;
	
	let maxEnemies = 1 + (waveNum*waveNum);
	if (waveNum <= 1) {
		mobs[0] = maxEnemies;
	} if (waveNum < 3) {
		mobs[0] = 0.75*maxEnemies;
		mobs[1] = 0.25*maxEnemies;
	}
	else if (waveNum < 4) {
		mobs[0] = 0.1*maxEnemies;
		mobs[1] = 0.45*maxEnemies;
		mobs[2] = 0.45*maxEnemies;
	} else if(waveNum < 5) {
		mobs[0] = 0.05*maxEnemies;
		mobs[1] = 0.35*maxEnemies;
		mobs[2] = 0.35*maxEnemies;
		mobs[3] = 0.25*maxEnemies;
	} else if(waveNum < 6) {
		mobs[0] = 0.05*maxEnemies;
		mobs[1] = 0.15*maxEnemies;
		mobs[2] = 0.25*maxEnemies;
		mobs[3] = 0.55*maxEnemies;
		mobs[4] = 1;
		maxEnemies += 1;
	} else {
		mobs[0] = 0.04*maxEnemies;
		mobs[1] = 0.10*maxEnemies;
		mobs[2] = 0.30*maxEnemies;
		mobs[3] = 0.55*maxEnemies;
		mobs[4] = 0.01*maxEnemies;
	}
	var mobCount = 0;
	do {
		let x = rng(5);
		let circ = Object.create(circle);
		if(mobs[x] <=0 ) {
			continue;
		} else {
			mobs[x] -= 1;
			maxEnemies -= 1;
			circ = circleList[x];
			circ.id = mobCount;
			circ.row = rng(3);
			circleArray.push(circ);
			mobCount += 1;
		}
	} while(maxEnemies > 0);
	//updateWave();
	drawMap();
}

function gameOver() {
	
	if(win == true) {
	var ctx = c.getContext("2d");
	ctx.font = "50px Arial";
	ctx.fillText("Game Over", 400, 450);
	ctx.fillText("Waves Survived: " + waveNum, 400, 600);
	ctx.fillText("Score: " + playerScore, 400, 750);
	}
}

function checkCollide(object) {
   if(object.shape == "projectile") {
	   if(object.who == 0) {
		   for(var i = 0; i < circleArray.length;i++) {
			   if (object.x == circleArray[i].x || object.x + 1== circleArray[i].x) {
				    if(circleArray[i].hits - 1 == 0) {
						killCircle(circleArray[i]);
					} else {
						circleArray[i].hits = 1
					}
				    return true;
			   }
		   }
	   } else if(object.who == 1) {
		    for(var i = 0; i < squareArray.length;i++) {
				if (object.x == squareArray[i].x || object.x - 1== squareArray[i].x) {
					if(squareArray[i].hits - 1 == 0) {
						killSquare(squareArray[i]);
					} else {
						squareArray[i].hits = 1
					}
					return true;
				}
		    }
	   }
	   }
    else if (object.shape == "square") {
	   for(var i = 0; i < circleArray.length;i++) {
		   if (object.x + 1 == circleArray[i].x) {
			   return true;
		   }
	   }
	   return false;
   } else if (object.shape == "circle") {
	   for(var i = 0; i < squareArray.length;i++) {
		   if (object.x - 1 == squareArray[i].x) {
			   return true;
		   }
	   }
	   return false;
   }
}

function redrawSquare(x, y) {
	
}

function killCircle(circle) {
	redrawSquare(circle.x, circle.y);
	circleArray[circle.id] = null;
	numTriangles += circle.reward + rng(2*circle.variance) - circle.variance;
	playerScore += 1;
}

function clearSquare(square) {
	redrawSquare(square.x, square.y);
	squareArray[square.id] = null;
}

/*
	Abilities and Attacks
*/
function ranged(object) {
	var i = Object.create(projectile);
	i.id = projectile.length;
	
	if(object.shape == "square") {
		i.who = true;
		i.coordX = object.x + 1;
		i.coordY = object.y;
		
		projectileArray.push(i);
		
	}
	
	else {
		i.who = false;
		i.coordX = object.x - 1;
		i.coordY = object.y;
		
		projectileArray.push(i);
	}
	
}

function melee(object) {
	var context = canvas.getContext("2d");
	if(object.shape == "square" && checkCollide(object)) {
		object.x += gridWidth - 25;
		object.x -= gridWidth - 25;
	}
	else if(object.shape == "circle" && checkCollide(object)) {
		object.x += gridWidth - 25;
	}
	
	
}

function drawProjectile() {
	
	var context = canvas.getContext("2d");
	for(var i =0; i<object.projectileArray.length; i++) {
		var t = projectileArray[i];
		context.fillStyle = "red";
		context.fillRect(t.x * gridWidth, t.y * gridWidth, 100, 100); 
		
		if(checkCollide(t) == false) {
			if(t.who == true) {
				t.x++;
			}
		} 
	}
}

function updateProjectile() {
	var context = canvas.getContext("2d");
	var t = projectileArray[i];
	
	
}

function circleUpdate() {
	for(var i = 0; i<circleArray.length; i++) {
		if(checkCollide(circleArray[i]) == false) {
			if(circleArray[i].x - 1 < 0) {
				gameOver();
				break;
			} else {
				circleArray[i].x -= 1;
			}
		}
	}
}



function drawSquareUnits() {
	for(var i = 0; i < squareArray.length; i++) {
		let newSquare = squareArray[i];
		if(newSquare == null) { continue; }
		context.fillStyle = newSquare.color;
		context.fillRect(newSquare.x,newSquare.y,newSquare.size,newSquare.size);
	}
}
function drawCircleUnits() {
	var canvas = document.getElementById("gameCanvas");

	var context = canvas.getContext("2d");
	for (var i = 0; i < circleArray.length; i++) {
			let newCircle = circleArray[i];
			if(newCircle == null) { continue; }
			context.fillStyle = newCircle.color;
			context.beginPath();
			context.arc(newCircle.x, newCircle.y, newCircle.radius, 0, 2*Math.PI, false);
			context.fill();
			
	}
}

function drawSquareUnit(object) {
	let newSquare = squareList[object.typeId];
	if(newSquare == null) { continue; }
	context.fillStyle = newSquare.color;
	context.fillRect(newSquare.x,newSquare.y,newSquare.size,newSquare.size);
}

function updateAll() {
	var canvas = document.getElementById("gameCanvas");

	var context = canvas.getContext("2d");
	
	upd = setInterval(update,300,context);
}

/*

function hover(object) {
	
	
}

*/

function unhover(object) {
	var ctx = document.getElementById("myCanvas");
	
	ctx.beginPath();
	ctx.moveTo(object.x, object.y);
	ctx.lineTo(object.x - 10, object.y - 10);
	ctx.lineTo(object.x - 10, object.y + 10);
	ctx.lineTo(object.x + 10,  object.y - 10);
	ctx.lineTo(object.x + 10,  object.y + 10);
	ctx.strokeStyle = "black";
	ctx.stroke();
	
	
}



function selectTheSquare(object) {
	var ctx = document.getElementById("myCanvas");
	
	ctx.beginPath();
	ctx.moveTo(object.x - 10, object.y - 10);
	ctx.lineTo(object.x - 10, object.y - 10);
	ctx.lineTo(object.x - 10, object.y + 10);
	ctx.lineTo(object.x + 10,  object.y - 10);
	ctx.lineTo(object.x + 10,  object.y + 10);
	ctx.strokeStyle = "yellow";
	ctx.stroke();
}

let gridLoc = {
	x: 0,
	y: 0,
}

var prevGrid = Object.create(gridLoc);

// function getPosition(event) {
	// var x = event.x;
	// var y = event.y;
	
	// var canvas = document.getElementById("gameCanvas");
	// if(x <= maxGridX && x >= minGridX && y <= maxGridY && y >= minGridY) {
		// if(selectedSquare) {
			// let gridVal = getGrid(x,y);
			// var gridd = Object.create(gridLoc);
			// if (gridVal > 18) {
				// gridd.y = 2;
			// } else if (gridVal > 9) {
				// gridd.y = 1;
			// } else {
				// gridd.y = 0;
			// }
			// gridd.x = gridVal-(9*gridd.y);
			
			// if(gridd != prevGrid) {
				// unhover(prevGrid);
			// }
			// hover(gridd);
			
			// prevGrid = gridd;
		// }
	// } else {
		// for(var i = 0; i < selectionArray.length; i++) {
			// if(x >= selectionArray[i].coordX && x <= selectionArray[i].coordX + gridWidth && y >= selectionArray[i].coordY && y <= selectionArray[i].coordY + gridWidth) {
				// if(!selectedSquare) {
					// hover(selectionArray[i]);
				// }
			// }
		// }	
	// }
// }

function keysPressed(event) {
	if(readyToContinue)
		if (event.keyCode == 32){
			readyToContinue = false;
			if(waveNum < 6) {
				newWave();
		
		}
	}
}

var lastSelected = Object.create(gridLoc);

function getMouseClickPosition(event) {
	if(!selectedSquare) {
		for(var i = 0; i < selectionArray.length; i++) {
			if(x >= selectionArray[i].coordX && x <= selectionArray[i].coordX + gridWidth && y >= selectionArray[i].coordY && y <= selectionArray[i].coordY + gridWidth) {
				unhover(prevGrid);
				if(numTriangles - squareList[selectionArray[i]].cost >= 0) {
					numTriangles -= squareList[selectionArray[i]].cost;
				}
				selectTheSquare(selectionArray[i]);
				lastSelected.x = selectionArray[i].coordX;
				lastSelected.y = selectionArray[i].coordY;
			}
		}	
	} else {
		
	}
}

/*Gameplay*/
function playGame() {
  clearScreen();
  newWave();
  drawCircleUnits();
  drawSquareUnits();
  
  updateAll();
  
}




