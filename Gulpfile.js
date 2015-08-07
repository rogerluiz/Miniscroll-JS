var gulp = require('gulp');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var header = require('gulp-header');  
var plumber = require('gulp-plumber');



/**
 * Copy files into lib folder
 */
gulp.task('copy', function() {
	var path = './bower_components/';
    gulp.src([path + 'less/dist/less.min.js',
			  path + 'jquery/dist/jquery.min.js',
			  path + 'html5shiv/dist/html5shiv.min.js',
			  path + 'modernizr/modernizr.js'])
        .pipe(gulp.dest('./lib'));
});


// build task for move files and etc..
gulp.task('build', ['copy']);