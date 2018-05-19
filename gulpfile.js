const gulp = require('gulp');
const path = require('path');
const tsb = require('gulp-tsb');
const rimraf = require('rimraf');
const htmlMin = require('gulp-htmlmin');
const cssMin = require('gulp-clean-css');
const gulptslint = require('gulp-tslint');
const electron = require('electron-connect').server.create();

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

gulp.task('clean', function () {
	return new Promise(function (resolve, reject) {
		rimraf('dist', { maxBusyTries: 1 }, (err) => {
			if (!err) {
				resolve();
			} else {
				reject(err);
			}
		});
	});
});

gulp.task('minify-css', function () {
	return gulp.src('src/**/*.css')
		.pipe(cssMin())
		.pipe(gulp.dest('dist'));
});

gulp.task('minify-html', function () {
	return gulp.src('src/**/*.html')
		.pipe(htmlMin({
			collapseWhitespace: true,
			minifyCSS: true,
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('move-assets', function () {
	return gulp.src('src/**/*.svg')
		.pipe(gulp.dest('dist'));
})

gulp.task('source', gulp.parallel('minify-css', 'minify-html', 'move-assets'));

gulp.task('compile-ts', function (done) {
	const compilation = tsb.create(options);

	return gulp.src('src/**/*.ts', { base: 'src' })
		.pipe(compilation())
		.pipe(gulp.dest('dist'));
});

gulp.task('compile-js', function (done) {
	return gulp.src('src/**/*.js')
		.pipe(gulp.dest('dist'));
});

gulp.task('compile', gulp.series('compile-ts', 'compile-js'));

gulp.task('tslint', function () {
	return gulp.src('src/**/*.ts')
		.pipe(gulptslint.default())
		.pipe(gulptslint.default.report({ emitError: true }));
});

gulp.task('electron-restart', function (done) {
	electron.restart();
	done();
});

gulp.task('electron-reload', function (done) {
	electron.reload();
	done();
});

gulp.task('watch', function (done) {
	electron.start();

	gulp.watch(['src/**/*.css'], gulp.series('minify-css', 'electron-reload'));
	gulp.watch(['src/**/*.ts'], gulp.series('tslint', 'compile', 'electron-restart'));
	gulp.watch(['src/**/*.svg'], gulp.series('move-assets', 'electron-restart'));

	done();
});

gulp.task('build', gulp.series('tslint', 'clean', 'source', 'compile', 'watch'));
