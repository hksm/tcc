'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');

var jsFiles = './app/**/*.js';

gulp.task('default', ['jshint']);

gulp.task('jshint', () => {
	gulp.src(jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});