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

String.prototype.px2num = function() {
  return +this.slice(0,-2);
};

gameOptions.numHeight = gameOptions.height.px2num();
gameOptions.numWidth = gameOptions.width.px2num();

var gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0
};

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var numericAxes = {
  x: function(val) { return axes.x(val).px2num(); },
  y: function(val) { return axes.y(val).px2num(); },
};

var invertAxes = {
  x: d3.scale.linear().domain([0,gameOptions.numWidth]).range([0,100]),
  y: d3.scale.linear().domain([0,gameOptions.numHeight]).range([0,100])
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

d3.select('.centered')
  .style('width', gameOptions.width);

var enemies = [{x:100*random(), y:100*random(), colliding: false}];

var drag = d3.behavior.drag()
    .on("drag", function(d){
      var x = d3.event.x;
      var y = d3.event.y;
      d.x = max(0, min(invertAxes.x(x), 100));
      d.y = max(0, min(invertAxes.y(y), 100));
      d3.select(this)
      .attr("cx", max(d.r, min(gameOptions.numWidth - d.r, x)))
      .attr("cy", max(d.r, min(gameOptions.numHeight - d.r, y)));
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
    if(!enemy.colliding){
      checkForCollisions(enemy);
    }
    //have new positions
    var midX = startX + (endPosition.x - startX) * t;
    var midY = startY + (endPosition.y - startY) * t;
    //set attr
    enemy.attr('x', axes.x(midX))
          .attr('y', axes.y(midY));
    enemy.style('animation-duration', (4*Math.abs(t - 0.5) + 2)+ 's');
  };
};

var checkForCollisions = function (enemy) {
  var playerD = d3.select('.player').datum();
  var enemyD = {x: enemy.attr('x').px2num(),
                y: enemy.attr('y').px2num()}; //calc distance
  var distance = sqrt(pow((numericAxes.x(playerD.x) - enemyD.x),2) + pow((numericAxes.y(playerD.y) - enemyD.y),2));
  //if distance < sum of radii
  if(distance < gameOptions.playerRadius + gameOptions.enemyRadius) {
    enemies = [];
    //remove cycle here.
    gameStats.collisions++;
    gameStats.bestScore = max(gameStats.bestScore, gameStats.score);
    gameStats.score = 0;
    enemy.colliding = true;
    addEmeny();
    setTimeout(function(){enemy.colliding = false;}, 500);
  }
};

var update = function() {
  //updateEnemies
  var enemiesSelection = d3.select('.gameBoard').selectAll('.enemy')
    .data(enemies);
  enemiesSelection.enter()
    .append('image')
    .attr('class','enemy')
    .attr('x', function(d) { return axes.x(d.x); })
    .attr('y', function(d) { return axes.y(d.y); })
    .attr('xlink:href','shuriken.png')
    .attr('height', 2*gameOptions.enemyRadius)
    .attr('width', 2*gameOptions.enemyRadius);
  enemiesSelection
    .transition()
    .duration(gameOptions.stepInterval)
    .tween('custom', tweenWithCollisionDetection);
  enemiesSelection.exit()
    .remove();
};

var addEmeny = function() {
  enemies.push({x:100*random(), y:100*random(), colliding:false});
};

update();
setInterval(update, gameOptions.stepInterval);
setInterval(function() {
  gameStats.score++;
  if(!(gameStats.score % 50) || !enemies.length) {
     addEmeny();
  }
  d3.select('.scoreboard')
    .selectAll('span')
    .data([gameStats.bestScore, gameStats.score, gameStats.collisions])
    .text(function(d){return d;});
},gameOptions.stepInterval/10);
 
setInterval(function(){
  d3.select('.gameBoard')
    .data(player)
    .transition()
    .duration(1)
    .style('background-color', function(d){
      var r = sqrt(pow(d.x - 50,2) + pow(d.y - 50,2)) * 250/(50*sqrt(2));
      var g = d.x*250/100;
      var b = d.y*250/100;
      return 'rgb(' + r + ',' + g + ',' + b +')';
    });
}, 1);











