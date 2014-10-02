// TODO: add sourcemaps

var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var clean = require('gulp-clean');

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

gulp.task('browserify', function() {
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

gulp.task('sass', function() {
  var sassLoadPaths = [
    './app/assets/stylesheets/app.scss',
    //'./node_modules/bootstrap-sass/assets/stylesheets'
  ];

  watch('./app/assets/stylesheets/**/*', rebuildSass);

  function rebuildSass() {
    gulp.src('./app/assets/stylesheets/app.scss')
      .pipe(sass({
        errLogToConsole: true,
        onSuccess: function() { gutil.log('Scss done') }
      }))
      .pipe(gulp.dest('./app/assets/build/'));
  }

  //  .pipe(sass({
  //     // includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets'],
  //     onSuccess: function() { gutil.log('Scss done') }
  //  }))

});
