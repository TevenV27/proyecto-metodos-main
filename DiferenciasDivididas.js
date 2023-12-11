function NewtonPol(dat) {
    
    /*
   * Implementación del interpolador de Newton
   * Entradas:
   * dat -- lista de puntos (x, y) en el plano
   * Salidas:
   * F -- tabla de diferencias divididas
   * P -- función de interpolación
   */
   const n = dat.length;
   const F = Array.from(Array(n), () => Array(n).fill(0)); // crear tabla nula

   // Condiciones iniciales
   for (let i = 0; i < n; i++) {
     F[i][0] = dat[i][1];
   }

   // Tabla de diferencias divididas
   for (let i = 1; i < n; i++) {
     for (let j = 1; j <= i; j++) {
      F[i][j] = (F[i][j - 1] - F[i - 1][j - 1]) / (dat[i][0] - dat[i - j][0]);
     }
    }

    function L(k, x) {
      // Implementación funciones L_k(x)
      // polinomio Lk(x) = Q i≤k (x − xi)
      let out = 1;
      for (let i = 0; i < n; i++) {
        if (i <= k) {
          out *= x - dat[i][0];
        }
      }
      return out;
    }

    function P(x) {
      // Implementación polinomio P(x)
      // P(x) = f[x0] + Pn f[x0, x1, . . . , xk]Lk−1(x)
      let newt = 0;
      for (let i = 1; i < n; i++) {
        newt += F[i][i] * L(i - 1, x);
      }
      return newt + F[0][0];
    }


    return [F, P];
}
function displayTable(containerId, title, table) {
  const container = document.getElementById(containerId);
  container.innerHTML += "<h3>" + title + "</h3>";
  const newTable = document.createElement("table");
  container.appendChild(newTable);
  for (let i = 0; i < table.length; i++) {
    const newRow = newTable.insertRow();
    for (let j = 0; j < table[i].length; j++) {
      const newCell = newRow.insertCell();
      newCell.textContent = table[i][j];
    }
  }
}
function readUserInput() {
  const numPointsInput = document.getElementById("num-points-input");
  const numPoints = parseInt(numPointsInput.value);

  const userPoints = [];
  for (let i = 0; i < numPoints; i++) {
    const xInput = document.getElementById("x-input-" + i);
    const yInput = document.getElementById("y-input-" + i);

    const x = parseFloat(xInput.value);
    const y = parseFloat(yInput.value);

    userPoints.push([x, y]);
  }
  return userPoints;
}

function submitPoints() {
  const numPoints = parseInt(document.getElementById("num-points-input").value);
  
  // Limpiar el contenedor
  document.getElementById("user-data-table").innerHTML = "";
  document.getElementById("newton-table").innerHTML = "";
  document.getElementById("evaluation-result").textContent = "";
  document.getElementById("chart-container").innerHTML = "";
  

  // Crear campos de entrada para las coordenadas
  for (let i = 0; i < numPoints; i++) {
    document.getElementById("user-data-table").innerHTML +=
      `<tr><td><label for="x-input-${i}">Coordenada X del punto ${i + 1}:</label></td>` +
      `<td><input type="number" id="x-input-${i}" /></td></tr>` +
      `<tr><td><label for="y-input-${i}">Coordenada Y del punto ${i + 1}:</label></td>` +
      `<td><input type="number" id="y-input-${i}" /></td></tr>`;
  }
  
  // Agregar botón para realizar la interpolación
  document.getElementById("user-data-table").innerHTML +=
    `<tr><td colspan="2"><button type="button" onclick="calcularall()">Interpolar</button></td></tr>`;
  
  
}


function calcularall(){
    
    /*for (let i = 0; i < numPoints; i++) {
        
        const x = parseFloat(prompt("Ingrese la coordenada x del punto " + (i + 1) + ":"));
        const y = parseFloat(prompt("Ingrese la coordenada y del punto " + (i + 1) + ":"));
        userPoints.push([x, y]);
    }*/
    const userPoints = readUserInput();
    // Aplicar el método de interpolación de Newton
    const [T, P] = NewtonPol(userPoints);
    // Mostrar los datos ingresados y los resultados en la página
    
    document.getElementById("num-points").textContent = "Número de puntos: " + userPoints.length;
    displayTable("user-data-table", "Datos ingresados por el usuario:", userPoints);
    displayTable("newton-table", "Tabla de diferencias divididas:", T);
    
    const evalPoint = parseFloat(prompt("Ingrese el punto en el que desea evaluar (X):"));
    const result = P(evalPoint);

   document.getElementById("evaluation-result").textContent =
    "Evaluación del polinomio en x = " + evalPoint + ": " + result;

    // Crear un gráfico de dispersión
  const chartContainer = document.getElementById("chart-container");
  const scatterCanvas = document.createElement("canvas");
  chartContainer.appendChild(scatterCanvas);

  const xValues = userPoints.map(point => point[0]);
  const yValues = userPoints.map(point => point[1]);
  const interpolatedX = generateInterpolatedXValues(xValues);
  const interpolatedY = interpolatedX.map(P);

  const scatterChart = new Chart(scatterCanvas, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Datos ingresados',
        data: userPoints,
        borderColor: 'blue',
        backgroundColor: 'blue',
        showLine: false,
        pointRadius: 5
      }, {
        label: 'Interpolación de Newton',
        data: interpolatedX.map((x, i) => ({ x, y: interpolatedY[i] })),
        borderColor: 'red',
        backgroundColor: 'transparent',
        showLine: true
      }]
    },
    options: {
      scales: {
        x: { type: 'linear', position: 'bottom' },
        y: { type: 'linear', position: 'left' }
      }
    }
  });

  function generateInterpolatedXValues(xValues) {
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const step = (maxX - minX) / 10; // Ajusta la cantidad de puntos en la línea
    return Array.from({ length: 11 }, (_, i) => minX + i * step);
  }

}

