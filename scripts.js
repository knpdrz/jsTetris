var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var gameOverMessage = document.getElementById("gameOverMessage");

var colors = ["#FF355E", "#FF9933", "#FFFF66", "#CCFF00", "#50BFE6", "FF6EFF", "FF00CC"];
var gridColor = "white";
var bgColor = "black";

var squareSide = 30;

var blockSpeed = 100; //pixels per second

var boardWidth = canvas.width/squareSide;
var boardHeight = canvas.height/squareSide;

var board = [];

var gameStates = ["fallen", "falling", "gameOver"];
var gameState = gameStates[0];

var currentShape;
var shapeX, shapeY;
var prevShapeX, prevShapeY;

document.addEventListener("keydown", keyDownHandler, false);
var now,
    dt   = 0,
    last = timestamp(),
    step = 1/60;

//player interaction 
function keyDownHandler(e) {
    switch(e.keyCode){
        case 39:
            //right arrow key pressed
            moveCurrentRight();
            break;
        case 37: //left
            moveCurrentLeft();
            break;
        case 38: //up
            //change orientation
            console.log("up!");
            break;
        case 40: //down
            //quick fall

            break;
    }
}

function drawSquare(x, y, color){
    ctx.beginPath();
    ctx.rect(x, y, squareSide, squareSide);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();

}



function setShapeOnBoard(){
    //block has landed, set it on the board
    board[currentShape.row][currentShape.col] = 1;
    console.log("shape added at ",currentShape.row,", ",currentShape.col);
}



function isSpaceForNewShape(){
    //returns true if there is shape for a new shape to start falling
    //TODO will be different with different shapes
    return (board[0][Math.floor(boardWidth/2)] == 0);
}
/*
function loopStep(){
    switch(gameState){
        case gameStates[0]: //fallen
            //check if there is any space left for the next shape
            if(isSpaceForNewShape()){
                //keep playing
                //create a new shape
                var newShape = {row: 0,
                            col: Math.floor(boardWidth/2),
                            color:colors[0]};

                shapeX = Math.floor(boardWidth/2);
                shapeY = 0;
                //set it as current
                currentShape = newShape;

                //draw it
                drawCurrent();

                //set current state to "falling"
                gameState = gameStates[1];
            }else{
                //game over
                gameState = gameStates[2];
            }
 
            
        break;
        case gameStates[1]://faling
            //check if block has reached the bottom of board
            if(hasCurrentShapeLanded()){
                //set shape on the board
                setShapeOnBoard();

                //set state to 'fallen'
                gameState = gameStates[0];
                
            }else{
                //shape is still falling
                //clear current block position
                 //move block down
                //draw it there
                clearPrevious();             
                moveCurrentDown();
                drawCurrent();     
            }
                  

        break;
        case gameStates[2]: //gameOver
            afterGameOver();
        break;
    }
}
*/
function afterGameOver(){
    console.log("after game over");
    gameOverMessage.style.display = "block";
}

function playAgain(){
    //hide game over text
    gameOverMessage.style.display = "none";

    //clear board
    board = [];
    createBoardArray();
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawBoard();

    //set state to fallen
    gameState = gameStates[0];

}

/*-------------setup functions-------------*/
function drawEmptySquare(x, y, color){
    ctx.beginPath();
    ctx.rect(x, y, squareSide, squareSide);
    ctx.strokeStyle = color;
    ctx.lineWidth=1;
    ctx.stroke();
    ctx.closePath();
}

function drawBoard(){
    var x,y; //coords of top left corner of drawn square
    x = 0; y = 0;
    for(var row = 0; row<boardHeight; row++){
        for(var col = 0; col<boardWidth; col++){
            drawEmptySquare(x, y, gridColor);
            x += squareSide;
        }
        y += squareSide; 
        x = 0;
    }
}
function printBoard(){
    console.log("printing");
    for(var row = 0; row<boardHeight; row++){
        console.log(board[row]);
    }       
    console.log("/-----/"); 
}

function createBoardArray(){
    for(var row = 0; row<boardHeight; row++){
        var column = [];
        for(var col = 0; col<boardWidth; col++){
            column.push(0);
        }
        board[row] = column;
    }

}

function playLoop(){
    setInterval(loopStep, 1000);
}

function timestamp() {
    return window.performance && window.performance.now ? 
    window.performance.now() : new Date().getTime();
}
/*------------------------------------------*/
/*----------------main----------------------*/ 
//setup();
//playLoop();
