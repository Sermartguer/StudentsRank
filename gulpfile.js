var fs = require("fs");
var browserify = require("browserify");
var gulp = require('gulp');
var webserver = require('gulp-webserver');
var jshint = require('gulp-jshint');
var map = require('map-stream');
const jscs = require('gulp-jscs');
var jsdoc = require('gulp-jsdoc3');


if (!fs.existsSync("dist")){
  fs.mkdirSync("dist");
}

///babelify, es6 to es5
gulp.task('browserify', function() {
browserify("./src/main.js")
  .transform("babelify", {presets: ["es2015"]})
  .bundle()
  .pipe(fs.createWriteStream("dist/main.js"));
});

///http server live reload (html changes)
gulp.task('webserver', function() {
  gulp.src('./')
  .pipe(webserver({
    livereload: true,
    directoryListing: false,
    open: true
  }));
});
var exitOnJshintError = map(function (file, cb) {
  if (!file.jshint.success) {
    console.error('jshint failed');
    process.exit(1);
  }
});
var errors= process.on('exit', function() {
  if (gulp.fail) {
    // return non-zero exit code
    process.exit(1);
  }
});
gulp.task('hint', function() {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default', { verbose: true }))
    .pipe(exitOnJshintError);
});

    gulp.task('jscs', () => {
      return gulp.src('./src/*.js')
      .pipe(jscs())
      .pipe(jscs.reporter());
  });
  gulp.task('doc', function (cb) {
    gulp.src(['README.md', './src/*.js'], {read: false})
        .pipe(jsdoc(cb));
});
// watch any change
gulp.task('watch', ['browserify'], function () {
    gulp.watch('./src/**/*.js', ['browserify']);
    gulp.watch('./src/*.js', ['hint']);
    gulp.watch('./src/*.js', ['jscs']);
});
gulp.task('default', ['browserify','doc','webserver', 'watch','hint','jscs']);