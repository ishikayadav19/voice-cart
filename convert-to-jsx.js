const fs = require('fs');
const path = require('path');

function convertTsxToJsx(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      convertTsxToJsx(filePath);
    } else if (file.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Remove type annotations
      let newContent = content
        .replace(/: React\.FC(<.*?>)?\s*=/g, '=') // Remove React.FC type
        .replace(/: JSX\.Element/g, '') // Remove JSX.Element return type
        .replace(/: \{[^}]+\}/g, '') // Remove interface type annotations
        .replace(/: [A-Za-z][A-Za-z0-9]*(\[\])?/g, '') // Remove simple type annotations
        .replace(/<[A-Za-z][A-Za-z0-9]*>/g, '') // Remove generic type parameters
        .replace(/type\s+[A-Za-z][A-Za-z0-9]*\s*=\s*{[^}]+};?/g, '') // Remove type definitions
        .replace(/interface\s+[A-Za-z][A-Za-z0-9]*\s*{[^}]+};?/g, '') // Remove interfaces
        .replace(/import\s+type\s+.*?from\s+['"].*?['"];?\s*/g, '') // Remove type imports
        .replace(/,\s*type.*?}/g, '}') // Remove type imports in destructured imports
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      const newPath = filePath.replace('.tsx', '.jsx');
      fs.writeFileSync(newPath, newContent);
      fs.unlinkSync(filePath);
      console.log(`Converted ${file} to JSX`);
    }
  });
}

// Start conversion from the components directory
convertTsxToJsx('./components'); 