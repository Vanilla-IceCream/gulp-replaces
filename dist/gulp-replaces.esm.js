import es from 'event-stream';

function index (obj) {
  var arr = Object.entries(obj);

  var doReplace = function (file, callback) {
    var isStream = file.contents && typeof file.contents.on === 'function' && typeof file.contents.pipe === 'function';
    var isBuffer = file.contents instanceof Buffer;

    if (isStream) {
      file.contents = file.contents.pipe(es.map(function (chunk, done) {
        for (var i = 0, l = arr.length; i < l; i++) {
          var search = arr[i][0];
          var replace = arr[i][1];

          var result = String(chunk).split(search).join(replace);

          chunk = Buffer.from(result);
        }

        done(null, chunk);
      }));
    }

    if (isBuffer) {
      for (var i = 0, l = arr.length; i < l; i++) {
        var search = arr[i][0];
        var replace = arr[i][1];

        file.contents = Buffer.from(String(file.contents).split(search).join(replace));
      }
    }

    callback(null, file);
  };

  return es.map(doReplace);
}

export default index;
//# sourceMappingURL=gulp-replaces.esm.js.map
