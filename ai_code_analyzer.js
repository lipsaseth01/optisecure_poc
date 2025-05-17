const esprima = require('esprima');
const fs = require('fs');

function parseCode(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const ast = esprima.parseScript(code, { loc: true });
    return ast;
  } catch (error) {
    console.error(`Error parsing ${filePath}: ${error.message}`);
    return { body: [] };
  }
}

function analyzeFunctions(ast) {
  const functions = [];
  const references = new Set();

  // Collect function declarations and references
  function traverse(node) {
    if (node.type === 'FunctionDeclaration') {
      functions.push({
        name: node.id.name,
        line_start: node.loc.start.line,
        line_end: node.loc.end.line,
        call_count: 0
      });
    } else if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
      references.add(node.callee.name);
    }
    for (const key in node) {
      if (node[key] && typeof node[key] === 'object') {
        traverse(node[key]);
      }
    }
  }

  traverse(ast);

  // Mark functions as used if referenced
  functions.forEach(func => {
    if (references.has(func.name)) {
      func.call_count = 1; // Mocked for PoC
    }
  });

  return functions;
}

function generateReport(functions, outputPath) {
  const unusedFunctions = functions.filter(func => func.call_count === 0);
  const totalLines = functions.reduce((sum, func) => sum + (func.line_end - func.line_start + 1), 0);
  const removableLines = unusedFunctions.reduce((sum, func) => sum + (func.line_end - func.line_start + 1), 0);

  const report = {
    total_functions: functions.length,
    unused_functions: unusedFunctions.length,
    total_lines: totalLines,
    removable_lines: removableLines,
    size_reduction_percent: totalLines > 0 ? (removableLines / totalLines * 100) : 0,
    details: unusedFunctions
  };

  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');
  return report;
}

module.exports = {
  analyzeCode: (inputFile, outputFile) => {
    const ast = parseCode(inputFile);
    const functions = analyzeFunctions(ast);
    return generateReport(functions, outputFile);
  }
};