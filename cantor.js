  /* Cantor Set
   *
   * Input: Line segment
   *  f_1(X): (1/3)X
   *  f_2(X): (1/3)X + (2/3)X[0]
   *
   */

var yDelta = 50
const ratio = .666
var steps = 7

var t = (duration) => d3.transition().duration(duration).ease(d3.easeLinear)

function gasket (coords) {

}


var cantor_start = { x1 : 0, y1 : 0, x2 : 1000, y2 : 0 }
var cantor_coords = [cantor_start]

function cantor (coords) {
  var lines = d3.select('svg.cantor').selectAll('line')
    .data(coords)
  
  lines.enter()
    .append('line')
      .attr('stroke-width', 2)
      .attr('stroke', 'black')
    .merge(lines)
      .transition(t)
      .attr('x1', (d) => d.x1)
      .attr('y1', (d) => d.y1)
      .attr('x2', (d) => d.x2)
      .attr('y2', (d) => d.y2)

  coords.forEach((d) => {
    coords.push({
      x1: d.x1 + ratio*(d.x2-d.x1),
      x2: d.x2,
      y1: d.y1,
      y2: d.y2
    })
    d.x2 = d.x2 - ratio*(d.x2-d.x1)
  })
}

var timer = d3.interval(() => {
  if (steps <= 0) return
  steps--
  cantor(cantor_coords)
}, 1000)
