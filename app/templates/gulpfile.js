'use strict';

var gulp = require('gulp');
var path = require('path');
var $ = require('gulp-load-plugins')();

var paths = {
  src: 'src',
  tmp: '.tmp',
  dist: 'build',
  stylesheets: 'src/stylesheets/**/*.{sass,scss,css}',
  pages: 'src/templates/pages/*.haml',
  partials: 'src/templates/partials/**/*.haml',
  layouts: 'src/templates/layouts/*.haml',
  images: 'src/images/**/*',
  fonts: 'src/fonts/**/*.{eot,svg,ttf,woff}',
};

gulp.task('sass', function() {
  return gulp.src(paths.stylesheets)
    .pipe($.plumber())
    .pipe($.rubySass({
      style: 'expanded',
      lineNumbers: true,
      sourcemap: true,
      compass: true,
    }))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest(path.join(paths.tmp, 'stylesheets')))
    .pipe($.connect.reload());
});

gulp.task('assemble:partials', function() {
  return gulp.src(paths.partials)
    .pipe($.plumber())
    .pipe($.rubyHaml())
    .pipe(gulp.dest(path.join(paths.tmp, 'partials')));
});

gulp.task('assemble:layouts', function() {
  return gulp.src(paths.layouts)
    .pipe($.plumber())
    .pipe($.rubyHaml())
    .pipe(gulp.dest(path.join(paths.tmp, 'layouts')));
});

gulp.task('assemble', ['assemble:partials', 'assemble:layouts'], function() {
  return gulp.src(paths.pages)
    .pipe($.plumber())
    .pipe($.rubyHaml())
    .pipe($.assemble({
      partials: path.join(paths.tmp, 'partials', '**/*.html'),
      layoutdir: path.join(paths.tmp, 'layouts'),
      layout: 'default',
      layoutext: '.html',
    }))
    .pipe(gulp.dest(paths.tmp))
    .pipe($.connect.reload());
});

gulp.task('connect', function() {
  $.connect.server({
    root: [paths.tmp, paths.src],
    livereload: true,
    port: 9000,
  });
});

gulp.task('watch', function() {
  gulp.watch([paths.pages, paths.partials, paths.layouts], ['assemble']);
  gulp.watch([paths.stylesheets], ['sass']);
});

gulp.task('html', ['assemble', 'sass'], function() {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');

  return gulp.src(path.join(paths.tmp, '*.html'))
    .pipe($.plumber())
    .pipe($.useref.assets({searchPath: [paths.tmp, paths.src]}))
    .pipe(jsFilter)
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe($.useref.restore())
    .pipe($.useref())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true,
    })))
    .pipe(gulp.dest(path.join(paths.dist, 'images')));
});

gulp.task('fonts', function() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(path.join(paths.dist, 'fonts')));
});

gulp.task('clean', require('del').bind(null, [paths.tmp, paths.dist]));

gulp.task('build', ['html', 'images', 'fonts']);

gulp.task('default', ['assemble', 'sass', 'connect', 'watch']);
