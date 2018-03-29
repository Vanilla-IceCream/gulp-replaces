import es from 'event-stream';

export default (obj) => {
  const arr = Object.entries(obj);

  const doReplace = (file, callback) => {
    const isStream = file.contents && typeof file.contents.on === 'function' && typeof file.contents.pipe === 'function';
    const isBuffer = file.contents instanceof Buffer;

    if (isStream) {
      file.contents = file.contents.pipe(es.map((chunk, done) => {
        for (let i = 0, l = arr.length; i < l; i++) {
          const search = arr[i][0];
          const replace = arr[i][1];

          const result = String(chunk).split(search).join(replace);

          chunk = Buffer.from(result);
        }

        done(null, chunk);
      }));
    }

    if (isBuffer) {
      for (let i = 0, l = arr.length; i < l; i++) {
        const search = arr[i][0];
        const replace = arr[i][1];

        file.contents = Buffer.from(String(file.contents).split(search).join(replace));
      }
    }

    callback(null, file);
  };

  return es.map(doReplace);
};
