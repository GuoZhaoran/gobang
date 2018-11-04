var chessboard = document.getElementById('chessboard');
var context = chessboard.getContext('2d');
var curColor = 'white', gameOver = false;            //当前棋子颜色和游戏状态
var wins = [], personWin = [], computerWin = [],chessManStatus = [], winCount = 0;       //所有获胜的数量和数量统计
for(var i=0;i<15;i++) {
    wins[i] = []; chessManStatus[i] = [];
    for(var j=0;j<15;j++) {
        wins[i][j] = []; chessManStatus[i][j] = 0;
    }
}
for(var i=0;i<15;i++) {
    for(var j=0;j<11;j++) {
        for(var k=0;k<5;k++){
           wins[i][j+k][winCount] = true;
        }
        winCount++;
    }
}
for(var i=0;i<15;i++) {
    for(var j=0;j<11;j++) {
        for(var k=0;k<5;k++){
            wins[j+k][i][winCount] = true;
        }
        winCount++;
    }
}
for(var i=0;i<11;i++) {
    for(var j=0;j<11;j++) {
        for(var k=0;k<5;k++){
            wins[i+k][j+k][winCount] = true;
        }
        winCount++;
    }
}
for(var i=0;i<11;i++) {
    for(var j=14;j>3;j--) {
        for(var k=0;k<5;k++){
            wins[i+k][j-k][winCount] = true;
        }
        winCount++;
    }
}
for(var i=0; i<winCount; i++) {
    personWin[i] = 0; computerWin[i] = 0;
}
context.strokeStyle = "#BFBFBF";   //设置线条颜色
function drawChessBoard() {  //绘制棋盘
    for(var i=0; i<15; i++) {
        //横线条
        context.moveTo(20 + i*40, 20);
        context.lineTo(20 + i*40, 580);
        context.stroke();
        //竖线条
        context.moveTo(20, 20 + i*40);
        context.lineTo(580, 20 + i*40);
        context.stroke();
    }
}
function drawChessMan(i, j) {      //绘制棋子
    context.beginPath();
    context.arc(20 + i*40, 20 + j*40, 18, 0, 2*Math.PI);
    context.closePath();
    var gradient = context.createRadialGradient(23 + i*40, 17 + j*40, 18, 23 + i*40, 17 + j*40, 0);
    if(curColor === 'white') {
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
    }
    if(curColor === 'black') {
        gradient.addColorStop(0, "#0A0A0A");
        gradient.addColorStop(1, "#636766");
    }
    context.fillStyle = gradient;
    context.fill();
    curColor = (curColor === 'white') ? 'black' : 'white';
}
function computerAI() {      //电脑智能下棋
    var personScore = [],computerScore = [],maxScore = 0,curX = 0, curY = 0;
    for(var i=0; i<15; i++) {
       personScore[i] = [];computerScore[i] = [];
       for(var j=0; j<15; j++) {
           personScore[i][j] = 0;computerScore[i][j] = 0;
       }
    }
    for(var i=0; i<15; i++) {
        for(var j=0; j<15; j++) {
            if(chessManStatus[i][j] == 0) {
                for(var k=0; k<winCount; k++) {
                    if(wins[i][j][k]) {
                        if(personWin[k] == 1 || personWin[k] == 2 || personWin[k] == 3 || personWin[k] == 4) {
                            personScore[i][j] += personWin[k]*personWin[k] * 200;
                        }
                        if(computerWin[k] == 1 || computerWin[k] == 2 || computerWin[k] == 3 || computerWin[k] == 4) {
                            computerScore[i][j] += (computerWin[k]*computerWin[k] - 1) * 200 + 399;
                        }   
                    }
                }
                if(personScore[i][j] > maxScore) {
                    maxScore = personScore[i][j];
                    curX = i;
                    curY = j;
                }else if(personScore[i][j] == maxScore) {
                    if(computerScore[i][j] > computerScore[curX][curY]) {
                        curX = i;
                        curY = j;
                    }
                }
                if(computerScore[i][j] > maxScore) {
                    maxScore = computerScore[i][j];
                    curX = i;
                    curY = j;
                }else if(computerScore[i][j] == maxScore) {
                    if(personScore[i][j] > personScore[curX][curY]) {
                        curX = i;
                        curY = j;
                    }
                }
            }
        }
    }
    drawChessMan(curX, curY);
    chessManStatus[curX][curY] = 2;
    for(var k=0; k<winCount; k++) {
      if(wins[curX][curY][k]) {
          computerWin[k]++;
          personWin[k] = 6;
          if(computerWin[k] == 5) {
              alert('电脑赢了!');
              gameOver = !gameOver;
          }
      }
    }
  }

//鼠标落下，画棋子
chessboard.onclick = function(e) {
    e.preventDefault();
    if(gameOver) {
        return;
    }
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 40);
    var j = Math.floor(y / 40);
    if(chessManStatus[i][j] === 0) {
        drawChessMan(i, j);
        chessManStatus[i][j] = (curColor === 'white') ? 1 : 2;
        for(var k=0; k<winCount; k++) {
            if(wins[i][j][k]) {
                personWin[k]++;
                computerWin[k] = 6;
                if(personWin[k] == 5) {
                    gameOver = !gameOver;
                    alert('你赢了!');
                }
            }
        }
        if(!gameOver) computerAI();
    }
}
drawChessBoard();