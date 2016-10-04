var gulp = require('gulp');
var NwBuilder = require('nw-builder');
var pkg = require('./package');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var del = require('del');

var nw = new NwBuilder({
  appName: pkg.name,
  macIcns: './app/logo.icns',
  version: '0.17.6',
  files: './app/**/**', // use the glob format
  platforms: ['osx64']
});

nw.on('log', console.log);

gulp.task('clean:token', function () {
  return del([
    'app/token/**/*'
  ], {force: true});
});
gulp.task('clean:osx64', function () {
  return del([
    'build/gif-cake/osx64/**/*'
  ], {force: true});
});

gulp.task('move:token', function () {
  gulp.src('./token/build/Release/**', {
         dot: true
     })
    .pipe(gulp.dest('./app/token'));
});

gulp.task('compress-tar', function () {
  gulp.src('./build/gif-cake/osx64/**')
    .pipe(tar('GifCake.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('./build'));
});

gulp.task('setup:token', ['clean:token', 'move:token']);

gulp.task('build', function () {
  // Build returns a promise
  nw.build().then(function () {
    console.log('all done!');
  }).catch(function (error) {
    console.error(error);
  });
});

gulp.task('default', ['clean:osx64', 'build']);

