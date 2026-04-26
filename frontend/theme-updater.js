const fs = require('fs');
const path = require('path');

const directoryToSearch = path.join(__dirname, 'app');

const replacements = [
  { regex: /bg-gray-50/g, replacement: 'bg-[#FAF9F6]' },
  { regex: /bg-rose-500/g, replacement: 'bg-[#D4AF37]' },
  { regex: /bg-rose-600/g, replacement: 'bg-[#C5A030]' },
  { regex: /text-rose-500/g, replacement: 'text-[#D4AF37]' },
  { regex: /text-rose-600/g, replacement: 'text-[#C5A030]' },
  { regex: /text-gray-600/g, replacement: 'text-[#5C5C5C]' },
  { regex: /text-gray-700/g, replacement: 'text-[#5C5C5C]' },
  { regex: /text-gray-800/g, replacement: 'text-[#1A1A1A]' },
  { regex: /text-gray-900/g, replacement: 'text-[#1A1A1A]' },
  { regex: /border-gray-100/g, replacement: 'border-[#E5E0D8]' },
  { regex: /border-gray-200/g, replacement: 'border-[#E5E0D8]' },
  { regex: /border-gray-300/g, replacement: 'border-[#E5E0D8]' },
  { regex: /ring-rose-500/g, replacement: 'ring-[#D4AF37]' },
  { regex: /border-rose-500/g, replacement: 'border-[#D4AF37]' },
  { regex: /focus:ring-rose-500/g, replacement: 'focus:ring-[#D4AF37]' },
  { regex: /focus:border-rose-500/g, replacement: 'focus:border-[#D4AF37]' },
  { regex: /bg-gradient-to-r from-rose-500 to-purple-600/g, replacement: 'bg-gradient-to-r from-[#D4AF37]/20 to-[#E6B9A6]/20' },
  { regex: /color="#E11D48"/g, replacement: 'color="#D4AF37"' },
  { regex: /hover:bg-gray-50/g, replacement: 'hover:bg-[#FDFBF7]' },
  { regex: /from-rose-500 to-purple-600/g, replacement: 'from-[#D4AF37]/20 to-[#E6B9A6]/20' },
  { regex: /bg-black bg-opacity-40/g, replacement: 'bg-[#FAF9F6]/40 backdrop-blur-sm' },
];

function updateThemeInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx') || filePath.endsWith('.js')) {
      updateThemeInFile(filePath);
    }
  }
}

walkDir(directoryToSearch);
console.log('Theme update complete!');
