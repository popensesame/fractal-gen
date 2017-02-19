/* Cantor Set
 *
 * Input: Line segment
 *  f_1(X): (1/3)X
 *  f_2(X): (1/3)X + (2/3)X[0]
 *
 */

const yDelta = 50
const num_iterations = 8
const initial_coords = { x1 : 0, y1 : 0, x2 : 1000, y2 : 0 }

function cantor (steps=num_iterations, coords=initial_coords) {
  if (steps <= 0) return
  steps--
  make_line(coords)
  cantor(steps, transform(coords, true))
  cantor(steps, transform(coords, false))
}

function transform (coords, shift_right=false, shift_down=true) {
  let x1 = coords.x1, x2 = coords.x2, y1 = coords.y1, y2 = coords.y2
  return {
    x1: shift_right ? x1 + (2/3)*(x2-x1) : x1,
    y1: shift_down  ? y1 + yDelta : y1,
    x2: shift_right ? x2 : x2 - (2/3)*(x2-x1),
    y2: shift_down  ? y2 + yDelta : y2
  }
}

function make_line (coords) {
  d3.select('svg').append('line')
    .attr('x1', coords.x1)
    .attr('y1', coords.y1)
    .attr('x2', coords.x2)
    .attr('y2', coords.y2)
    .attr('stroke-width', 2)
    .attr('stroke', 'black')
}

