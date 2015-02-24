/* 
npm install findit
npm install mustache
*/

// var moment = require('moment');

var fs = require('fs');
var path = require('path');
var mustache = require('mustache');

var finder = require('findit')(process.argv[2] || '.');

/*
finder.on('directory', function (dir, stat, stop) {
    var base = path.basename(dir);
    if (base === '.git' || base === 'node_modules') stop()
    else console.log(dir + '/')
});
*/

/*
{ ...
  mtime: Sun Jan 11 2015 13:01:57 GMT+0100 (CET),
*/

var fileHandler = function (file, stat) {
    console.log(file);
    var mtime = new Date(stat["mtime"]);
    console.log(mtime.toISOString());

    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
        
       var lines = data.split(/\r\n|\r|\n/g);
        for(linei
    });
};

finder.on('file', fileHandler);