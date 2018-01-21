function hasCurrentShapeLanded(){
    //return true if space directly under currentShape is occupied
    //or there is no board under the shape
    return ((currentShape.row +1) == boardHeight ||
    (board[currentShape.row +1][currentShape.col] == 1));
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

function clearPrevious(){
    //removes currentShape from where it was before
    drawSquare(prevShapeX, prevShapeY, bgColor, gridColor);
    //drawEmptySquare(prevShapeX,prevShapeY,gridColor);
    
}
function drawCurrent(dt){
    drawSquare(shapeX, shapeY, currentShape.color);
}

function moveCurrentDown(dt){
    var yDif = Math.floor(blockSpeed * dt);
    prevShapeY = shapeY;
    shapeY += yDif;
    //console.log("shY ",shapeY);
    if(shapeY % squareSide == 0){
        //shape has changed rows, mark that
        currentShape.row ++;
    }
}

function render(dt){
    clearPrevious();   
    drawCurrent(dt);
       
}

function update(dt){
    switch(gameState){
        case gameStates[0]: //fallen
            //check if there is no space left for the next shape
            if(isSpaceForNewShape()){
                console.log("new shape!");
                //keep playing
                //create a new shape
                var newShape = {row: 0,
                            col: Math.floor(boardWidth/2),
                            color:colors[0]};
                
                shapeX = squareSide * Math.floor(boardWidth/2);
                shapeY = 0;

                prevShapeX = shapeX;
                prevShapeY = 0;
                
                //set it as current
                currentShape = newShape;
                
                
                //draw it
               // drawCurrent();

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
//                clearPrevious();             
                moveCurrentDown(dt);
                //drawCurrent();     
            }
                  

        break;
        case gameStates[2]: //gameOver
            afterGameOver();
        break;
    }
}


function setup(){
    createBoardArray();
    drawBoard();
    gameState = gameStates[0];
}

//based on https://codeincomplete.com/posts/javascript-game-foundations-the-game-loop/
function frame(){
    now   = timestamp();
    dt    = (now - last) / 1000;    // duration in seconds
    update(dt);
    render(dt);
    last = now;
    requestAnimationFrame(frame);//request the next frame
}

setup();
requestAnimationFrame(frame); //start the first frame