// TODO: add sourcemaps
// TODO: add wiring with rails, update rails assets pipeline
// TODO: integrate with foreman

var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var coffeeify = require('coffeeify');

// Basic usage
gulp.task('default', function() {

  var app_files = ['./app/frontend/app'];

  instantiateBundle('app', app_files);

  function instantiateBundle(name, files, requires) {
    var bundler= watchify(browserify({
      paths: ['./node_modules','./app/frontend/'], // to prevent writing relative paths
      cache: {},
      packageCache: {},
      fullPaths: true,
      extensions: ['.coffee']
    }));

    bundler.add(files);
    bundler.transform('coffeeify');

    bundler.on('update', function(){ createBundle(name, bundler) });
    bundler.on('log', function(msg) { gutil.log('Bundle (' + name + '):', msg); });

    createBundle(name, bundler);
  }

  function createBundle(name, bundler) {
    bundler.bundle()
      .on('error', function(err) { gutil.log('Bundle (' + name + '):', err.message); })
      .pipe(source(name + '.js'))
      .pipe(gulp.dest('./app/assets/build/'));
  }

  function logBundle(message) {

  }
});

gulp.task('browserify', function() {

});

gulp.task('watch-sass', function() {
  var sassLoadPaths = [
    './app/assets/stylesheets/**/*.scss'
    //'./node_modules/bootstrap-sass/assets/stylesheets'
  ];

  watch(sassLoadPaths)
   .pipe(sass({
      // includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets'],
      onSuccess: function() { gutil.log('Scss done') }
   }))
   .pipe(gulp.dest('./app/assets/build/'));
});
