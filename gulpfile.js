var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create(),
    config = require('./gulp.config');

var bsconfig = require('./bs-config.js');

gulp.task('server:watch', function () {
    gulp.watch('./server/dev/less/*.less', ['server:less']);
    gulp.watch('./server/dev/js/*.js', ['server:js']);
    gulp.watch('./server/dev/views/*.pug', ['server:views']);
});

gulp.task('browser-sync', function() {
    browserSync.init(bsconfig);
});

gulp.task('server:less', function () {
    gulp.src('./server/dev/less/*.less')
//        .pipe(plumber())
        .pipe($.less())
        .pipe(gulp.dest(config.server.public))
        .pipe($.cssmin())
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(config.server.public))

});

gulp.task('server:js', function() {
	gulp.src(['./server/dev/js/**/.js', './server/dev/js/*.js'])
	.pipe($.include())
//	.pipe($.jsmin())
	.pipe(gulp.dest(config.server.public))
});

gulp.task('server:views', function() {
	gulp.src('./server/dev/views/*.pug')
	.pipe($.pug({pretty:true}))
	.pipe(gulp.dest(config.server.public))
});

gulp.task('client:views', function() {
    gulp.src(config.client.index.dev)
    .pipe($.pug({pretty:true}))
    .pipe($.flatten())
    .pipe(gulp.dest(config.client.index.app));

    gulp.src(config.client.views.dev)
    .pipe($.pug({pretty:true}))
    .pipe($.angularTemplatecache(config.tplCacheOptions))    
    .pipe(gulp.dest(config.client.views.app));
});

gulp.task('client:less', function() {});
gulp.task('client:js', function() {
    gulp.src(config.client.js.dev)
    .pipe($.concat('app.js'))
    .pipe(gulp.dest(config.client.js.app))
});
gulp.task('client:watch', function() {
    gulp.watch(config.client.views.dev, ['client:views']);
    gulp.watch(config.client.index.dev, ['client:views']);
    gulp.watch(config.client.js.dev, ['client:js']);
});

gulp.task('default', ['server:views' ,'server:js', 'server:less', 'server:watch', 'client:views', 'client:js', 'client:less', 'client:watch']);
