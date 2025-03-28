// gqlConverter.js
const fs = require('fs');
const path = require('path');

const parseLine = (line) => {
  const indentLevel = line.match(/^\s*/)[0].length;
  const content = line.trim();
  return { indentLevel, content };
};

const convertToGraphql = (gqlQuery) => {
  const lines = gqlQuery.trim().split('\n');
  let stack = [];
  let output = "";

  const openBrace = (indentLevel) => "{\n" + "  ".repeat(indentLevel);
  const closeBrace = (indentLevel) => "  ".repeat(indentLevel) + "}\n";

  lines.forEach(line => {
    const { indentLevel, content } = parseLine(line);

    while (stack.length && indentLevel <= stack[stack.length - 1].indentLevel) {
      output += closeBrace(stack.pop().indentLevel);
    }

    if (content.endsWith(':')) {
      output += "  ".repeat(indentLevel) + content.slice(0, -1) + " {\n";
      stack.push({ indentLevel });
    } else if (content.endsWith('[')) {
      output += "  ".repeat(indentLevel) + content + "\n";
      stack.push({ indentLevel });
    } else if (content === ']') {
      while (stack.length && !stack[stack.length - 1].content.endsWith('[')) {
        output += closeBrace(stack.pop().indentLevel);
      }
      output += "  ".repeat(indentLevel) + "]\n";
      if (stack.length && stack[stack.length - 1].content.endsWith('[')) {
        stack.pop();
      }
    } else {
      output += "  ".repeat(indentLevel) + content + "\n";
    }
  });

  while (stack.length) {
    output += closeBrace(stack.pop().indentLevel);
  }

  return output;
};

const replaceIncludes = (srcDir) => {
  const files = fs.readdirSync(srcDir);
  files.forEach(file => {
    const filePath = path.join(srcDir, file);
    if (fs.statSync(filePath).isDirectory()) {
      replaceIncludes(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/import (.+?) from '(.+?)\.gql';/g, (match, p1, p2) => {
        const gqlFilePath = path.join(srcDir, `${p2}.gql`);
        const gqlContent = fs.readFileSync(gqlFilePath, 'utf8');
        const graphqlContent = convertToGraphql(gqlContent);
        const graphqlFilePath = path.join(srcDir, `${p2}.graphql`);
        fs.writeFileSync(graphqlFilePath, graphqlContent);
        return `import ${p1} from '${p2}.graphql';`;
      });
      fs.writeFileSync(filePath, content);
    }
  });
};

module.exports = replaceIncludes;
