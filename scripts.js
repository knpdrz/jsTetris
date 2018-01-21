var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var gameOverMessage = document.getElementById("gameOverMessage");

var colors = ["#FF355E", "#FF9933", "#FFFF66", "#CCFF00", "#50BFE6", "FF6EFF", "FF00CC"];
var gridColor = "white";
var bgColor = "black";
var squareSide = 30;

var boardWidth = canvas.width/squareSide;
var boardHeight = canvas.height/squareSide;

var board = [];

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
var gameStates = ["fallen", "falling", "gameOver"];
var gameState = gameStates[0];

var currentShape;

function drawSquare(x, y, color){
    ctx.beginPath();
    ctx.rect(x, y, squareSide, squareSide);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();

}

function clearPrevious(){
    //removes currentShape from where it is now
    var actX = currentShape.row*squareSide;
    var actY = currentShape.col*squareSide;
    drawSquare(actY, actX, bgColor, gridColor);
    drawEmptySquare(actY,actX,gridColor);
    
}

function drawCurrent(){
    var actX = currentShape.row*squareSide;
    var actY = currentShape.col*squareSide;
    drawSquare(actY, actX, currentShape.color);

}

function moveCurrentDown(){
    currentShape.row ++;
}

function canMoveRight(){
    //returns true if position of currentShape can change to right
    //it can if
    //1. shape is still falling and
    //2. there is no shape where currentShape wants to move and
    //3. there is still board where it wants to move
    return ((gameState == gameStates[1])&&
    (currentShape.col +1 < boardWidth) &&
    (board[currentShape.row][currentShape.col +1])== 0);
}

function canMoveLeft(){
    //returns true if position of currentShape can change to left
    //it can if
    //1. shape is still falling and
    //2. there is no shape where currentShape wants to move and
    //3. there is still board where it wants to move
    return ((gameState == gameStates[1])&&(currentShape.col -1 >= 0)&&
        ((board[currentShape.row][currentShape.col-1])== 0));
    
}

function moveCurrentRight(){
    if(canMoveRight()){
        clearPrevious();             
        currentShape.col ++;
        drawCurrent();  
    }         
        
}

function moveCurrentLeft(){
    if(canMoveLeft()){
        clearPrevious();                 
        currentShape.col --;
        drawCurrent();           
    
    }
}

function setShapeOnBoard(){
    //block has landed, set it on the board
    board[currentShape.row][currentShape.col] = 1;
}

function hasCurrentShapeLanded(){
    //return true if space directly under currentShape is occupied
    //or there is no board under the shape
    return ((currentShape.row +1) == boardHeight ||
    (board[currentShape.row +1][currentShape.col] == 1));
}

function isSpaceForNewShape(){
    //returns true if there is shape for a new shape to start falling
    //TODO will be different with different shapes
    return (board[0][Math.floor(boardWidth/2)] == 0);
}

function loopStep(){
    switch(gameState){
        case gameStates[0]: //fallen
            //check if there is no space left for the next shape
            if(isSpaceForNewShape()){
                //keep playing
                //create a new shape
                var newShape = {row: 0,
                            col: Math.floor(boardWidth/2),
                            color:colors[0]};
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
function setup(){
    document.addEventListener("keydown", keyDownHandler, false);
    createBoardArray();
    drawBoard();
}
function playLoop(){
    setInterval(loopStep, 1000);
}
/*------------------------------------------*/
/*----------------main----------------------*/ 
setup();
playLoop();