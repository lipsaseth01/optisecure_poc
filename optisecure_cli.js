#!/usr/bin/env node
const { program } = require('commander');
const { analyzeCode } = require('./ai_code_analyzer');
const { encryptData, decryptData, generateKeyPair } = require('./quantum_safe_encryption');

program
  .command('analyze')
  .description('Analyze code for unused functions')
  .argument('<input>', 'Input JavaScript file')
  .argument('<output>', 'Output report file')
  .action((input, output) => {
    try {
      const report = analyzeCode(input, output);
      console.log('Code Analysis Report:');
      console.log(`- Total Functions: ${report.total_functions}`);
      console.log(`- Unused Functions: ${report.unused_functions}`);
      console.log(`- Potential Size Reduction: ${report.size_reduction_percent.toFixed(2)}%`);
      console.log(`Report saved to ${output}`);
    } catch (error) {
      console.error('Error running code analyzer:', error.message);
    }
  });

program
  .command('encrypt')
  .description('Run quantum-safe encryption demo')
  .argument('<data>', 'Data to encrypt')
  .action((data) => {
    try {
      const { publicKey, privateKey } = generateKeyPair();
      console.log('Quantum-Safe Encryption Demo:');
      console.log('Generated Key Pair:');
      console.log(`- Public Key: ${publicKey.slice(0, 16)}...`);
      console.log(`- Private Key: ${privateKey.slice(0, 16)}...`);

      const { encrypted, time: encTime } = encryptData(data, publicKey);
      console.log(`\nEncrypted Data: ${encrypted.slice(0, 16)}...`);
      console.log(`Encryption Time: ${encTime.toFixed(2)}ms`);

      const { decrypted, time: decTime } = decryptData(encrypted, privateKey);
      console.log(`Decrypted Data: ${decrypted}`);
      console.log(`Decryption Time: ${decTime.toFixed(2)}ms`);
    } catch (error) {
      console.error('Error running encryption demo:', error.message);
    }
  });

program.parse(process.argv);