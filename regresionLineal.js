function calculateLinearRegression() {
  let dataString = document.getElementById('dataPoints').value;
  // Utiliza una expresión regular para coincidir con todos los puntos en el formato (x,y)
  let pointRegex = /\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/g;
  let matches;
  let points = [];

  // Encuentra todos los puntos que coinciden con el formato (x,y)
  while ((matches = pointRegex.exec(dataString)) !== null) {
    points.push({ x: parseFloat(matches[1]), y: parseFloat(matches[2]) });
  }

  // Si no se encontraron puntos, lanza un error
  if (points.length === 0) {
    throw new Error("No se encontraron puntos en el formato válido.");
  }

  let linearResultElement = document.getElementById('linearResult');
  linearResultElement.innerHTML = '';

  try {
    let { slope, intercept } = linearRegression(points);
    linearResultElement.innerText = `Ecuación de la línea: y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`;

    // Preparar los datos para el gráfico
    let chartData = {
      labels: points.map(p => p.x),
      datasets: [{
        label: 'Puntos de Datos',
        data: points.map(p => p.y),
        backgroundColor: 'rgba(0, 119, 204, 0.3)',
        borderColor: 'rgba(0, 119, 204, 0.8)',
        fill: false
      }, {
        label: 'Línea de Regresión',
        data: points.map(p => (slope * p.x + intercept)),
        backgroundColor: 'rgba(255, 99, 132, 0.3)',
        borderColor: 'rgba(255, 99, 132, 0.8)',
        fill: false,
        type: 'line'
      }]
    };

    drawLinearChart(chartData);
  } catch (error) {
    linearResultElement.innerText = error.message;
  }
}


function linearRegression(points) {
  let n = points.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let p of points) {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumXX += p.x * p.x;
  }
  let slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  let intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}
function drawLinearChart(chartData) {
  var ctx = document.getElementById('myChartLinear').getContext('2d');
  if (linearChart) {
      linearChart.destroy(); // Destruir la instancia anterior si existe
  }
  linearChart = new Chart(ctx, {
      type: 'line',
      data: chartData, // Utiliza los datos pasados a la función
      options: {
          scales: {
              y: { // Actualizado para Chart.js 3.x
                  beginAtZero: false
              },
              x: {
                  beginAtZero: false
              }
          }
      }
  });
}