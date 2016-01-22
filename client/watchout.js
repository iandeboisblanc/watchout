// start slingin' some d3 here.
var gameOptions = { 
  height: '450px',
  width: '700px',
  nEnemies: '30px',
  padding: '20px'
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

var enemies = [[10,10],[20,40],[40,80]];

d3.select('.gameBoard').selectAll('circle')
  .data(enemies).enter()
  .append('circle').attr('class','enemy')
  .attr('cx', function(d){return axes.x(d[0]);})
  .attr('cy', function(d){return axes.y(d[1]);})
  .attr('r', 5); //could come back and make styling data-dependent

