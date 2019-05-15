"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

module.exports = {
  element: element,
  e: element,
  wrap: wrap
};

var createElement = require('react').createElement;

function element(type, data) {
  var elem = draft(type);
  var selection = new Selection([elem], elem);
  if (data) selection.datum(data);
  return selection;
}

var Selection =
/*#__PURE__*/
function () {
  function Selection(elems, root, other) {
    var _this = this;

    _classCallCheck(this, Selection);

    this.elems = elems || [];
    this.root = root;
    this._parents = [];
    elems.forEach(function (el) {
      return _this._parents.includes(el.parent) ? '_' : _this._parents.push(el.parent);
    });
    this.otherElems = other || [];
  }

  _createClass(Selection, [{
    key: "_offspring",
    value: function _offspring(elems) {
      return new Selection(elems, this.root);
    }
  }, {
    key: "_evl",
    value: function _evl(value, elem, i) {
      return typeof value == 'function' ? value(elem.datum, i, this._offspring([elem])) : value;
    }
  }, {
    key: "parents",
    value: function parents() {
      return this._offspring(this._parents);
    }
  }, {
    key: "size",
    value: function size() {
      return this.elems.length;
    }
  }, {
    key: "merge",
    value: function merge(sel) {
      return this._offspring(combine(this.elems, sel.elems));
    }
  }, {
    key: "sort",
    value: function sort(comp) {
      var _this2 = this,
          _ref;

      var groups = new Array(this._parents.length).fill([]);
      var indexes = new Array(this._parents.length).fill([]);
      var sorted = [];
      this.elems.forEach(function (el) {
        var y = _this2._parents.indexOf(el.parent);

        groups[y].push(el); // O2 on parents!

        indexes[y].push(el.parent.children.indexOf(el));
      });
      indexes.forEach(function (group) {
        return group.sort();
      });
      groups.forEach(function (group, i) {
        sorted[i] = group.slice().sort(comp ? function (a, b) {
          return comp(a.datum, b.datum, _this2._offspring([a]), _this2._offspring([b]));
        } : function (a, b) {
          if (a.datum > b.datum) return 1;else if (a.datum < b.datum) return -1;else return 0;
        });
      });
      sorted.forEach(function (group, i) {
        group.forEach(function (el, ii) {
          var pos = indexes[i][ii];
          _this2._parents[i].children[pos] = el;
        });
      });
      return this._offspring((_ref = []).concat.apply(_ref, sorted));
    }
  }, {
    key: "filter",
    value: function filter(cb) {
      var _this3 = this;

      var result = [];
      var other = [];
      this.elems.forEach(function (el, i) {
        if (cb(el.datum, i, _this3._offspring([el]))) result.push(el);else other.push(el);
      });
      return new Selection(result, this.root, other);
    }
  }, {
    key: "other",
    value: function other() {
      return this._offspring(this.otherElems);
    }
  }, {
    key: "all",
    value: function all() {
      return toReact(this.root);
    }
  }, {
    key: "child",
    value: function child(type, datum) {
      return this._append(type, datum, false);
    }
  }, {
    key: "children",
    value: function children(type, data) {
      if (arguments.length == 0) return this._offspring(this.elems.reduce(function (result, el) {
        return result.concat(el.children.filter(function (child) {
          return typeof child != 'string';
        }));
      }, []));
      return this._append(type, data, true);
    }
  }, {
    key: "append",
    value: function append(type, data) {
      return this._append(type, data, undefined);
    }
  }, {
    key: "_append",
    value: function _append(type, data, mult) {
      var _this4 = this;

      var result = [];
      this.elems.forEach(function (el, i) {
        var locData = _this4._evl(data, el, i);

        if (mult && !Array.isArray(locData)) throw new Error('Second argument to selection.children() must be an array');else if (mult === false) locData = [locData];else if (mult === undefined && !Array.isArray(locData)) locData = [locData];
        locData.forEach(function (datum) {
          var newDraft = draft(type, el);
          newDraft.datum = datum ? _this4._evl(datum, el, i) : el.datum;
          el.children.push(newDraft);
          result.push(newDraft);
        });
      });
      return this._offspring(result);
    }
  }, {
    key: "datum",
    value: function datum(value) {
      var _this5 = this;

      if (value === undefined) return this.elems[0] ? this.elems[0].datum : undefined;
      this.elems.forEach(function (el, i) {
        el.datum = _this5._evl(value, el, i);
      });
      return this;
    }
  }, {
    key: "type",
    value: function type(value) {
      var _this6 = this;

      if (value === undefined) return this.elems[0] ? this.elems[0].type : undefined;
      this.elems.forEach(function (el, i) {
        return el.type = _this6._evl(value, el, i);
      });
      return this;
    }
  }, {
    key: "attr",
    value: function attr(name, value) {
      var _this7 = this;

      if (value === undefined) return this.elems[0] ? this.elems[0].props[name] : undefined;
      this.elems.forEach(function (el, i) {
        return el.props[name] = _this7._evl(value, el, i);
      });
      return this;
    }
  }, {
    key: "prop",
    value: function prop() {
      return this.attr.apply(this, arguments);
    }
  }, {
    key: "classed",
    value: function classed(string) {
      var _this8 = this;

      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      this.elems.forEach(function (el, i) {
        var names = _this8._evl(string, el, i).split(' ');

        var classes = el.props.className.split(' ');
        names.forEach(function (name) {
          var locValue = _this8._evl(value, el, i);

          var ii = classes.indexOf(name);
          if (ii == -1 && locValue) classes.push(name);
          if (ii != -1 && !locValue) classes.splice(ii, 1);
        });
        el.props.className = classes.join(' ');
      });
      return this;
    }
  }, {
    key: "isClassed",
    value: function isClassed(names) {
      if (this.elem.length == 0) return false;
      var result = true;
      this.elems[0].props.className.split(' ');
      names.split(' ').forEach(function (value) {
        if (!classes.includes(value)) result = false;
      });
      return result;
    }
  }, {
    key: "style",
    value: function style(name, value) {
      var _this9 = this;

      if (value === undefined) return this.elems[0] ? this.elems[0].props.style[name] : undefined;
      this.elems.forEach(function (el, i) {
        return el.props.style[name] = _this9._evl(value, el, i);
      });
      return this;
    }
  }, {
    key: "text",
    value: function text(value) {
      var _this10 = this;

      this.elems.forEach(function (el, i) {
        return el.children.push(_this10._evl(value, el, i));
      });
      return this;
    }
  }]);

  return Selection;
}();

function draft(type, parent) {
  return {
    type: type,
    props: {
      style: {},
      className: ''
    },
    children: [],
    parent: parent || null,
    datum: null
  };
}

function toReact(draft) {
  if (!draft) return undefined;
  if (typeof draft == 'string') return draft;
  return createElement(draft.type, draft.props, draft.children.map(toReact));
}

function combine(ar1, ar2) {
  var result = ar1.slice();
  ar2.forEach(function (el) {
    return ar1.includes(el) ? null : result.push(el);
  });
  return result;
}

function wrap(cb, key) {
  return function (props) {
    return cb(key ? Object.assign({}, props || {}, _defineProperty({}, key, element)) : props).all();
  };
}