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

var drag = d3.behavior.drag()
    .origin(function(d) { 
      var boardCoords = d3.select('body').selectAll('.gameBoard')[0][0].getBoundingClientRect();
      return {x:8, y:62};})
    .on("drag", dragmove);

var player = [{x:50, y:50, r:10}];

d3.select('.gameBoard').selectAll('.player')
  .data(player)
  .enter()
  .append('circle')
  .attr('class','player')
  .attr('cx', function(d){return axes.x(d.x);})
  .attr('cy', function(d){return axes.y(d.y);})
  .attr('r', function(d){return d.r;})
  .call(drag);

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



function dragmove(d) {
  var x = d3.event.x;
  var y = d3.event.y;
  d3.select(this)
      .attr("cx", Math.max(d.r, Math.min(+gameOptions.width.slice(0,-2) - d.r, event.x))-8)
      .attr("cy", Math.max(d.r, Math.min(+gameOptions.height.slice(0,-2) - d.r, event.y))-62);
}

var update = function() {
  //updateEnemies
  var enemiesSelection = d3.select('.gameBoard').selectAll('.enemy')
    .data(enemies);
  enemiesSelection.enter()
    .append('circle')
    .attr('class','enemy');
  enemiesSelection.attr('cx', function(d){
      return updatePosition(d, 'x');})
    .attr('cy', function(d){
      return updatePosition(d, 'y');})
    .attr('r', 5); //could come back and make styling data-dependent
  enemiesSelection.exit()
    .remove();
  //updatePlayer()
};

setInterval(update, gameOptions.stepInterval);
