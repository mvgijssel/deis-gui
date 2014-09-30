var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var sassGraph = require('gulp-sass-graph');

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

gulp.task('watch-sass', function() {
  var sassLoadPaths = [
    './app/assets/stylesheets/**/*.scss',
    './node_modules/bootstrap-sass/assets/stylesheets'
  ];
  //var sassLoadPaths = './app/assets/stylesheets/home.css.scss';

  // watch(sassLoadPaths)
  //   .pipe(sassGraph([
  //     './app/assets/stylesheets/home.css.scss',
  //     './node_modules/bootstrap-sass/assets/stylesheets'
  //   ]))
  //   .pipe(sass())
  //   .pipe(gulp.dest('./web/dist/css'));

  //gulp.src(sassLoadPaths)
  watch(sassLoadPaths)
   .pipe(sassGraph(sassLoadPaths))
   .pipe(sass({
      includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets'],
      onSuccess: function() { gutil.log('Scss done') }
   }))
   .pipe(gulp.dest('./web/dist/css'));

  // return watch(sassLoadPaths)
  //   .pipe(gutil.log('kerk'));

//  gutil.log(sassGraph(sassLoadPaths));

  // return
    //watch(sassLoadPaths
  //, {emitOnGlob: false, name: "Sass"})
  //   .pipe(sassGraph(sassLoadPaths))
  //   .pipe(sass({loadPath: sassLoadPaths}))
  //   .pipe(notify('Sass compiled <%= file.relative %>'))
  //   .pipe(gulp.dest('web/dist/css'))
  //   .pipe(livereload());
});
