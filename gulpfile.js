'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

const config = {
  styles:  {
    watch: './src/scss/**/*.scss',
    src: './src/scss/styles.scss',
    dest: './css/'
  },
  html: {
    src:'./src/**/*.html'
  },
  js: {
    src: './src/js/**/*.js',
    dest: './js'
  }
}

gulp.task('sass', function () {
  return gulp.src(config.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(config.styles.dest));
});

gulp.task('sass:watch', function () {
  gulp.watch(config.styles.watch, ['sass']);
});

gulp.task('html:watch', function () {
  return gulp.watch(config.html.src, ['html:minify']);
});

gulp.task('html:minify', function() {
  return gulp.src('src/*.html')
    .pipe(plumber())
    .pipe(htmlmin({collapseWhitespace: true}))
    .on('error', gutil.log)
    .pipe(gulp.dest('./'));
});

gulp.task('js', function() {
  return gulp.src(config.js.src)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(config.js.dest));
});

gulp.task('js:watch', function () {
  gulp.watch(config.js.src, ['js']);
});

gulp.task('build', ['html:minify', 'sass', 'js'])

gulp.task('watch', ['html:watch', 'sass:watch', 'js:watch']);

gulp.task('default', function(cb) {
   runSequence('build', 'watch', cb);
});
