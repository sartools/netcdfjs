// Generated by CoffeeScript 1.8.0
var Body, Lexer,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Lexer = require('./lexer');

Body = (function() {
  function Body(data) {
    this.slab = __bind(this.slab, this);
    this.body = __bind(this.body, this);
    this.lex = new Lexer(data);
  }

  Body.prototype.body = function(header, index) {
    var dim, dimensions, key, variable, _i, _len;
    key = Object.keys(header.variables)[index];
    variable = header.variables[key];
    dimensions = variable.dimensions.map(function(i) {
      return header.dimensions[i];
    });
    for (_i = 0, _len = dimensions.length; _i < _len; _i++) {
      dim = dimensions[_i];
      if (dim.length === null) {
        dim.length = header.records.number;
      }
    }
    this.lex.go(variable.offset);
    return {
      key: key,
      variable: variable,
      dimensions: dimensions
    };
  };

  Body.prototype.slab = function(dimensions, index, convert) {
    var dim, _i, _ref, _results;
    if (dimensions.length <= index) {
      return this.lex.byte();
    }
    dim = dimensions[index];
    _results = [];
    for (_i = 0, _ref = dim.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
      _results.push(this.slab(dimensions, index + 1));
    }
    return _results;
  };

  return Body;

})();

module.exports = function(data, header, index) {
  return new Body(data).body(header, index);
};
