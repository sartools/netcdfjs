// Generated by CoffeeScript 1.9.1
var arraysfill, fill, marker, size;

arraysfill = require('./arraysfill');

marker = {
  byte: [0, 0, 0, 1],
  char: [0, 0, 0, 2],
  short: [0, 0, 0, 3],
  int: [0, 0, 0, 4],
  float: [0, 0, 0, 5],
  double: [0, 0, 0, 6]
};

fill = {
  byte: -127,
  char: 0,
  short: -32767,
  int: -2147483647,
  float: 9.969209968386869e+36,
  double: 9.969209968386869e+36
};

size = {
  byte: 1,
  char: 1,
  short: 2,
  int: 4,
  float: 4,
  double: 8
};

module.exports = function(data) {
  var many, types;
  many = arraysfill(data);
  return types = {
    type: function(cb) {
      return data.read(4, function(b) {
        var k, m, match;
        match = function(marker) {
          var i, j, ref;
          for (i = j = 0, ref = marker.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            if (marker[i] !== b[i]) {
              return false;
            }
          }
          return true;
        };
        for (k in marker) {
          m = marker[k];
          if (match(m)) {
            return cb(k);
          }
        }
        throw new Error('Type not found');
      });
    },
    reader: function(type, fill) {
      var f;
      if (many[type] == null) {
        throw new Error("A reader for " + type + " not found");
      }
      f = many[type];
      if ((fill == null) || type === 'char') {
        return f;
      }
      return function(n, cb) {
        return f(n, function(b) {
          return b.map(function(v) {
            if (v === fill) {
              return null;
            }
            return v;
          });
        });
      };
    },
    fill: function(type) {
      if (fill[type] != null) {
        return fill[type];
      }
      throw new Error("No fill found for " + type);
    },
    size: function(type) {
      if (size[type] != null) {
        return size[type];
      }
      throw new Error("No size found for " + type);
    }
  };
};