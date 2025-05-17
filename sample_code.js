function usedFunction() {
    console.log("This function is used.");
  }
  
  function unusedFunction() {
    console.log("This function is never called.");
  }
  
  function anotherUnusedFunction(x, y) {
    return x + y;
  }
  
  usedFunction();