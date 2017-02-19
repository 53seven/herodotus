// getFileName.js
const pkginfo = require('pkginfo');

function main(module) {
  let pkg = pkginfo.read(module);
  return sanitizeName(pkg.package.name);
}

function sanitizeName(name) {
  let parts = name.split('/');
  if (parts.length === 1) {
    // normal name
    return parts[0];
  } else {
    // we have a scoped module, drop the first part
    if (parts[0].indexOf('@') === 0) {
      parts.shift();
    }
    return parts.join('-');
  }
}


module.exports = {
  main,
  sanitizeName
};
