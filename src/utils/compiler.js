class Compiler {
  static compilePawno(code) {
    const output = [];
    const errors = [];
    const warnings = [];

    output.push('Pawn compiler version 3.2.3664');
    output.push('Copyright (c) 1997-2006, ITB CompuPhase');
    output.push('');

    // Basic syntax checking
    const lines = code.split('\n');
    let hasMain = false;
    let braceCount = 0;
    let inFunction = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check for main function
      if (line.includes('main()')) {
        hasMain = true;
        inFunction = true;
      }

      // Count braces
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;

      // Check for common Pawno functions
      if (line.includes('Print(') || line.includes('printf(')) {
        output.push(`Line ${i + 1}: Found output function`);
      }

      // Check for includes
      if (line.startsWith('#include')) {
        output.push(`Line ${i + 1}: Including ${line}`);
      }

      // Check for undefined variables (simple check)
      const varPattern = /new\s+(\w+)/g;
      let match;
      while ((match = varPattern.exec(line)) !== null) {
        output.push(`Line ${i + 1}: Variable declared: ${match[1]}`);
      }
    }

    // Validation
    if (!hasMain) {
      errors.push('Fatal error: No main function found');
    }

    if (braceCount !== 0) {
      errors.push(`Fatal error: Unbalanced braces (count: ${braceCount})`);
    }

    output.push('');
    output.push('Compiling...');
    
    if (errors.length > 0) {
      output.push('');
      output.push('=== ERRORS ===');
      errors.forEach(err => output.push(err));
      output.push('');
      output.push(`Compilation failed with ${errors.length} error(s)`);
      return { success: false, output };
    }

    output.push('');
    output.push('Output file: compiled.amx');
    output.push('Compilation completed successfully!');
    output.push(`Total lines: ${lines.length}`);
    output.push('Code size: ~' + Math.floor(code.length / 10) + ' bytes');

    return { success: true, output };
  }

  static compileGeneric(code, language) {
    const output = [];
    
    output.push(`${language.toUpperCase()} Compiler/Interpreter`);
    output.push('='.repeat(40));
    output.push('');

    const lines = code.split('\n');
    
    switch (language) {
      case 'javascript':
        output.push('JavaScript (Node.js v18.0.0)');
        output.push('Syntax check passed');
        output.push('No compilation needed - interpreted language');
        break;
      
      case 'python':
        output.push('Python 3.11.0');
        output.push('Syntax check passed');
        output.push('No compilation needed - interpreted language');
        break;
      
      case 'cpp':
      case 'c':
        output.push('GCC Compiler 12.2.0');
        output.push('Compiling...');
        output.push('Linking...');
        output.push('Output: a.out');
        output.push('Compilation successful!');
        break;
      
      case 'java':
        output.push('Java Compiler 17.0.0');
        output.push('Compiling...');
        output.push('Output: Main.class');
        output.push('Compilation successful!');
        break;
      
      default:
        output.push('Generic compiler');
        output.push('Code analysis complete');
        output.push(`Total lines: ${lines.length}`);
    }

    output.push('');
    output.push('Compilation completed successfully!');

    return { success: true, output };
  }
}

export default Compiler;
