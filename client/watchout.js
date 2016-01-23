// start slingin' some d3 here.
var gameOptions = { 
  height: '450px',
  width: '700px',
  nEnemies: '30px',
  padding: '20px',
  stepInterval: 1000, // miliseconds 
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

var enemies = [ {x:10, y:10},
                {x:20, y:40},
                {x:40, y:80},
              ];

var drag = d3.behavior.drag()
    .on("drag", function(d){
      var x = d3.event.x;
      var y = d3.event.y;
      d3.select(this)
      .attr("cx", Math.max(d.r, Math.min(+gameOptions.width.slice(0,-2) - d.r, x)))
      .attr("cy", Math.max(d.r, Math.min(+gameOptions.height.slice(0,-2) - d.r, y)));
    });

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


var updatePosition = function(d) {
  d.x = Math.random()*100;
  d.y = Math.random()*100;
};

var tweenWithCollisionDetection = function(endPosition) {
  var enemy = d3.select(this);
  var startX = enemy.datum().x;
  var startY = enemy.datum().y;
  updatePosition(enemy.datum());

  return function(t) {
    //checkforCollisions
    //checkforCollisions();
    //have new positions
    var midX = startX + (endPosition.x - startX) * t;
    var midY = startY + (endPosition.y - startY) * t;
    //set attr
    enemy.attr('cx', axes.x(midX))
          .attr('cy', axes.y(midY));
  };
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
    .attr('class','enemy')
    .attr('r', 5); //could come back and make styling data-dependent
  enemiesSelection
    .transition()
    .duration(gameOptions.stepInterval)
    .tween('custom', tweenWithCollisionDetection);
    // .attr('cx', function(d){
    //   return updatePosition(d, 'x');})
    // .attr('cy', function(d){
    //   return updatePosition(d, 'y');});
  enemiesSelection.exit()
    .remove();
  //updatePlayer()
};

update();
setInterval(update, gameOptions.stepInterval);
