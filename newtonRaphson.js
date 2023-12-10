function newtonRaphson(f, df, x0, tol, maxIter) {
    let x = x0;
    for (let i = 0; i < maxIter; i++) {
        let fx = f(x);
        let dfx = df(x);
        if (Math.abs(fx) < tol) {
            return { root: x, iterations: i + 1 };
        }
        if (dfx === 0) {
            throw new Error("Derivada igual a cero encontrada");
        }
        x = x - fx / dfx;
    }
    throw new Error("Máximo de iteraciones alcanzado");
}
