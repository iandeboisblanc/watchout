// start slingin' some d3 here.
var gameOptions = { 
  height: '450px',
  width: '700px',
  nEnemies: '30px',
  padding: '20px',
  stepInterval: 1000, // miliseconds 
  playerRadius: 30,
  enemyRadius: 15
};

var gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0
};

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var invertAxes = {
  x: d3.scale.linear().domain([0,+gameOptions.width.slice(0,-2)]).range([0,100]),
  y: d3.scale.linear().domain([0,+gameOptions.height.slice(0,-2)]).range([0,100])
};

var random = Math.random;
var pow = Math.pow;
var max = Math.max;
var min = Math.min;
var sqrt = Math.sqrt;

var gameBoard = d3.select('.board').append('svg:svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height)
                .attr('class','gameBoard');

var enemies = [ {x:10, y:10},
                {x:20, y:40},
                {x:40, y:80},
              ];

var drag = d3.behavior.drag()
    .on("drag", function(d){
      var x = d3.event.x;
      var y = d3.event.y;
      d.x = invertAxes.x(x);
      d.y = invertAxes.y(y);
      d3.select(this)
      .attr("cx", max(d.r, min(+gameOptions.width.slice(0,-2) - d.r, x)))
      .attr("cy", max(d.r, min(+gameOptions.height.slice(0,-2) - d.r, y)));
    });

var player = [{x:50, y:50, r:gameOptions.playerRadius}];

d3.select('.gameBoard').selectAll('.player')
  .data(player)
  .enter()
  .append('circle')
  .attr('class','player')
  .attr('cx', function(d){return axes.x(d.x);})
  .attr('cy', function(d){return axes.y(d.y);})
  .attr('r', function(d){return d.r;})
  .call(drag);


var updatePosition = function(d) {
  d.x = random()*100;
  d.y = random()*100;
};

var tweenWithCollisionDetection = function(endPosition) {
  var enemy = d3.select(this);
  var startX = enemy.datum().x;
  var startY = enemy.datum().y;
  updatePosition(enemy.datum());
  return function(t) {
    //check for collisions
    checkForCollisions(enemy);
    //have new positions
    var midX = startX + (endPosition.x - startX) * t;
    var midY = startY + (endPosition.y - startY) * t;
    //set attr
    enemy.attr('cx', axes.x(midX))
          .attr('cy', axes.y(midY));
  };
};

var checkForCollisions = function (enemy) {
  var playerD = d3.select('.player').datum();
  var enemyD = {x: +(enemy.attr('cx').slice(0,-2)),
                y: +(enemy.attr('cy').slice(0,-2))}; //calc distance
  var distance = sqrt(pow(+(axes.x(playerD.x).slice(0,-2) - enemyD.x),2) + pow(+(axes.y(playerD.y).slice(0,-2) - enemyD.y),2));
  //if distance < sum of radii
  if(distance < gameOptions.playerRadius + gameOptions.enemyRadius) {
    gameStats.collisions++;
    gameStats.bestScore = max(gameStats.bestScore, gameStats.score);
    gameStats.score = 0;
  }
};

var update = function() {
  //updateEnemies
  var enemiesSelection = d3.select('.gameBoard').selectAll('.enemy')
    .data(enemies);
  enemiesSelection.enter()
    .append('circle')
    .attr('class','enemy')
    .attr('cx', function(d) { return axes.x(d.x); })
    .attr('cy', function(d) { return axes.y(d.y); })
    .attr('r', gameOptions.enemyRadius); //could come back and make styling data-dependent
  enemiesSelection
    .transition()
    .duration(gameOptions.stepInterval)
    .tween('custom', tweenWithCollisionDetection);
  enemiesSelection.exit()
    .remove();
};

update();
setInterval(update, gameOptions.stepInterval);
setInterval(function() {
  gameStats.score++;
  d3.select('.scoreboard')
    .selectAll('span')
    .data([gameStats.bestScore, gameStats.score, gameStats.collisions])
    .text(function(d){return d;});
},gameOptions.stepInterval/10);
