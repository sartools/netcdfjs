// Generated by CoffeeScript 1.8.0
var Header, Lexer, constants,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Lexer = require('./lexer');

constants = require('./constants');

Header = (function() {
  function Header(data) {
    this["var"] = __bind(this["var"], this);
    this.var_list = __bind(this.var_list, this);
    this.attr = __bind(this.attr, this);
    this.att_list = __bind(this.att_list, this);
    this.name = __bind(this.name, this);
    this.dim = __bind(this.dim, this);
    this.dim_list = __bind(this.dim_list, this);
    this.numrecs = __bind(this.numrecs, this);
    this.magic = __bind(this.magic, this);
    this.header = __bind(this.header, this);
    this.lex = new Lexer(data);
  }

  Header.prototype.header = function() {
    return {
      version: this.magic(),
      records: this.numrecs(),
      dimensions: this.dim_list(),
      globalattributes: this.att_list(),
      attributes: this.att_list(),
      variables: this.var_list()
    };
  };

  Header.prototype.magic = function() {
    var description, version;
    if (this.lex.string(3) !== 'CDF') {
      return this.error('Not a valid NetCDF file');
    }
    version = this.lex.byte();
    if (version !== 1 && version !== 2 && version !== 3) {
      throw new Error("I don't know how to read NetCDF version " + version);
    }
    if (version === 1) {
      description = 'Classic format';
    }
    if (version === 2) {
      description = '64 bit offset format';
    }
    return {
      number: version,
      description: description
    };
  };

  Header.prototype.numrecs = function() {
    var numrecs;
    if (this.lex.match(constants.streamingMarker)) {
      this.lex.forward(constants.streamingMarker.length);
      return {
        type: 'streaming'
      };
    } else {
      numrecs = this.lex.uint32();
      return {
        type: 'fixed',
        number: numrecs
      };
    }
  };

  Header.prototype.dim_list = function() {
    var _i, _ref, _results;
    if (this.lex.match(constants.zeroMarker)) {
      this.lex.forward(constants.zeroMarker.length);
      return null;
    }
    if (!this.lex.match(constants.dimensionMarker)) {
      throw new Error('Dimension marker not found');
    }
    this.lex.forward(constants.dimensionMarker.length);
    return (function() {
      _results = [];
      for (var _i = 1, _ref = this.lex.uint32(); 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this).map((function(_this) {
      return function() {
        return _this.dim();
      };
    })(this));
  };

  Header.prototype.dim = function() {
    var dim, _ref;
    dim = {
      name: this.name(),
      length: (_ref = this.lex.uint32()) != null ? _ref : 0
    };
    if (dim.length === 0) {
      dim.length = null;
    }
    return dim;
  };

  Header.prototype.name = function() {
    var length, res;
    length = this.lex.uint32();
    res = this.lex.string(length);
    this.lex.fill(length);
    return res;
  };

  Header.prototype.att_list = function() {
    var attr, res, _i, _ref;
    if (this.lex.match(constants.zeroMarker)) {
      this.lex.forward(constants.zeroMarker.length);
      return null;
    }
    if (!this.lex.match(constants.attributeMarker)) {
      throw new Error('Attribute marker not found');
    }
    this.lex.forward(constants.attributeMarker.length);
    res = {};
    for (_i = 1, _ref = this.lex.uint32(); 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--) {
      attr = this.attr();
      res[attr.name] = attr.value;
    }
    return res;
  };

  Header.prototype.attr = function() {
    return {
      name: this.name(),
      value: this.lex.reader(this.lex.type())(this.lex.uint32())
    };
  };

  Header.prototype.var_list = function() {
    var res, variable, _i, _ref;
    if (this.lex.match(constants.zeroMarker)) {
      this.lex.forward(constants.zeroMarker.length);
      return null;
    }
    if (!this.lex.match(constants.variableMarker)) {
      throw new Error('Variable marker not found');
    }
    this.lex.forward(constants.variableMarker.length);
    res = {};
    for (_i = 1, _ref = this.lex.uint32(); 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--) {
      variable = this["var"]();
      res[variable.name] = variable.value;
    }
    return res;
  };

  Header.prototype["var"] = function() {
    var _i, _ref, _results;
    return {
      name: this.name(),
      value: {
        dimensions: (function() {
          _results = [];
          for (var _i = 1, _ref = this.lex.uint32(); 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this).map((function(_this) {
          return function() {
            return _this.lex.uint32();
          };
        })(this)),
        attributes: this.att_list(),
        type: this.lex.type(),
        size: this.lex.uint32(),
        offset: this.lex.uint32()
      }
    };
  };

  return Header;

})();

module.exports = function(data) {
  return new Header(data).header();
};
