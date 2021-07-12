var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('clean-css');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var strip = require('gulp-strip-comments');
var uglify = require('gulp-uglify');
var footer = require('gulp-footer');
var less = require('gulp-less');
var header = require('gulp-header');
var sourcemaps = require('gulp-sourcemaps');
var inject = require('gulp-inject-string');
var fs = require('fs');
var pipeline = require('readable-stream').pipeline;
var minify = require('gulp-minify');

gulp.task('watch', function(){
    gulp.watch('./views/resources/fieldsetter/*.less', gulp.series('less_fieldsetter', 'js_fieldsetter'));
    gulp.watch('./views/resources/formhandler/*.less', gulp.series('less_formhandler', 'js_formhandler'));

    gulp.watch('./views/resources/src/formhandler/*.js', gulp.series('js_formhandler'));
    gulp.watch('./views/resources/src/fieldsetter/*.js', gulp.series('js_fieldsetter'));
    gulp.watch('./views/resources/src/complexecondition/*.js', gulp.series('js_complexecondition'));

    gulp.watch('./views/resources/complexecondition/complexecondition2.css', gulp.series('js_complexecondition'));
});

gulp.task('js_complexecondition', function() {
    return gulp.src([
        './views/resources/src/complexecondition/dependencies.js',
        './views/resources/src/complexecondition/Main.js',
        './views/resources/src/complexecondition/Field.js',
        './views/resources/src/complexecondition/Group.js',
        './views/resources/src/complexecondition/footer.js',
        //'./views/resources/src/complexecondition/webcomponents.js',
    ])
        .pipe(concat('./complexecondition2.js', {newLine: ';'}))
        // .pipe(header("(function($) {\n 'use strict'; var CSS = '" + (new cleanCSS({}).minify(fs.readFileSync("views/resources/complexecondition/complexecondition2.css", "utf8"))).styles + "';\n"))
        .pipe(sourcemaps.write())
        // .pipe(footer())
        .pipe(inject.prepend("(function($) {\n 'use strict'; var CSS = '" + (new cleanCSS({}).minify(fs.readFileSync("views/resources/complexecondition/complexecondition2.css", "utf8"))).styles + "';\n"))
        .pipe(inject.append("})(jQuery);"))
        .pipe(minify({
            'preserveComments': 'some',
            'ext' : {
                'min': '.min.js'
            }
        }))
        .pipe(inject.prepend(fs.readFileSync('./views/resources/src/complexecondition/head.js', "utf8")))
        .pipe(gulp.dest('./views/resources/js/'));
});

gulp.task('less_fieldsetter', function() {
    return gulp.src('./views/resources/fieldsetter/fieldsetter.less')
        .pipe(less())
        .pipe(gulp.dest('./views/resources/fieldsetter/'));
});
gulp.task('less_formhandler', function() {
    return gulp.src('./views/resources/FormHandler/formhandler.less')
        .pipe(less())
        .pipe(gulp.dest('./views/resources/formhandler/'));
});

gulp.task('js_fieldsetter', function() {
    return gulp.src([
        './views/resources/src/fieldsetter/Main.js',
        './views/resources/src/fieldsetter/Row.js',
        './views/resources/src/fieldsetter/dependencies.js',
        './views/resources/src/fieldsetter/footer.js',
        //'./views/resources/src/complexecondition/webcomponents.js',
    ])
        .pipe(concat('./fieldsetter.js', {newLine: ';'}))
        // .pipe(header("(function($) {\n 'use strict'; var CSS = '" + (new cleanCSS({}).minify(fs.readFileSync("views/resources/complexecondition/complexecondition2.css", "utf8"))).styles + "';\n"))
        .pipe(sourcemaps.write())
        // .pipe(footer())
        .pipe(inject.prepend("(function($) {\n 'use strict';  var CSS = '" + (new cleanCSS({}).minify(fs.readFileSync("./views/resources/fieldsetter/fieldsetter.css", "utf8"))).styles + "';\n"))
        .pipe(inject.append("})(jQuery);"))
        // .pipe(uglify().on('error', function(e) {
        //     console.log(e);
        // }))
        .pipe(minify({
            'preserveComments': 'some',
            'ext' : {
                'min': '.min.js'
            }
        }))
        .pipe(inject.prepend(fs.readFileSync('./views/resources/src/fieldsetter/head.js', "utf8")))
        .pipe(gulp.dest('./views/resources/js/'));
});


gulp.task('js_formhandler', function() {
    return gulp.src([
        './views/resources/src/formhandler/formhandler.js',
        //'./views/resources/src/complexecondition/webcomponents.js',
    ])
        .pipe(concat('./formhandler.js', {newLine: ';'}))
        // .pipe(header("(function($) {\n 'use strict'; var CSS = '" + (new cleanCSS({}).minify(fs.readFileSync("views/resources/complexecondition/complexecondition2.css", "utf8"))).styles + "';\n"))
        .pipe(sourcemaps.write())
        // .pipe(footer())
        .pipe(inject.prepend("(function($) {\n 'use strict';  var CSS = '" + (new cleanCSS({}).minify(fs.readFileSync("./views/resources/formhandler/formhandler.css", "utf8"))).styles + "';\n"))
        .pipe(inject.append("})(jQuery);"))
        // .pipe(uglify().on('error', function(e) {
        //     console.log(e);
        // }))
        .pipe(inject.prepend(fs.readFileSync('./views/resources/src/formhandler/head.js', "utf8")))
        .pipe(gulp.dest('./views/resources/js/'));
});


