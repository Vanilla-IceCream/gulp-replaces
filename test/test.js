import fs from 'fs';
import es from 'event-stream';
import { File } from 'gulp-util';

import replaces from '../src';

process.chdir(__dirname);

describe('gulp-replaces', () => {
  it('should replace on a stream', (done) => {
    const replacesThisString = {
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.PORT': 3000,
    };

    const file = new File({
      contents: fs.createReadStream('./fixtures/main.js')
    });

    const stream = replaces(replacesThisString);

    stream.on('data', (newFile) => {
      newFile.contents.pipe(es.wait((err, data) => {
        expect(data).toMatchSnapshot();
        done();
      }));
    });

    stream.write(file);
    stream.end();
  });

  it('should replace on a Buffer', (done) => {
    const replacesThisString = {
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.PORT': 3000,
    };

    const file = new File({
      contents: fs.readFileSync('./fixtures/main.js')
    });

    const stream = replaces(replacesThisString);

    stream.on('data', (newFile) => {
      expect(String(newFile.contents)).toMatchSnapshot();
      done();
    });

    stream.write(file);
    stream.end();
  });
});
