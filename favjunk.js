const fs = require('fs');
const os = require('os');
const path = require('path');

const yaml = require('yaml');
const md5File = require('md5-file');

const homedir = os.homedir();
const ymlfile = `${homedir}/.favjunk.yml`;

const unique = (val, idx, self) => self.indexOf(val) === idx;
const resolvePath = p => path.resolve(p);
const getValidatedFiles = l => l.filter(f => fs.lstatSync(f).isFile());
const getHashedFiles = l => l.map(p => ({
  hash: md5File.sync(p),
  path: resolvePath(p),
}));

function walkDir(dir, callback, recursive) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let stat = fs.statSync(dirPath);
    if (stat.isDirectory()) {
      if (recursive) {
        walkDir(dirPath, callback, recursive);
      }
    } else {
      if (stat.size <= 51200000) {
        callback(path.join(dir, f));
      }
    }
  });
};

function cleanEmptyFoldersRecursively(folder) {
  var fs = require('fs');
  var path = require('path');

  var isDir = fs.statSync(folder).isDirectory();
  if (!isDir) {
    return;
  }
  var files = fs.readdirSync(folder);
  if (files.length > 0) {
    files.forEach(function (file) {
      var fullPath = path.join(folder, file);
      cleanEmptyFoldersRecursively(fullPath);
    });

    files = fs.readdirSync(folder);
  }

  if (files.length == 0) {
    fs.rmdirSync(folder);
    return;
  }
}

function initYaml() {
  const data = {
    hash: [],
  };
  saveYaml(data);
}

function loadYaml() {
  if (!fs.existsSync(ymlfile)) {
    initYaml();
  }
  const file = fs.readFileSync(ymlfile, 'utf8');
  return yaml.parse(file);
}

function saveYaml(data) {
  fs.writeFileSync(ymlfile, yaml.stringify(data));
}

function add(paths) {
  const config = loadYaml();
  const list = getHashedFiles(getValidatedFiles(paths));

  config.hash = config.hash.concat(list.map(val => val.hash)).filter(unique);

  saveYaml(config);
  return list;
}

function remove(paths) {
  const config = loadYaml();
  const list = getHashedFiles(getValidatedFiles(paths));

  const result = config.hash.reduce((acc, val, idx, self) => {
    if (list.map(val => val.hash).indexOf(val) === -1) {
      acc.push(val);
    }
    return acc;
  }, []);
  config.hash = result;

  saveYaml(config);
  return list;
}

function check(path, recursive = false) {
  const paths = [];
  walkDir(path, (f) => {
    paths.push(resolvePath(f));
  }, recursive);

  const config = loadYaml();
  const list = getHashedFiles(getValidatedFiles(paths));
  const result = list.reduce((acc, val, idx, self) => {
    if (config.hash.indexOf(val.hash) > -1) {
      acc.push(val);
    }
    return acc;
  }, []);
  return result;
}

function exec(path, recursive = false) {
  const list = check(path, recursive);
  list.forEach((item) => {
    fs.unlinkSync(item.path);
  });
  if (recursive) {
    cleanEmptyFoldersRecursively(path);
  }
  return list;
}


module.exports.add = add;
module.exports.remove = remove;
module.exports.exec = exec;
module.exports.check = check;