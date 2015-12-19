var gulp = require('gulp'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss    = require('gulp-minify-css'),
    jshint       = require('gulp-jshint'),
    uglify       = require('gulp-uglify'),
    rename       = require('gulp-rename'),
    concat       = require('gulp-concat'),
    sourcemaps   = require('gulp-sourcemaps'),
    plumber      = require('gulp-plumber'),
    data_uri     = require('gulp-data-uri'),
    del          = require('del'),
    gutil        = require('gulp-util');


// Custom
var customThemeDir  = 'htdocs/'; //needs trailing slash!


function onError (err) {
  gutil.log(err);
  this.emit('end');
}

// gulp.task('default', ['clean'], function() {
gulp.task('default', function() {
    gulp.start('styles', 'concatstyles', 'scripts');
});

gulp.task('styles', function() {
  gutil.log(customThemeDir + 'css/sass/styles.scss');
  return gulp.src(customThemeDir + 'css/sass/styles.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sourcemaps.init())
    .pipe(sass({ style: 'expanded' }))
    .pipe(data_uri())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(sourcemaps.write(customThemeDir + 'dist/css'))
    .pipe(gulp.dest(customThemeDir +  'dist/css'))
    .pipe(livereload());
});

gulp.task('concatstyles', ['styles'], function() {
  return gulp.src([
        customThemeDir + 'css/vendor/normalize.css',
        customThemeDir + 'dist/css/styles.css',
      ])
      .pipe(concat('main.out.css'))
      .pipe(rename({suffix: '.min'}))
      .pipe(minifycss())
      .pipe(gulp.dest(customThemeDir + 'dist/css'));

});


gulp.task('scripts', function() {
  return gulp.src([
      customThemeDir + 'js/vendor/enquire.js',
      customThemeDir + 'js/vendor/**/*.js',
      customThemeDir + 'js/custom/**/*.js'
    ])
    .pipe(plumber({errorHandler: onError}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(customThemeDir + 'dist/js'));
});

gulp.task('minify', function() {
  return gulp.src([
      customThemeDir + 'dist/js/main.js'
    ])
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(customThemeDir + 'dist/js'));
});

gulp.task('jshint', function() {
  return gulp.src([
      'app/**/*.js',
      customThemeDir + 'js/custom/**/*.js'
    ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch(customThemeDir + 'css/sass/**/*.scss', ['concatstyles', 'styles']);

  // Watch .js files
  gulp.watch(customThemeDir + 'js/**/*.js', ['jshint', 'scripts']);

  gulp.watch('app/**/*.js', ['jshint']);
});

