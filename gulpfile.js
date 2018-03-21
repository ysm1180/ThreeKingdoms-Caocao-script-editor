const gulp = require('gulp');
const path = require('path');
const tsb = require('gulp-tsb');
const rimraf = require('rimraf');

function toFileUri(filePath) {
	const match = filePath.match(/^([a-z])\:(.*)$/i);

	if (match) {
		filePath = '/' + match[1].toUpperCase() + ':' + match[2];
	}

	return 'file://' + filePath.replace(/\\/g, '/');
}

const rootDir = path.join(__dirname, './src');
const options = require('./build/tsconfig.json').compilerOptions;
options.rootDir = rootDir;
options.sourceRoot = toFileUri(rootDir);
options.newLine = 'CRLF';

gulp.task('clean', function() {
	rimraf('dist', { maxBusyTries: 1}, (err) => {
		
	});
});

gulp.task('compile', ['clean'], function() {
    const compilation = tsb.create(options);

    return gulp.src('src/**/*.ts')
                .pipe(compilation())
                .pipe(gulp.dest('dist'));
});

gulp.task('default', ['compile']);