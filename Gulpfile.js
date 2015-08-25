var gulp = require('gulp');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var jsmin = require('gulp-jsmin');
var header = require('gulp-header');  
var plumber = require('gulp-plumber');
var pkg = require('./package.json');

/* Prepare banner text */
var banner = ['/**',  
	' * <%= pkg.name %> v<%= pkg.version %>',
	' * <%= pkg.description %>',
	' * ',
	' * author <%= pkg.author.name %> <<%= pkg.author.email %>>',
	' */',
	''].join('\n');

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


/**
 * Concat files in one
 */
gulp.task('merge', function() {
	return gulp.src([
			'./src/Miniscroll.js',
			'./src/Utils.js', 
			'./src/Point.js', 
			'./src/Event.js', 
			'./src/core/Update.js', 
			'./src/core/Destroy.js', 
			'./src/core/Create.js', 
			'./src/input/Mouse.js', 
			'./src/input/Touch.js', 
			'./src/input/Input.js', 
			'./src/Outro.js', 
			'./src/polyfills.js'
		])
		.pipe(concat('miniscroll.js'))
		.pipe(gulp.dest('./build'));
});

/**
 * Compress js file
 */
gulp.task('compress', function() {
	gulp.src('./build/miniscroll.js')
		.pipe(plumber())
        .pipe(jsmin())
		.pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./build'));
});

//gulp.task('default', ['compress']);

// build task for move files and etc..
gulp.task('build', ['copy', 'merge', 'compress']);
