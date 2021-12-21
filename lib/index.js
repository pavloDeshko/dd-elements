"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = exports.withData = void 0;
var react_1 = require("react");
/**
 * Shortcut (alias to new Collection()) function to create Collection with single root element.
 * @param {ElementType} type Element type. Can be tag string or React component.
 * @param {any} [datum=null] Optional datum to be assigned to created element.
 * @return Collection that contains created root element.
 */
var e = function (type, datum) { return new Collection(type, datum); };
exports.default = e;
/**
 * Lets you return collection in functional component without calling toReact() method.
 * @param {Callback} cb Functional component which returns a Collection.
 * @returns Wrapped component.
 */
var withData = function (cb) {
    return function (props) { return cb(props).toReact(); };
};
exports.withData = withData;
/**
 * Class representing the collection of elements.
 */
var Collection = /** @class */ (function () {
    /**
     * Use to create a collection with root element for your component.
     * @param {ElementType} type Element type. Can be tag string or React component.
     * @param {any} [datum=null] Optional datum to be assigned to created element.
     * @return Collection that contains created root element.
     */
    function Collection(type, datum) {
        if (datum === void 0) { datum = null; }
        this.elements = type !== undefined ? [new Draft(type, datum, null)] : [];
        this.origin = null;
    }
    Collection.prototype.evaluate = function (value, datum, i) {
        if (typeof value == 'function') {
            return value(datum, i);
        }
        else {
            return value;
        }
    };
    /*
     * Isn't supposed to be called directly, use new Collection() or append().
     */
    Collection.create = function (elements, origin) {
        var that = new this();
        that.elements = elements;
        that.origin = origin;
        return that;
    };
    /* Children methods */
    /**
     * Appends exactly one child to every element in collection.
     * @param {ElementType} type Element type. Can be tag string or React component.
     * @param {any} [datum=null] Datum to be assigned to created element. If not specified will share its parent's datum.
     * @returns Collection which contains added elements.
     */
    Collection.prototype.child = function (type, datum) {
        var _this = this;
        var addedElements = [];
        this.elements.forEach(function (parent, i) {
            var child = new Draft(type, datum !== undefined ? _this.evaluate(datum, parent.datum, i) : parent.datum, parent);
            addedElements.push(child);
            parent.children.push(child);
        });
        return Collection.create(addedElements, this);
    };
    /**
     * Appends one child for every element in data array to each element in collection. Elements will be passed to React as a list, so every should have a unique "key" prop.
     * @param {ElementType} type Element type. Can be tag string or React component.
     * @param {any[] | number} data Requiered array with datums for every element. Alternatively can be number of elements to be added.
     * @param {Callback} keys Optional function which will return value of special prop "key" for each element.
     * @returns Collection which contains added elements.
     */
    Collection.prototype.children = function (type, data, keys) {
        var _this = this;
        if (keys === void 0) { keys = function (_, i) { return i; }; }
        var addedElements = [];
        this.elements.forEach(function (parent, i) {
            if (typeof data == 'number') {
                data = __spreadArray([], Array(data), true).map(function () { return parent.datum; });
            }
            var children = data.map(function (datum) { return new Draft(type, _this.evaluate(datum, parent.datum, i), parent); });
            /*       children.forEach((child,i)=>{
                    child.props['key'] = keys !== undefined ? this.evaluate(keys, child.datum,i) : i//TODO should you do that
                  }) */
            addedElements = addedElements.concat(children);
            parent.children = parent.children.concat([children]);
        });
        return Collection.create(addedElements, this).keys(keys);
    };
    /**
     * Appends already created elements to every element in collection.
     * @param {Collection} fragment Collection of elements to be added.
     * @returns Collection which contains added elements.
     */
    Collection.prototype.append = function (fragment) {
        var addedElements = [];
        this.elements.forEach(function (parent, i) {
            fragment.elements.forEach(function (e) {
                e.parent = parent;
            });
            addedElements = addedElements.concat(fragment.elements);
            parent.children = parent.children.concat(fragment.elements);
        });
        return Collection.create(addedElements, this);
    };
    /**
     * Use to go "up" the tree when chaining.
     * @returns Collection that contains parent elements.
     */
    Collection.prototype.parents = function () {
        return this.origin || new Collection();
    };
    /**
     * Alias to parents(). Use to go "up" the tree when chaining.
     * @returns Collection that contains parent elements.
     */
    Collection.prototype.up = function () {
        return this.parents();
    };
    /**
     * Assigns datum to every element in collection.
     * @param {any} datum Can be specified as value or function.
     * If value is specified as function, it will be called with element's(or its parent's) datum and current index inside a collection.
     * @returns Same collection.
     */
    Collection.prototype.datum = function (datum) {
        var _this = this;
        this.elements.forEach(function (e, i) {
            e.datum = _this.evaluate(datum, e.parent && e.parent.datum, i);
        });
        return this; //TODO create new collection?
    };
    /* Props methods */
    /**
     * Sets prop or attribute to all elements in collection.
     * @param {string} key String key.
     * @param {string | number | Callback} value Can be specified as value or function.
     * @returns Same collection.
     */
    Collection.prototype.prop = function (key, value) {
        var _this = this;
        this.elements.forEach(function (e, i) {
            e.props[key] = _this.evaluate(value, e.datum, i);
        });
        return this;
    };
    /**
     * Shortcut to assigns special key prop to elements in selection.
     * @param {string | number | Callback} value Should be specified as function to maintain uniquness.
     * @returns Same collection.
     */
    Collection.prototype.keys = function (value) {
        var _this = this;
        this.elements.forEach(function (e, i) {
            e.props['key'] = _this.evaluate(value, e.datum, i);
        });
        return this;
    };
    /**
     * Assings props or attributes to all elements in collection.
     * @param {Object} props Object containing key:value pairs. Values can be specified as value or function.
     * @returns Same collection.
     */
    Collection.prototype.props = function (props) {
        var _this = this;
        this.elements.forEach(function (e, i) {
            var evaled = {};
            Object.keys(props).forEach(function (k) {
                evaled[k] = _this.evaluate(props[k], e.datum, i);
            });
            e.props = __assign(__assign({}, e.props), evaled);
        });
        return this;
    };
    /**
     * Sets className prop of all elements in collection.
     * @param {string} classNames String of class names splitted by ' '.
     * @param {boolean} on Should speciefied classed be removed or added.
     * @returns Same collection.
     */
    Collection.prototype.classed = function (classNames, on) {
        var _this = this;
        if (on === void 0) { on = true; }
        var newNames = classNames.split(' ');
        this.elements.forEach(function (e, i) {
            on = _this.evaluate(on, e.datum, i);
            var names = e.props.className ? e.props.className.split(' ') : [];
            newNames.forEach(function (name) {
                var index = names.indexOf(name);
                index > -1 ?
                    !on && names.splice(index, 1) :
                    on && names.push(name);
            });
            e.props.className = names.join(' ');
        });
        return this;
    };
    /**
     * Appends text to all elements in collection.
     * @param {string} value String value. Can be specified as value or function.
     * @returns Same collection.
     */
    Collection.prototype.text = function (value) {
        var _this = this;
        this.elements.forEach(function (e, i) {
            e.children.push(_this.evaluate(value, e.datum, i));
        });
        return this;
    };
    /* React methods */
    /**
     * Converts the whole tree to which selected elements belong to valid React elements.
     * To be called before returning in functional component or render function.
     * @returns React Elements tree.
     */
    Collection.prototype.toReact = function () {
        var findRoot = function (d) { return d.parent === null ? d : findRoot(d.parent); };
        var _toReact = function (e) { return react_1.createElement.apply(void 0, __spreadArray([e.type,
            e.props], e.children.map(function (child) {
            if (typeof child === 'string') {
                return child;
            }
            else if (child instanceof Draft) {
                return _toReact(child);
            }
            else {
                return child.map(function (li) { return typeof li === 'string' ? li : _toReact(li); });
            }
        }), false)); };
        return this.elements[0] ? _toReact(findRoot(this.elements[0])) : (0, react_1.createElement)('');
    };
    return Collection;
}());
exports.Collection = Collection;
/*
 * Class representing element yet not converted to react. Not meant to be used directly, use child(), children() or append() instead.
 */
var Draft = /** @class */ (function () {
    function Draft(type, datum, parent) {
        if (datum === void 0) { datum = null; }
        this.type = type;
        this.datum = datum;
        this.parent = parent;
        this.props = {};
        this.children = [];
    }
    return Draft;
}());
