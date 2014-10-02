var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');

var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var coffeeify = require('coffeeify');

// run multiple tasks
gulp.task('default', ['clean', 'browserify', 'sass']);

// clean all the build files
gulp.task('clean', function(){
  return gulp.src('./app/assets/build', {read: false})
        .pipe(clean());
});

// browserify target files
gulp.task('browserify', function() {
  var app_files = ['./app/frontend/app'];

  instantiateBundle('app', app_files);

  function instantiateBundle(name, files, requires) {
    var bundler= watchify(browserify({
      paths: ['./node_modules','./app/frontend/'], // to prevent writing relative paths
      cache: {},
      debug: true, // enable sourcemaps
      packageCache: {},
      fullPaths: true,
      extensions: ['.coffee']
    }));

    bundler.add(files);
    bundler.transform('coffeeify');

    bundler.on('update', function(){ createBundle(name, bundler) });
    bundler.on('log', function(msg) { gutil.log('Browserify (' + name + '):', msg); });

    createBundle(name, bundler);
  }

  function createBundle(name, bundler) {
    bundler.bundle()
      .on('error', function(err) { gutil.log('Browserify (' + name + '):', err.message); })
      .pipe(source(name + '.js'))
      .pipe(gulp.dest('./app/assets/build/'));
  }

  function logBundle(message) {

  }
});

// convert target files to sass
gulp.task('sass', function() {
  // use the following to set include paths for @import statements
  // includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets'],

  var sassLoadPaths = [
    './app/assets/stylesheets/app.scss',
  ];

  watch('./app/assets/stylesheets/**/*', buildSass);

  function buildSass() {
    gulp.src('./app/assets/stylesheets/app.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        errLogToConsole: true,
        onSuccess: function() { gutil.log('Building scss done') }
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./app/assets/build/'));
  }

  buildSass();
});
