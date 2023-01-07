// calculate function
let calculate = function (n1, operator, n2) {
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);
  if (operator === "add") return firstNum + secondNum;
  if (operator === "subtract") return firstNum - secondNum;
  if (operator === "multiply") return firstNum * secondNum;
  if (operator === "divide" && secondNum != 0) return firstNum / secondNum;
  if (operator === "divide" && secondNum === 0) return "Cannot divide by zero";
};
//--------------------------------------------------------------//
const calculator = document.querySelector(".calculator");
const keys = calculator.querySelector(".keys");
const display = document.querySelector(".display");
//
keys.addEventListener("click", (e) => {
  if (e.target.matches("button")) {
    const key = e.target;
    const action = key.dataset.action; // 'data-action' in <button>
    const keyContent = key.textContent; // what exactly clicked
    const displayedNum = display.textContent; // what is on display at the moment
    const previousKeyType = calculator.dataset.previousKeyType; // custom attrib 'data-previous-key-type'
    //
    //loop to remove pressed state of an operator button
    Array.from(key.parentNode.children).forEach((key) =>
      key.classList.remove("is-pressed")
    );
    // checking & changing 'AC' key to 'CE' key
    if (action != "clear") {
      const clearButton = calculator.querySelector("[data-action=clear]");
      clearButton.textContent = "CE";
    }
    //
    if (!action) {
      // if no action attribute,key must be a number
      if (
        displayedNum === "0" ||
        previousKeyType === "operator" ||
        previousKeyType === "calculate"
      ) {
        display.textContent = keyContent; // if '0' or pressed operator,replace with clicked key(number)
      } else {
        display.textContent = displayedNum + keyContent;
      }
      calculator.dataset.previousKeyType = "number"; // for case when after operator number is > 9.
    }
    // logic when clicked operator key
    if (
      action === "add" ||
      action === "subtract" ||
      action === "multiply" ||
      action === "divide"
    ) {
      const firstValue = calculator.dataset.firstValue;
      const operator = calculator.dataset.operator;
      const secondValue = displayedNum;

      //It's sufficient to check for firstValue and operator because secondValue always exists
      if (
        firstValue &&
        operator &&
        previousKeyType !== "operator" &&
        previousKeyType !== "calculate"
      ) {
        const calcValue = calculate(firstValue, operator, secondValue);
        display.textContent = calcValue;
        //update calculated value as firstValue
        calculator.dataset.firstValue = calcValue;
      } else {
        //if no calculations, set displayedNum as firstValue
        calculator.dataset.firstValue = displayedNum;
      }

      //
      key.classList.add("is-pressed");
      calculator.dataset.previousKeyType = "operator"; // marking pressed key as an operator, for further operations
      calculator.dataset.operator = action; // storing operator for 'calculate' function
    }
    // logic when clicked 'decimal'
    if (action === "decimal") {
      if (displayedNum.includes(".")) {
        display.textContent = displayedNum;
      } else if (
        previousKeyType === "operator" ||
        previousKeyType === "calculate"
      ) {
        display.textContent = "0.";
      }
      calculator.dataset.previousKeyType = "decimal";
    }
    // logic for 'AC' & 'CE' key('All Clear" & 'Clear Entry")
    if (action === "clear") {
      if (key.textContent === "AC") {
        calculator.dataset.firstValue = "";
        calculator.dataset.operator = "";
        calculator.dataset.modValue = "";
        calculator.dataset.previousKeyType = "";
      } else {
        key.textContent = "AC";
      }
      display.textContent = "0";
      calculator.dataset.previousKeyType = "clear";
    }
    // logic for '=' key
    if (action === "calculate") {
      let firstValue = calculator.dataset.firstValue;
      const operator = calculator.dataset.operator;
      let secondValue = displayedNum;
      //
      if (firstValue) {
        //
        if (previousKeyType === "calculate") {
          firstValue = displayedNum; // case when 5-1=4,then hit '=' again => 3
          secondValue = calculator.dataset.modValue; // trigger to use modVal. Hitting '=' more than once
        }
        display.textContent = calculate(firstValue, operator, secondValue);
      }
      //
      calculator.dataset.modValue = secondValue; //For secondValue to persist
      //to the next calculation we need to store it in another custom attrib
      calculator.dataset.previousKeyType = "calculate";
    }
    //
  }
});
