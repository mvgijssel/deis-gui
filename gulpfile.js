var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var coffeeify = require('coffeeify');

// Basic usage
gulp.task('default', function() {

  var vendor_files = ['./index.coffee'];
  var app_files = ['./index2.coffee'];

  instantiateBundle('vendor', vendor_files);
  instantiateBundle('app', app_files);

  function instantiateBundle(name, files, requires) {
    var bundler = watchify(browserify(files, watchify.args));
    bundler.transform('coffeeify');
    bundler.on('update', function(){ createBundle(name, bundler) });
    bundler.on('log', function(msg) { gutil.log('Bundle (' + name + '):', msg); });

    createBundle(name, bundler);
  }

  function createBundle(name, bundler) {
    bundler.bundle()
      .on('error', function(err) { gutil.log('Bundle (' + name + '):', err.message); })
      .pipe(source(name + '.js'))
      .pipe(gulp.dest('./app/assets/javascripts'));
  }

  function logBundle(message) {

  }
});
