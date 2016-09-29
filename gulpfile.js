var gulp = require('gulp'),
    less = require('gulp-less'),
    cssmin = require('gulp-cssmin'),
//    plumber = require('gulp-plumber'),
    include = require('gulp-include'),
    jsmin = require('gulp-jsmin'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create();

var bsconfig = require('./bs-config.js');

gulp.task('watch', function () {
    gulp.watch('./less/*.less', ['less']);
    gulp.watch('./js/*.js', ['js']);
});

gulp.task('browser-sync', function() {
    browserSync.init(bsconfig);
});

gulp.task('less', function () {
    gulp.src('./less/*.less')
//        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest('./public/'))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./public'))

});

gulp.task('js', function() {
	gulp.src('./js/*.js')
	.pipe(include())
//	.pipe(jsmin())
	.pipe(gulp.dest('./public'))
});

gulp.task('default', ['js', 'less', 'watch', 'browser-sync']);
