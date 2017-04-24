'use strict';

var gulp = require('gulp');
var webserver = require('gulp-webserver');
var jshint = require('gulp-jshint');

var jsFiles = './app/**/*.js';

gulp.task('default', ['jshint', 'webserver', 'watch']);

gulp.task('jshint', () => {
	gulp.src(jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('watch', () => {
	gulp.watch(jsFiles, ['jshint']);
});

gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      fallback: 'index.html'
    }));
});