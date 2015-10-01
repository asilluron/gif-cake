var gulp = require('gulp');
var NwBuilder = require('nw-builder');
var pkg = require('./package');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');

var nw = new NwBuilder({
  appName: pkg.name,
  macIcns: './app/logo.icns',
  version: '0.12.3',
  files: './app/**/**', // use the glob format
  platforms: ['osx32', 'osx64', 'win32', 'win64']
});

nw.on('log', console.log);


gulp.task('compress-tar', function () {
  gulp.src('./build/gif-cake/osx64/**')
    .pipe(tar('GifCake.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('./build'));
});


gulp.task('default', function () {
  // Build returns a promise
  nw.build().then(function () {
    console.log('all done!');
  }).catch(function (error) {
    console.error(error);
  });
});
