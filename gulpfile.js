
var gulp = require('gulp'),
	clean = require('gulp-clean'),
	less = require('gulp-less'),
	path = require('path'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	spritesmith = require('gulp.spritesmith'),
	imagemin = require('gulp-imagemin'),
	csso = require('gulp-csso');

	dist = 'public/',
	assets = 'assets/',

	paths = {
		html: ['*.html'],
		styles: ['styles/**/*.less'],
		pie: ['PIE.htc'],
		scripts: ['scripts/modules/**/*.js'],
		page_scripts: ['scripts/**/*.js', '!scripts/modules/**/*.js'],
		lib: ['scripts/lib/**/*.js'],
		bower: ['bower_components/**/*.*'],
		images: ['images/**/*.png', '!images/sprites/**/*.png'],
		sprites: ['images/sprites/**/*.png']
	};


gulp.task('clean', function() {
	return gulp.src(dist)
		.pipe(clean());
});

gulp.task('less', ['clean', 'sprite'], function () {
  	return gulp.src(paths.styles, { cwd: assets })
		.pipe(concat('style.css'))
		.pipe(less({
			paths: [ path.join(__dirname, 'less', 'includes') ]
		}))
		.pipe(csso())
		.pipe(gulp.dest(dist + 'styles/'));
});

gulp.task('sprite', function () {
	var spriteData = gulp.src(paths.sprites, { cwd: assets })
		.pipe(spritesmith({
			imgName: 'sprite.png',
			imgPath: '../images/sprite.png',
			cssName: 'sprite.less'
		}));
	
	spriteData.img
		.pipe(imagemin())
		.pipe(gulp.dest(dist + 'images/'));

	return spriteData.css
		.pipe(gulp.dest(assets + 'styles/'));	
});

gulp.task('scripts', ['clean'], function() {
	return gulp.src(paths.scripts, { cwd: assets })
		.pipe(uglify())
		.pipe(concat('forex.min.js'))
		.pipe(gulp.dest(dist + 'scripts/'));
});

gulp.task('copy', ['clean'], function() {
	gulp.src(paths.html, { cwd: assets })
		.pipe(gulp.dest(dist));

	gulp.src(paths.lib, { cwd: assets + '**' })
		.pipe(gulp.dest(dist));

	gulp.src(paths.page_scripts, { cwd: assets + '**' })
		.pipe(gulp.dest(dist));

	gulp.src(paths.bower, { cwd: './**' })
		.pipe(gulp.dest(dist));

	gulp.src(paths.pie, { cwd: assets + '**' })
		.pipe(gulp.dest(dist));

	gulp.src(paths.images, { cwd: assets + '**' })
		.pipe(gulp.dest(dist));
});

gulp.task('watch', function() {
	gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('build', ['clean', 'sprite', 'less', 'scripts', 'copy']);

gulp.task('default', ['build']);

