
const repl = require("replace-in-file");
const escape = require("escape-string-regexp");
const fs = require('fs');

const ripplePlugin = escape(`"nativescript-ripple": "file:../dist/nativescript-ripple"`);

repl.replaceInFile({
    files: ['../demo/package.json', '../demo-ng/package.json'],
    from: new RegExp(`${ripplePlugin},?`, "gm"),
    to: ""
});


function editTscConfig(path) {
    let rawdata = fs.readFileSync(path);
    let tsConfigJson = JSON.parse(rawdata);
    tsConfigJson.compilerOptions = tsConfigJson.compilerOptions || {};
    const compilerOptions = tsConfigJson.compilerOptions;
    compilerOptions.paths = compilerOptions.paths || {};
    compilerOptions.paths['*'] = ["./node_modules/*","../src/node_modules/*"];
    compilerOptions.paths['nativescript-ripple'] = ["../src"];
    compilerOptions.paths['nativescript-ripple/*'] = ["../src/*"];
    fs.writeFileSync(path, JSON.stringify(tsConfigJson, undefined, "    "));
}

editTscConfig("../demo/tsconfig.json");
editTscConfig("../demo-ng/tsconfig.json");




