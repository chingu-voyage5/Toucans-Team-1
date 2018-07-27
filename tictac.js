var origBoard;
const huPlayer = '0';
const aiPlayer = 'X';
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
];
const cells = document.querySelectorAll('.cell');

startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] == 'number') {
    turn(square.target.id, huPlayer);
    if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player)
  if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

var youWin = 0;
var machineWin = 0;

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? "blue" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.player == huPlayer ? youWin++ : machineWin++);//According to who won, the variable increases
  scorePoints = document.getElementById("scoreBoard");//put scoreBoard in tictac.html
  scorePoints.innerHTML = youWin + " - " + machineWin;

  declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
  stop_timer();
}
function resetScore() {
  scorePoints = document.getElementById("scoreBoard");//put scoreBoard in tictac.html
  youWin = 0;
  machineWin = 0;
  scorePoints.innerHTML = youWin + " - " + machineWin;
  visor = document.getElementById("clock");
  sg = 0;
  cs = 0;
  visor.innerHTML = sg + " 0: 0" + cs;
  document.getElementById('showTable').style.display = "none";
  document.getElementById('showFakeTable').style.display = "block";

}
function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
  stop_timer();
}

function emptySquares() {
  return origBoard.filter(s => typeof s === 'number');
}
/*
function bestSpot() {
  return emptySquares()[0];
}
*/
function bestSpot(){
  return minimax(origBoard,aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner("Tie Game!")
    stop_timer();
    return true;
  }
  return false;
}


//change text on button play
var valor = true
function FbotonOn() {
  var uno = document.getElementById('botonOn');
  valor ? uno.innerText = "Play again" : uno.innerText = "Play";
  // valor=!valor//always keep on false for show play again after clic de 1 time
}

function minimax(newBoard, player){
  var availSpots = emptySquares();

  if(checkWin(newBoard,huPlayer)){
    return{score : -10};
  }else if(checkWin(newBoard,aiPlayer)){
    return{score : 10};
  }else if((availSpots.length === 0)){
    return{score : 0};
  }
  var moves=[];
  for(var i = 0; i < availSpots.length; i++){
    var move ={};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if(player == aiPlayer){
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    }else{
      var result = minimax(newBoard,aiPlayer);
      move.score = result.score;
    }
    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }

  var bestMove;
  if(player === aiPlayer){
     var bestScore = -10000;
     for(var i = 0;i < moves.length; i++){
       if(moves[i].score > bestScore){
         bestScore = moves[i].score;
         bestMove = i;
       }
     }
  }else{
    var bestScore = 10000;
    for(var i = 0;i < moves.length;i++){
      if(moves[i].score < bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}



/////TIMER//////
window.onload = function () {

  visor = document.getElementById("clock"); //locate clock screen
  //starts variables:
  var cro = 0; //Initial status of the chronometer.


}
//Starts the chrono
function start_time() {
  ini = new Date() //Date at the start moment
  clock = setInterval(time, 10); //timer function.
}
//timer function			
function time() {
  current = new Date(); //fecha a cada instante
  cro = current - ini; //milliseconds elapsed.
  cr = new Date(); // passed the num. from milliseconds to date object.
  cr.setTime(cro);
  //get the diferent formats of dates
  cs = cr.getMilliseconds(); //milisegundos 
  cs = cs / 10; //to hundredths of seconds.
  cs = Math.round(cs); //Round the hundredths
  sg = cr.getSeconds(); //seconds 
  mn = cr.getMinutes(); //minutes


  if (cs < 10) { cs = "0" + cs; }
  if (sg < 10) { sg = "0" + sg; }
  if (mn < 10) { mn = "0" + mn; }
  //put the result on the visor		 
  visor.innerHTML = sg + " : " + cs;
}
//Stops the clock
function stop_timer() {
  clearInterval(clock); //stops the chrono
}
function showDiv() {
  document.getElementById('showTable').style.display = "block";
  document.getElementById('showFakeTable').style.display = "none";

}