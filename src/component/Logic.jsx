import React, { useState } from 'react'

export default function Logic(props) {
 //board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context; 

//players
let playerWidth = 85; 
let playerHeight = 12;
let playerVelocityX = 10; 

let player = {
    x : boardWidth/2 - playerWidth/2,
    y : boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX : playerVelocityX
}

//ball
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3; 
let ballVelocityY = 2; 

let ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    width: ballWidth,
    height: ballHeight,
    velocityX : ballVelocityX,
    velocityY : ballVelocityY
}

//blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8; 
let blockRows = 3; //add more as game goes on
let blockMaxRows = 10; //limit how many rows
let blockCount = 0;

//starting block corners top left 
let blockX = 15;
let blockY = 45;

let score = 0;
let gameOver = false;

window.onload =() => {
    board = document.querySelector(".board");
   board.height = boardHeight
   board.width = boardWidth

    context = board.getContext("2d"); //used for drawing on the board

    //fordrawing platfrom
    // context.fillStyle="red";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);   //this request to the browser to call animation for that given function
    document.addEventListener("keydown", movePlayer);

    //create blocks
    createBlocks();
}

let update = () => {
    requestAnimationFrame(update);
    //stop drawing
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // player
    context.fillStyle = "skyblue";
    context.fillRect(player.x, player.y, player.width, player.height);

    // ball
    context.fillStyle = "white";
    // context.shadowColor = "black";

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);


    //bounce 
    if (topCollision(ball, player) || bottomCollision(ball, player)) {
        ball.velocityY *= -1;   
    }
    else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        ball.velocityX *= -1;
    }

    if (ball.y <= 0) { 
        // if ball touches top of canvas
        ball.velocityY *= -1; //reverse direction
    }
    else if (ball.x <= 0 || (ball.x + ball.width >= boardWidth)) {
        // if ball touches left or right of canvas
        ball.velocityX *= -1; //reverse direction
    }
    else if (ball.y + ball.height >= boardHeight) {
        // if ball touches bottom of canvas
        context.font = "22px sans-serif";
        
        context.fillText("Game Over your score is" , 80, 400);
        // context.fillStyle = "red"
        
        context.fillText(  score , 330, 400);

       

        context.fillText('Press space to play again' ,  90 , 430 )


        gameOver = true;
    }
    

    //blocks
    context.fillStyle = "dfbbb1";
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                block.break = true;     // block is broken
               
                ball.velocityY *= -1;   // flip y direction up or down
                score += 100;
                blockCount -= 1;
             
               
            }
            else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                block.break = true;
                
                ball.velocityX *= -1;   // flip x direction left or right
                score += 100;
                blockCount -= 1;
                
                
                
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    
   

    //next level
    if (blockCount == 0) {
        alert('new level')
        score += 100*blockRows*blockColumns; //bonus points :)
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        ball.velocityX++;
        ball.velocityY++;
        createBlocks();
        
    }

    //score
    context.font = "20px sans-serif";
    context.fillText(score, 8, 25);
}

let outOfBounds = (xPosition)  => {
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}
let  movePlayer =(e) => {
    if (gameOver) {
        if (e.code == "Space") {
            resetGame();
           
        }
        return;
    }
    if (e.code == "ArrowLeft") {
        // player.x -= player.velocityX;
        let nextplayerX = player.x - player.velocityX;
        if (!outOfBounds(nextplayerX)) {
            player.x = nextplayerX;
        }
    }
    else if (e.code == "ArrowRight") {
        let nextplayerX = player.x + player.velocityX;
        if (!outOfBounds(nextplayerX)) {
            player.x = nextplayerX;
        }
        
    }
}

let detectCollision =(a , b) => {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

let topCollision = (ball, block) => { //a is above b (ball is above block)
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

let bottomCollision = (ball, block) => { //a is above b (ball is below block)
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

let leftCollision = (ball, block) => { //a is left of b (ball is left of block)
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

let rightCollision = (ball, block) => { //a is right of b (ball is right of block)
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

let createBlocks = () => {
    blockArray = []; //clear blockArray
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x : blockX + c*blockWidth + c*10, //c*10 space 10 pixels apart columns
                y : blockY + r*blockHeight + r*10, //r*10 space 10 pixels apart rows
                width : blockWidth,
                height : blockHeight,
                break : false
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

let resetGame = () => {
    gameOver = false;
    player = {
        x : boardWidth/2 - playerWidth/2,
        y : boardHeight - playerHeight - 5,
        width: playerWidth,
        height: playerHeight,
        velocityX : playerVelocityX
    }
    ball = {
        x : boardWidth/2,
        y : boardHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX : ballVelocityX,
        velocityY : ballVelocityY
    }
    blockArray = [];
    blockRows = 3;
    score = 0;
    createBlocks();
}

  return (
    <>

<canvas className={`board my-3 `}></canvas>


          </>
  )
}
