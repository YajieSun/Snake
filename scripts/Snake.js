$(document).ready(function(){
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 400;
  var stepLength = canvas.width / 50;
  var direction, snakeArray, appleArray, interval, score, difficulty, gaming;
  
  initGame();
  
  function initGame(){
    snakeArray = [];
    appleArray = [];
    direction = 'up';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    score = 0;
    gaming = false;
    $("#score").text("Score: " + score)
    createSnake();
    createApple();
    if (interval) {
      clearInterval(interval);
    }
  };
  
  function createSnake(){
    ctx.fillStyle = "black";
    var snakeInitX = stepLength * 25;
    var snakeInitY = stepLength * 12;
    snakeArray.push({x: snakeInitX, y: snakeInitY});
    ctx.fillRect(snakeInitX, snakeInitY, stepLength, stepLength);
  };
  
  function createApple(){
    var appleX = Math.floor(Math.random() * 50) * stepLength; 
    var appleY = Math.floor(Math.random() * 25) * stepLength;
    var apple = {x:appleX, y:appleY};
    //make sure the new generated apple does not collide with the snake
    while (checkCollision(apple, snakeArray)) {
      appleX = Math.floor(Math.random() * 50) * stepLength;
      appleY = Math.floor(Math.random() * 25) * stepLength;
    };
    ctx.fillStyle = "red";
    ctx.fillRect(appleX, appleY, stepLength, stepLength);
    appleArray.push(apple);
  };
  
  //check if snakeHead is outside canvas or the snakeHead hits snake body. If so, the game ends.
  function gameEnds(snakeHead){
    if (snakeHead.x < 0 || snakeHead.x >= canvas.width || snakeHead.y < 0 
      || snakeHead.y >= canvas.height || checkCollision(snakeHead, snakeArray.slice(1))) {
      return true;
    } else {
      return false;
    }
  };
  
  //check if a square collides with any element of the array
  function checkCollision(square, array){
    for (var i = 0; i < array.length; i++){
      if (square.x === array[i].x && square.y === array[i].y){
        return true;
      }
    }
    return false;
  }
  
  //This function moves the snake and init the game if the game ends
  function updateSnake() {
    //first part: moves the snake one squre ahead by deleting the tail and adding a new head
    var snakeHead = snakeArray[0];
    var snakeTail = snakeArray.pop();
    ctx.clearRect(snakeTail.x, snakeTail.y, stepLength, stepLength);    

    var snakeNewHead = {x: snakeHead.x, y:snakeHead.y};
    switch(direction) {
      case 'up':
        snakeNewHead.y = snakeHead.y - stepLength;
        break;
      case 'down':
        snakeNewHead.y = snakeHead.y + stepLength;
        break;
      case 'left':
        snakeNewHead.x = snakeHead.x - stepLength;
        break;
      case 'right':
        snakeNewHead.x = snakeHead.x + stepLength;
        break;
      default:
        break;
    }
    snakeArray.unshift(snakeNewHead);
    ctx.fillStyle = "black";
    ctx.fillRect(snakeNewHead.x, snakeNewHead.y, stepLength, stepLength);
    
    //second part: check if the snake eats an apple after the move, if it does, add one square to the tail. 
    //The new tail should have the same position as the old tail that was deleted.
    var apple = appleArray[0];
    if (snakeNewHead.x === apple.x && snakeNewHead.y === apple.y){
      score += 10;
      $("#score").text("Score: " + score)
      appleArray.pop();
      snakeArray.push(snakeTail);
      ctx.fillRect(snakeTail.x, snakeTail.y, stepLength, stepLength);
      createApple();
    };
    
    //third part: after updating everything, checks if the game ending condition is met. If it is, ends the game.
    if (gameEnds(snakeNewHead)){
       initGame();
    }
  };
  
  $(document).keydown(function(e){
    if (e.which === 38 && direction != 'down'){
      direction = 'up';
    } else if (e.which === 40 && direction != 'up'){
      direction = 'down';
    } else if (e.which === 37 && direction != 'right'){
      direction = 'left';
    } else if (e.which === 39 && direction != 'left'){
      direction = 'right';
    }
  });
  
  $('#start').click(function() {
    //If the user is playing a game, clicking Start will reset and start the game. 
    //Else if the game is initialized but the user is not playing, just starts the game.
    if (gaming) {
      initGame();
    }
    gaming = true;
    interval = setInterval(updateSnake, 500);
  });
  
});


