const fs = require('fs');
const pages = fs.readdirSync('./').filter(f => f.endsWith('.html'));

pages.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  // Remove query string version params from local asset references 
  c = c.replace(/styles-v2\.css\?v=\d+/g, 'styles-v2.css');
  c = c.replace(/script-v2\.js\?v=\d+/g, 'script-v2.js');
  // Also make sure the body has no loading class
  c = c.replace('<body class="loading">', '<body>');
  fs.writeFileSync(f, c);
  console.log('Fixed: ' + f);
});
console.log('Done.');
