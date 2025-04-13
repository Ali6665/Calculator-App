let expression = "";

  function updateDisplay(value = expression) {
    document.getElementById("display").innerText = value || "0";
  }

  function append(char) {
    expression += char;
    updateDisplay();
  }

  function clearDisplay() {
    expression = "";
    updateDisplay();
  }

  function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
  }

  function calculate() {
    try {
      const result = computeExpression(expression);
      expression = result.toString();
      updateDisplay();
    } catch {
      updateDisplay("Error");
      expression = "";
    }
  }

  function computeExpression(expr) {
    const tokens = expr.match(/(\d+(\.\d+)?|\+|\-|\*|\/|%)/g);
    if (!tokens) return 0;

    let output = [];
    let operators = [];

    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2 };
    const applyOperator = (op, b, a) => {
      switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : NaN;
        case '%': return a % b;
      }
    };

    tokens.forEach(token => {
      if (!isNaN(token)) {
        output.push(parseFloat(token));
      } else {
        while (
          operators.length &&
          precedence[operators[operators.length - 1]] >= precedence[token]
        ) {
          const op = operators.pop();
          const b = output.pop();
          const a = output.pop();
          output.push(applyOperator(op, b, a));
        }
        operators.push(token);
      }
    });

    while (operators.length) {
      const op = operators.pop();
      const b = output.pop();
      const a = output.pop();
      output.push(applyOperator(op, b, a));
    }

    return output[0];
  }