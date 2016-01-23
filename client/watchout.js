// start slingin' some d3 here.
var gameOptions = { 
  height: '450px',
  width: '700px',
  nEnemies: '30px',
  padding: '20px',
  stepInterval: 10, // miliseconds 
};

var gameStats = {
  score: 0,
  bestScore: 0
};

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var gameBoard = d3.select('.board').append('svg:svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height)
                .attr('class','gameBoard');

var sv = 0.01;
var enemies = [ {xPos:10, yPos:10, xVel: sv, yVel: sv},
                {xPos:20, yPos:40, xVel: sv, yVel: sv},
                {xPos:40, yPos:80, xVel: sv, yVel: sv},
              ];

var integrateVelocity = function(enemy, xOrY) {
  enemy[xOrY + "Pos"] += enemy[xOrY + "Vel"] * gameOptions.stepInterval;
  return enemy[xOrY + 'Pos'];
};

var bounceOffWalls = function(enemy, xOrY) {
  if(enemy[xOrY + 'Pos'] > 100 || enemy[xOrY + 'Pos'] < 0) {
    enemy[xOrY + 'Vel'] *= -1; 
  }
};

var updatePosition = function(enemy, xOrY) {
  integrateVelocity(enemy, xOrY);
  bounceOffWalls(enemy, xOrY);  
  return axes[xOrY](enemy[xOrY + 'Pos']);
};

var update = function() {
  //updateEnemies
  var enemiesSelection = d3.select('.gameBoard').selectAll('circle')
    .data(enemies);
    

  enemiesSelection.enter()
    .append('circle').attr('class','enemy');

  enemiesSelection.attr('cx', function(d){
      return updatePosition(d, 'x');})
    .attr('cy', function(d){
      return updatePosition(d, 'y');})
    .attr('r', 5); //could come back and make styling data-dependent

  enemiesSelection.exit().remove();
  //updatePlayer()
};

setInterval(update, gameOptions.stepInterval);
