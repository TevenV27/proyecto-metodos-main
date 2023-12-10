let newtonChart = null; // Variable global para la instancia del gráfico de Newton-Raphson
let linearChart = null; // Variable global para la instancia del gráfico

function drawNewtonChart(dataPoints) {
    var ctx = document.getElementById('myChartNewton').getContext('2d');
    if (newtonChart) {
        newtonChart.destroy(); // Destruir la instancia anterior si existe
    }
    newtonChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataPoints.map(p => p.iteration),
            datasets: [{
                label: 'Valor de x en cada iteración',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: dataPoints.map(p => p.xValue),
                fill: false,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90
                    }
                }]
            }
        }
    });
}

function calculateRoot() {
    let initialValue = parseFloat(document.getElementById('initialValue').value);
    let procedureElement = document.getElementById('procedureNewton'); // Modificado
    procedureElement.innerHTML = ''; 
    let dataPoints = [];

    try {
        let x = initialValue;
        let maxIter = 1000;
        let tol = 0.001;
        for (let i = 0; i < maxIter; i++) {
            let fx = x * x - 2; // Ejemplo: f(x) = x^2 - 2
            let dfx = 2 * x; // Ejemplo: f'(x) = 2x
            if (Math.abs(fx) < tol) {
                document.getElementById('resultNewton').innerText = 'Raíz encontrada: ' + x.toFixed(4); // Modificado
                break;
            }
            if (dfx === 0) {
                throw new Error("Derivada igual a cero encontrada");
            }

            let nextX = x - fx / dfx;
            dataPoints.push({ iteration: i + 1, xValue: x });

            procedureElement.innerHTML += `Iteración ${i + 1}: x = ${x.toFixed(4)}, f(x) = ${fx.toFixed(4)}, f'(x) = ${dfx.toFixed(4)}, Próximo x = ${nextX.toFixed(4)}<br>`;

            x = nextX;
        }
        if (Math.abs(x * x - 2) >= tol) {
            throw new Error("No se encontró una raíz en las iteraciones dadas");
        }
    } catch (error) {
        document.getElementById('resultNewton').innerText = error.message;
    }

    drawNewtonChart(dataPoints); 
}

