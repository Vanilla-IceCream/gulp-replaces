# gulp-replaces [![Build Status](https://travis-ci.org/Vanilla-IceCream/gulp-replaces.svg?branch=master)](https://travis-ci.org/Vanilla-IceCream/gulp-replaces) [![Coverage Status](https://coveralls.io/repos/github/Vanilla-IceCream/gulp-replaces/badge.svg)](https://coveralls.io/github/Vanilla-IceCream/gulp-replaces)

Gulp plugin for replace strings in files.

## Install

```bash
$ npm i gulp-replaces -D
# or
$ yarn add gulp-replaces -D
```

## Usage

```js
// gulpfile.babel.js
import gulp from 'gulp';
import replaces from 'gulp-replaces';

gulp.task('default', () => {
  return gulp
    .src('./main.js')
    .pipe(replaces({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.PORT': 3000,
    }))
    .pipe(gulp.dest('.'));
});
```