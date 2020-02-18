const gulp = require('gulp');
const path = require('path');
const rimraf = require('rimraf');
const htmlMin = require('gulp-htmlmin');
const cssMin = require('gulp-clean-css');
const gulptslint = require('gulp-tslint');
const electron = require('electron-connect').server.create();
var ts = require('gulp-typescript');
const tsProject = ts.createProject('src/tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');

function toFileUri(filePath) {
    const match = filePath.match(/^([a-z]):(.*)$/i);

    if (match) {
        filePath = '/' + match[1].toUpperCase() + ':' + match[2];
    }

    return 'file://' + filePath.replace(/\\/g, '/');
}

const rootDir = path.join(__dirname, './src');
const options = require('./src/tsconfig.json').compilerOptions;
options.rootDir = rootDir;
options.sourceRoot = toFileUri(rootDir);
options.newLine = 'CRLF';

const clean = function() {
    return new Promise(function(resolve, reject) {
        rimraf('dist', { maxBusyTries: 1 }, (err) => {
            if (!err) {
                resolve();
            } else {
                reject(err);
            }
        });
    });
};

const minifyCss = function() {
    return gulp
        .src('src/**/*.css')
        .pipe(cssMin())
        .pipe(gulp.dest('dist'));
};

const minifyHtml = function() {
    return gulp
        .src('src/**/*.html')
        .pipe(
            htmlMin({
                collapseWhitespace: true,
                minifyCSS: true,
            })
        )
        .pipe(gulp.dest('dist/'));
};

const moveAssets = function() {
    return gulp.src('src/**/*.svg').pipe(gulp.dest('dist/'));
};

const compileTypescript = function() {
    return gulp
        .src('src/**/*.ts', { base: 'src' })
        .pipe(tsProject())
        .js.pipe(sourcemaps.init()).pipe(sourcemaps.write()).pipe(gulp.dest('dist/'));
};

const compileJavascript = function() {
    return gulp.src('src/**/*.js').pipe(sourcemaps.init()).pipe(sourcemaps.write()).pipe(gulp.dest('dist/'));
};

const electronRestart = function(done) {
    electron.restart();
    done();
};

const electronReload = function(done) {
    electron.reload();
    done();
};

gulp.task('clean', clean);

gulp.task('minify-css', minifyCss);

gulp.task('minify-html', minifyHtml);

gulp.task('move-assets', moveAssets);

gulp.task('source', gulp.parallel(minifyCss, minifyHtml, moveAssets));

gulp.task('compile-ts', compileTypescript);

gulp.task('compile-js', compileJavascript);

gulp.task('compile', gulp.series('compile-ts', 'compile-js'));
gulp.task('tslint', function() {
    return gulp
        .src('src/**/*.ts')
        .pipe(gulptslint.default())
        .pipe(gulptslint.default.report({ emitError: true }));
});

gulp.task('electron-restart', electronRestart);

gulp.task('electron-reload', electronReload);

gulp.task('watch', function(done) {
    electron.start();
    
    gulp.watch(['src/**/*.css'], gulp.series('minify-css', 'electron-reload'));
    gulp.watch(['src/**/*.ts'], gulp.series('tslint', 'compile', 'electron-restart'));
    gulp.watch(['src/**/*.svg'], gulp.series('move-assets', 'electron-restart'));

    done();
});

gulp.task('development', gulp.series('tslint', 'clean', 'source', 'compile', 'watch'));

gulp.task('build', gulp.series('tslint', 'clean', 'source', 'compile'));
