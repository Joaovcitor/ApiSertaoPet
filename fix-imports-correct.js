const fs = require('fs');
const path = require('path');

// Função para calcular o caminho relativo correto
function getCorrectRelativePath(fromFile, aliasPath) {
  const srcPath = path.join(__dirname, 'src');
  const fromDir = path.dirname(fromFile);
  
  // Remover o alias @ e obter o caminho real
  const targetPath = aliasPath.replace('@/', '');
  const fullTargetPath = path.join(srcPath, targetPath);
  
  // Calcular caminho relativo
  const relativePath = path.relative(fromDir, fullTargetPath);
  
  // Normalizar para usar / no import
  return './' + relativePath.replace(/\\/g, '/');
}

// Função para processar um arquivo
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  // Regex para encontrar imports com @/
  const importRegex = /import\s+(.*?)\s+from\s+["'](@\/[^"']+)["']/g;
  
  let match;
  const replacements = [];
  
  while ((match = importRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const importPart = match[1];
    const aliasPath = match[2];
    
    const correctPath = getCorrectRelativePath(filePath, aliasPath);
    const newImport = `import ${importPart} from "${correctPath}"`;
    
    replacements.push({
      old: fullMatch,
      new: newImport
    });
  }
  
  // Aplicar substituições
  for (const replacement of replacements) {
    newContent = newContent.replace(replacement.old, replacement.new);
  }
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Fixed: ${path.relative(__dirname, filePath)}`);
  }
}

// Função para processar diretório recursivamente
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      processFile(filePath);
    }
  }
}

// Executar
const srcDir = path.join(__dirname, 'src');
console.log('Fixing imports...');
processDirectory(srcDir);
console.log('All imports fixed!');