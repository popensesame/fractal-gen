


var max_steps = 8
var num_iterations
var t_duration = 100
var t = d3.transition().duration(t_duration).ease(d3.easeLinear)
var animating = false
var timer
var repeat

function coords_string (shape) {
  return Object.keys(shape)
    .filter((key) => key !== 'side_length')
    .map((point) => [shape[point].x, shape[point].y].join(','))
    .join(' ')
}


////////////////////// SIERPINSKI GASKET ////////////////////////////////////

var translations = ['up', 'right']
const gasket_ratio = .5

var gasket_start = triangle_coords(0, 500, 500)
var gasket_coords = start_list(gasket_start)

gasket(gasket_coords)

function start_list (start) { return [start] }

function start () {
  num_iterations = parseInt(document.querySelector('.iterations').value)
  step = num_iterations > max_steps ? max_steps : num_iterations

  document.querySelector('.start').disabled = true
  document.querySelector('.stop').disabled = false

  timer = d3.interval(() => {
    if (step < 0) {
      gasket_coords = start_list(gasket_start)
      step = num_iterations
    }
    step--
    gasket(gasket_coords)
  }, 1000)
}

function stop () {
  timer.stop()
  step = num_iterations
  document.querySelector('.start').disabled = false
  document.querySelector('.stop').disabled = true
  gasket_coords = start_list(gasket_start)
  gasket(gasket_coords)
}

function gasket (coords_list) {
  var triangles = d3.select('svg').selectAll('.triangle')
  
  triangles.data(coords_list)
    .enter()
      .append('polygon')
      .attr('class', 'triangle')
    .merge(triangles)
        //.transition(t)
        .attr('points', (shape) => coords_string(shape))
        .attr('fill', 'black')
    .exit()
      .remove()

  coords_list.forEach((shape_coords, index) => {
    Array.prototype.push.apply(coords_list,
      translations.map((direction) => transform_triangle(shape_coords, direction))
    )
    coords_list[index] = transform_triangle(shape_coords)
  })
}

function transform_triangle(coords, direction) {
  var x = coords.left.x,
      y = coords.left.y,
      side_length = gasket_ratio*coords.side_length

  return direction === 'up' ?
    triangle_coords(
      x + (gasket_ratio*side_length),
      y - get_height(x, y, side_length),
      side_length
    )
  : direction === 'right' ?
    triangle_coords(x+side_length, y, side_length)
  : triangle_coords(x, y, side_length)
}

function triangle_coords(x, y, side_length) {
  return {
    side_length: side_length,
    left: { x: x, y: y },
    right: { x: x + side_length, y: y },
    top: {
      x: x + .5*side_length,
      y: y - get_height(x, y, side_length)
    }
  }
}

function get_height(x, y, side_length) {
  return Math.round(Math.sqrt(Math.pow(side_length, 2)-Math.pow((.5*side_length), 2)))
}


/////////////////// CANTOR ////////////////////////////////

const cantor_ratio = .666
var cantor_start = { x1 : 0, y1 : 0, x2 : 1000, y2 : 0 }
var cantor_coords = [cantor_start]

function cantor (coords) {
  var lines = d3.select('svg').selectAll('line')
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

/**/