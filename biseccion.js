
var f;
var a;
var b;
var T;
var N;
var milis;
var result;
var tabla;
var range = [-1, 1];

function inicializar(){
    graficar(-1,1,0,"0");
    tabla = document.getElementById("table")
    result = document.getElementById("result")
}

function ejecutar(){        
    obtenerParametros();    
    biseccion()
}

function obtenerParametros(){
    fExpresion = document.getElementById("f").value.trim();
    f = function (parametro){
        fExpresion = fExpresion.replace("sec","src").replace("e","2.7182818284").replace("src","sec")        
        const expresionFormateada = math.parse(fExpresion)
        const expresionCompilada = expresionFormateada.compile()
        let variables = {x: parametro}
        return expresionCompilada.evaluate(variables);
    }
    a = parseFloat(document.getElementById("a").value);
    b = parseFloat(document.getElementById("b").value);
    T = parseFloat(document.getElementById("T").value);
    N = parseInt(document.getElementById("N").value);    
    milis = parseInt(document.getElementById("milis").value);    
}

function graficar(a,b,p,f){
    var parameters = {
        target: '#plot',
        height: document.getElementById("plot-div").clientHeight,
        width: document.getElementById("plot-div").clientWidth,
        data: [{
          fn: f, //funcion
          color: 'red'
       },{
        points: [[p, 0]], //punto medio
          fnType: 'points',
          graphType: 'scatter',
          color: 'rgb(0,0,255)'
       },{
        points: [
          [a, 1000], //punto inicio linea a
          [a, -1000], //punto fin linea a
        ],
        fnType: 'points',
        graphType: 'polyline',
        color: 'rgb(0,0,255)'
      },
      {
        points: [
          [b, 1000], //punto inicio linea b
          [b, -1000], //punto fin linea b
        ],
        fnType: 'points',
        graphType: 'polyline',
        color: 'rgb(0,0,255)'
      }
    ],
        grid: true,
        yAxis: {domain: [-1, 1]},
        xAxis: {domain: [0, 2*Math.PI]}
      };
              
        var xMin = range[0]-0.1
        var xMax = range[1]+0.1
        var yMin = -10
        var yMax = 10
        
        parameters.xAxis.domain = [xMin, xMax];
        parameters.yAxis.domain = [yMin, yMax];

        
        functionPlot(parameters);                  
}

async function biseccion(){

    range = [a, b] //se define como los limites iniciales

    table.innerHTML = "<tr><th>n</th><th>a</th><th>b</th><th>p</th><th>f(p)</th><th>e</th></tr>"
    let n = 1;        
    FA = f(a);
    while(n <= N){
        const p = (a + b)/2;
        FP = f(p)
        //Adicionamos a la tabla
        error = Math.abs((a - b)/2)
        table.insertRow(-1).innerHTML = "<td>"+n+"</td>"+"<td>"+a.toFixed(10)+"</td>"+"<td>"+b.toFixed(10)+"</td>"+"<td>"+p.toFixed(10)+"</td>"+"<td>"+FP.toFixed(10)+"</td>"+"<td>"+error.toFixed(10)+"</td>"
        graficar(a,b,p,fExpresion)
        await new Promise(r => setTimeout(r, milis));        
        if(FP == 0 || (b-a)/2 < T){
            result.innerHTML = "x &asymp; " + p
            return;            
        }
        n += 1;
        if(FA*FP > 0){
            a = p;
            FA = FP;
        } else {
            b = p;
        }            
    }
    result.innerHTML =  "El limite de iteraciones ha sido alcanzado"
    return;
}