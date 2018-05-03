'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var es = _interopDefault(require('event-stream'));

var polyfill = function () {
  var reduce = Function.bind.call(Function.call, Array.prototype.reduce);
  var isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
  var concat = Function.bind.call(Function.call, Array.prototype.concat);
  var keys = Reflect.ownKeys;

  if (!Object.entries) {
    Object.entries = function entries(O) {
      return reduce(keys(O), function (e, k) { return concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []); }, []);
    };
  }
};

function index (obj) {
  polyfill();

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

module.exports = index;
//# sourceMappingURL=gulp-replaces.cjs.js.map
