// --------------------------------------------
// Dependencies
// --------------------------------------------
var autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    postcss = require('gulp-postcss'),
    concat = require('gulp-concat'),
    del = require('del'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    images = require('gulp-imagemin'),
    browserSync = require('browser-sync').create();


// paths
var styleSrc = 'source/scss/**/*.scss',
    styleDest = 'dist/css/',
    htmlSrc = 'source/*.html',
    htmlDest = 'dist/',
    vendorSrc = 'source/js/vendors/',
    vendorDest = 'dist/js/',
    scriptSrc = 'source/js/*.js',
    scriptDest = 'dist/js/',
    imgSrc = 'source/img/**/*',
    imgDest = 'dist/img/*';
    faviconSrc = 'source/favicon/**/*',
    faviconDest = 'dist/favicon/*';



// --------------------------------------------
// Stand Alone Tasks
// --------------------------------------------


// Copy HTML
gulp.task('html', function() {
    return gulp.src('source/**/*.html')
        .pipe(plumber())
        .pipe(gulp.dest('dist'));
});


// Compiles all SCSS files
gulp.task('sass', function() {
    gulp.src('source/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(postcss([autoprefixer()]))
        .pipe(rename({
            basename: 'style'
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(postcss([cssnano()]))
        .pipe(rename({
            basename: 'style',
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'));
});

// Images
gulp.task('images', function() {
    gulp.src('source/img/*')
        .pipe(plumber())
        .pipe(images())
        .pipe(gulp.dest('dist/img'));
});

// Favicon
gulp.task('favicon', function() {
    gulp.src('source/favicon/*')
        .pipe(plumber())
        .pipe(gulp.dest('dist/favicon'));
});

// Uglify js files
gulp.task('scripts', function() {
    gulp.src('source/js/*.js')
        .pipe(plumber())
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

//Concat and Compress Vendor .js files
gulp.task('vendors', function() {
    gulp.src(
            [
                'source/js/vendors/jquery.min.js',
                'source/js/vendors/*.js'
            ])
        .pipe(concat('vendors.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});



// Watch for changes
gulp.task('watch', function(){

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        notify: false
    });

    gulp.watch(htmlSrc,['html']);
    gulp.watch(imgSrc,['images']);
    gulp.watch(faviconSrc,['favicon']);
    gulp.watch(styleSrc,['sass']);
    gulp.watch(scriptSrc,['scripts']);
    gulp.watch(vendorSrc,['vendors']);
    gulp.watch(['dist/*.html', 'dist/css/*.css', 'dist/js/*.js', 'dist/js/vendors/*.js']).on('change', browserSync.reload);

});


// use default task to launch Browsersync and watch JS files
gulp.task('default', [ 'html', 'images', 'favicon', 'sass', 'scripts', 'vendors', 'watch'], function () {});
