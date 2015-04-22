// Generated by CoffeeScript 1.9.1
var Body, Lexer,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Lexer = require('./lexer');

module.exports = Body = (function() {
  function Body(data) {
    this.slab = bind(this.slab, this);
    this.body = bind(this.body, this);
    this.lex = new Lexer(data);
  }

  Body.prototype.body = function(header, index) {
    var dim, dimensions, fill, j, key, len, reader, type, variable;
    key = Object.keys(header.variables)[index];
    variable = header.variables[key];
    dimensions = variable.dimensions.map(function(i) {
      return header.dimensions[i];
    });
    for (j = 0, len = dimensions.length; j < len; j++) {
      dim = dimensions[j];
      if (dim.length === null) {
        dim.length = header.records.number;
      }
    }
    type = variable.type;
    fill = variable.attributes._FillValue || this.lex.fillForType(type);
    reader = this.lex.readerForType(type, fill);
    this.lex.go(variable.offset);
    return {
      key: key,
      variable: variable,
      dimensions: dimensions,
      data: this.slab(dimensions, 0, reader)
    };
  };

  Body.prototype.slab = function(dimensions, index, read) {
    var dim, j, ref, results;
    if (dimensions.length === 0) {
      return read(1);
    }
    if (index === dimensions.length - 1) {
      return read(dimensions[index].length);
    }
    dim = dimensions[index];
    results = [];
    for (j = 0, ref = dim.length; 0 <= ref ? j < ref : j > ref; 0 <= ref ? j++ : j--) {
      results.push(this.slab(dimensions, index + 1, read));
    }
    return results;
  };

  return Body;

})();
