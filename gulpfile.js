'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var watch = require('gulp-watch');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var ftp = require( 'vinyl-ftp' );
var sass = require('gulp-sass');

gulp.task('sass', function () {
  return gulp.src('./assets/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('sass-minify', function () {
  return gulp.src('./assets/sass/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./assets/css'));
});

gulp.task( 'browserify', function(){
	var b = browserify({
    entries: './assets/javascript/src/main.js',
    debug: true
  });
  return b.bundle()
	  .pipe(source('./main.js')) // output file
	  .pipe(buffer())
	  .pipe(gulp.dest('./assets/javascript/dist/')); // output folder
});

gulp.task('browserify-minify', function () {
  var b = browserify({
    entries: './assets/javascript/src/main.js',
    debug: true
  });

  return b.bundle()
	  .pipe(source('./main.js')) // output file
	  .pipe(buffer())
	  .pipe(sourcemaps.init({loadMaps: true}))
	      // Add transformation tasks to the pipeline here.
	      .pipe(uglify())
	      .on('error', gutil.log)
	  .pipe(gulp.dest('./assets/javascript/dist/')); // output folder
});

gulp.task('watch', function () {
	watch( './assets/javascript/src/**/*.js', function(){
		gulp.start('browserify');
	});
  return watch('./assets/sass/**/*.scss', function(){
		gulp.start('sass');
	});
});

gulp.task( 'pack', gulp.parallel('sass-minify', 'browserify-minify') );

gulp.task('watch-pack-js', function () {
	console.log('watch-pack-js ready');
	return watch( './assets/javascript/src/**/*.js', function(){
		console.log('watch-pack-js running');
		gulp.series('browserify-minify')();
	});
});

gulp.task('watch-pack-sass', function(){
	console.log('watch-pack-sass ready');
  return watch('./assets/sass/**/*.scss')
	.on('change', function( path, stats ){
		console.log('watch-pack-sass running');
		gulp.series('sass-minify')();
	});
});

gulp.task( 'watch-pack', gulp.parallel('watch-pack-js', 'watch-pack-sass'));
