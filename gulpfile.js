
/* globals require, console, __dirname */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
  replaceString: /^gulp(-|\.)([0-9]+)?/
});
require('babel/register')
const fs = require('fs');
var browserify = require("browserify");
var babelify = require("babelify");
const del = require('del');
const path = require('path');
const isparta = require('isparta');
const runSequence = require('run-sequence');
const source = require('vinyl-source-stream');
var mocha = require('gulp-mocha');
const connect = require('gulp-connect');
require('harmonize')();
var dev = false
// Adjust this file to configure the build
const config = require('./config');

// Remove the built files
gulp.task('clean', function(cb) {
  del([config.destinationFolder], cb);
});

// Remove our temporary files
gulp.task('clean:tmp', function(cb) {
  del(['tmp'], cb);
});

// Send a notification when JSHint fails,
// so that you know your changes didn't build
function ding(file) {
  for (var i = 0; i < file.eslint.messages.length; i++) {
    var message = file.eslint.messages[i]
    var pathArray = file.eslint.filePath.split('/')
    var filename = pathArray[pathArray.length -1]
    if(message.fatal) return message.message + ' - ' + filename + ':' + message.line
  }
  return false
}

// Lint our source code
gulp.task('lint:src', function() {
  return gulp.src(['src/**/*.js'])
    .pipe($.plumber())
    .pipe($.eslint())
    .pipe($.notify(ding))
});

// Lint our test code
gulp.task('lint:test', function() {
  return gulp.src(['test/unit/**/*.js'])
    .pipe($.plumber())
    .pipe($.eslint())
    .pipe($.notify(ding))
});

// Bundle our app for our unit tests
gulp.task('browserify', function() {
  browserify("./src/router.js", { debug: dev })
  .transform(babelify)
  .bundle()
  .on("error", function (err) { console.log("Error : " + err.message); })
  .pipe(fs.createWriteStream("./dist.js"))
  // .pipe(gulp.dest('./dist/'))
});
function test(reporter) {
  return gulp.src('__tests__/**/*.js')
    .pipe(mocha({reporter: reporter}))
}

// Use `npm coverage` instead, this may or may not work
gulp.task('coverage', function(done) {
  return test('mocha-lcov-reporter')
});

// Lint and run our tests
gulp.task('test', ['lint:src', 'lint:test', 'browserify'], function() {
  require('babel/register')({ modules: 'common' });
  return test('nyan');
});
gulp.task('watch-test', function() {
  gulp.watch('./src/**/*.js', function() {
    runSequence('build_in_sequence', 'test')
  })
  gulp.watch('./__tests__/**/*.js', function() {
    runSequence('build_in_sequence', 'test')
  })
})
gulp.task('dev', function(cb) {
  dev = true;
  runSequence('build_in_sequence', 'test', 'watch-test', cb)
})
// Ensure that linting occurs before browserify runs. This prevents
// the build from breaking due to poorly formatted code.
gulp.task('build_in_sequence', function(callback) {
  runSequence(['lint:src', 'lint:test'], 'browserify', callback);
});

gulp.task('test-server', function(){
  return connect.server({
    root: '',
    livereload: false
  });
});


// An alias of test
gulp.task('default', ['test']);
