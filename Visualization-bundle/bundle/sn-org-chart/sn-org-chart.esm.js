/*
* @nebula.js/sn-org-chart v0.15.0
* Copyright (c) 2021 QlikTech International AB
* Released under the MIT license.
*/

import { useElement, onTakeSnapshot, useImperativeHandle, useState, useSelections, useLayout, useEffect, useAction, useStaleLayout, useModel, useTheme, useOptions, useRect, useConstraints, useTranslator, usePromise } from '@nebula.js/stardust';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var properties = {
  qHyperCubeDef: {
    qDimensions: [],
    qMeasures: [],
    qInitialDataFetch: [{
      qWidth: 5,
      qHeight: 500
    }],
    qSuppressZero: false,
    qSuppressMissing: true
  },

  /**
   * @type {boolean}
   */
  showTitles: true,

  /**
   * @type {string}
   */
  title: '',

  /**
   * @type {string}
   */
  subtitle: '',

  /**
   * @type {string}
   */
  footnote: '',

  /**
   * @type {'regular'|'scroll'|'free'}
   */
  navigationMode: 'free',

  /**
   * @type {boolean}
   */
  resizeOnExpand: false,

  /**
   * @type {object}
   */
  style: {
    /**
     * @type {object}
     */
    fontColor: {
      /**
       * @type {'auto'|'colorPicker'|'byExpression'}
       */
      colorType: 'auto',

      /**
       * @type {object}
       */
      color: {
        index: -1,
        color: '#484848'
      },

      /**
       * @type {string}
       */
      colorExpression: ''
    },

    /**
     * @type {object}
     */
    backgroundColor: {
      /**
       * @type {'auto'|'colorPicker'|'byExpression'}
       */
      colorType: 'colorPicker',

      /**
       * @type {object}
       */
      color: {
        index: -1,
        color: '#ffffff'
      },

      /**
       * @type {string}
       */
      colorExpression: ''
    },

    /**
     * @type {object}
     */
    border: {
      /**
       * @type {boolean}
       */
      top: true,

      /**
       * @type {boolean}
       */
      fullBorder: true,

      /**
       * @type {string}
       */
      colorType: 'auto',

      /**
       * @type {object}
       */
      color: {
        index: -1,
        color: '#737373'
      },

      /**
       * @type {string}
       */
      colorExpression: ''
    }
  }
};

var data = {
  targets: [{
    path: '/qHyperCubeDef',
    dimensions: {
      min: 2,
      max: 2
    },
    measures: {
      min: 0,
      max: 1
    }
  }]
};

function getValue(dataContainer, reference, defaultValue) {
  var steps = reference.split('.');
  var i;

  if (dataContainer === undefined) {
    return defaultValue;
  }

  var currentValue = dataContainer;

  for (i = 0; i < steps.length; ++i) {
    if (typeof currentValue[steps[i]] === 'undefined') {
      return defaultValue;
    }

    currentValue = currentValue[steps[i]];
  }

  return currentValue;
}

var propertyResolver = {
  getValue: getValue
};

var colorOptions = [{
  value: 'auto',
  translation: 'Common.Auto'
}, {
  value: 'colorPicker',
  translation: 'properties.colorMode.primary'
}, {
  value: 'byExpression',
  translation: 'properties.colorMode.byExpression'
}];
var navigationOptions = [{
  value: 'free',
  translation: 'Object.OrgChart.FreeMode'
}, {
  value: 'expandAll',
  translation: 'Object.OrgChart.ExpandAll'
}];

var bordersActive = function bordersActive(data) {
  return propertyResolver.getValue(data, 'style.border.top') || propertyResolver.getValue(data, 'style.border.fullBorder');
};

var extDef = {
  definition: {
    type: 'items',
    component: 'accordion',
    items: {
      data: {
        uses: 'data',
        items: {
          measures: {
            disabledRef: ''
          },
          dimensions: {
            disabledRef: '',
            items: {
              dimensionLimits: {
                show: false
              },
              attributes: {
                component: 'attribute-expression-reference',
                defaultValue: [],
                show: function show(dim, handler) {
                  var dims = handler.getDimensions();
                  return dims[0] === dim;
                },
                ref: 'qAttributeExpressions',
                items: [{
                  component: 'expression',
                  ref: 'qExpression',
                  translation: 'Object.OrgChart.LabelExpression',
                  defaultValue: '',
                  id: 'labelExpression',
                  tid: 'labelExpression'
                }, {
                  component: 'expression',
                  ref: 'qExpression',
                  translation: 'Object.OrgChart.SubLabelExpression',
                  defaultValue: '',
                  id: 'subLabelExpression',
                  tid: 'subLabelExpression'
                }, {
                  component: 'expression',
                  ref: 'qExpression',
                  translation: 'Object.OrgChart.ExtraLabelExpression',
                  defaultValue: '',
                  id: 'extraLabelExpression',
                  tid: 'extraLabelExpression'
                }, {
                  component: 'expression',
                  ref: 'qExpression',
                  translation: 'Object.OrgChart.ColorLabelExpression',
                  defaultValue: '',
                  id: 'colorByExpression',
                  tid: 'nodeColorByExpression'
                }]
              },
              desc: {
                show: function show(dim, handler) {
                  var dims = handler.getDimensions();
                  return dims[0] === dim;
                },
                component: 'text',
                translation: 'Object.OrgChart.ExtraLabelDesc',
                style: 'hint'
              }
            }
          }
        }
      },
      sorting: {
        uses: 'sorting'
      },
      addOns: {
        type: 'items',
        component: 'expandable-items',
        translation: 'properties.addons',
        items: {
          dataHandling: {
            uses: 'dataHandling',
            items: {
              calcCond: {
                uses: 'calcCond'
              },
              rowLimit: {
                type: 'integer',
                translation: '$RowLimit',
                ref: 'rowLimit',
                defaultValue: 30000,
                min: 5000,
                max: 100000,
                show: false
              }
            }
          }
        }
      },
      settings: {
        uses: 'settings',
        items: {
          styling: {
            grouped: true,
            translation: 'properties.presentation',
            type: 'items',
            items: {
              navigation: {
                type: 'items',
                items: {
                  navigationMode: {
                    ref: 'navigationMode',
                    type: 'string',
                    translation: 'Object.OrgChart.NavigationMode',
                    component: 'dropdown',
                    options: navigationOptions
                  },
                  resizeOnExpand: {
                    ref: 'resizeOnExpand',
                    type: 'boolean',
                    translation: 'Object.OrgChart.resizeOnExpand',
                    show: function show(data) {
                      return propertyResolver.getValue(data, 'navigationMode') !== 'expandAll';
                    }
                  }
                }
              },
              backgroundColor: {
                type: 'items',
                items: {
                  useColorExpression: {
                    ref: 'style.backgroundColor.colorType',
                    type: 'string',
                    translation: 'Object.OrgChart.BackgroundColor',
                    component: 'dropdown',
                    options: colorOptions
                  },
                  colorPicker: {
                    component: 'color-picker',
                    type: 'object',
                    ref: 'style.backgroundColor.color',
                    translation: 'properties.color',
                    dualOutput: true,
                    show: function show(data) {
                      return propertyResolver.getValue(data, 'style.backgroundColor.colorType') === 'colorPicker';
                    }
                  },
                  colorExpression: {
                    component: 'string',
                    type: 'string',
                    ref: 'style.backgroundColor.colorExpression',
                    translation: 'Common.Expression',
                    expression: 'optional',
                    show: function show(data) {
                      return propertyResolver.getValue(data, 'style.backgroundColor.colorType') === 'byExpression';
                    }
                  }
                }
              },
              fontColor: {
                type: 'items',
                items: {
                  useColorExpression: {
                    ref: 'style.fontColor.colorType',
                    type: 'string',
                    translation: 'Object.OrgChart.FontColor',
                    component: 'dropdown',
                    options: colorOptions
                  },
                  colorPicker: {
                    component: 'color-picker',
                    type: 'object',
                    ref: 'style.fontColor.color',
                    translation: 'properties.color',
                    dualOutput: true,
                    show: function show(data) {
                      return propertyResolver.getValue(data, 'style.fontColor.colorType') === 'colorPicker';
                    }
                  },
                  colorExpression: {
                    component: 'string',
                    type: 'string',
                    ref: 'style.fontColor.colorExpression',
                    translation: 'Common.Expression',
                    expression: 'optional',
                    show: function show(data) {
                      return propertyResolver.getValue(data, 'style.fontColor.colorType') === 'byExpression';
                    }
                  }
                }
              },
              border: {
                type: 'items',
                items: {
                  appearanceHeader: {
                    component: 'text',
                    translation: 'Object.OrgChart.CardAppearance',
                    style: 'pp-nm-hcd__list-header'
                  },
                  topBar: {
                    type: 'boolean',
                    ref: 'style.border.top',
                    translation: 'Object.OrgChart.TopBar',
                    defaultValue: true
                  },
                  fullBorder: {
                    type: 'boolean',
                    ref: 'style.border.fullBorder',
                    translation: 'properties.border',
                    defaultValue: false
                  },
                  colorType: {
                    component: 'dropdown',
                    type: 'string',
                    ref: 'style.border.colorType',
                    translation: 'properties.border.color',
                    defaultValue: 'auto',
                    options: colorOptions,
                    show: function show(data) {
                      return bordersActive(data);
                    }
                  },
                  colorPicker: {
                    component: 'color-picker',
                    type: 'object',
                    ref: 'style.border.color',
                    translation: 'properties.color',
                    dualOutput: true,
                    show: function show(data) {
                      return bordersActive(data) && propertyResolver.getValue(data, 'style.border.colorType') === 'colorPicker';
                    }
                  },
                  colorExpression: {
                    component: 'string',
                    type: 'string',
                    ref: 'style.border.colorExpression',
                    translation: 'Common.Expression',
                    expression: 'optional',
                    show: function show(data) {
                      return bordersActive(data) && propertyResolver.getValue(data, 'style.border.colorType') === 'byExpression';
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  support: {
    export: true,
    exportData: true,
    snapshot: true,
    viewData: true
  }
};

function ext()
/* env */
{
  return extDef;
}

function ascending (a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function bisector (compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function left(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;

      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;else hi = mid;
      }

      return lo;
    },
    right: function right(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;

      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;else lo = mid + 1;
      }

      return lo;
    }
  };
}

function ascendingComparator(f) {
  return function (d, x) {
    return ascending(f(d), x);
  };
}

var ascendingBisect = bisector(ascending);

var noop = {
  value: function value() {}
};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }

  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function (t) {
    var name = "",
        i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {
      type: t,
      name: name
    };
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function on(typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length; // If no callback was specified, return the callback of the given type and name.

    if (arguments.length < 2) {
      while (++i < n) {
        if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
      }

      return;
    } // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.


    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);

    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);else if (callback == null) for (t in _) {
        _[t] = set(_[t], typename.name, null);
      }
    }

    return this;
  },
  copy: function copy() {
    var copy = {},
        _ = this._;

    for (var t in _) {
      copy[t] = _[t].slice();
    }

    return new Dispatch(copy);
  },
  call: function call(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) {
      args[i] = arguments[i + 2];
    }
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);

    for (t = this._[type], i = 0, n = t.length; i < n; ++i) {
      t[i].value.apply(that, args);
    }
  },
  apply: function apply(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);

    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) {
      t[i].value.apply(that, args);
    }
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }

  if (callback != null) type.push({
    name: name,
    value: callback
  });
  return type;
}

var xhtml = "http://www.w3.org/1999/xhtml";
var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

function namespace (name) {
  var prefix = name += "",
      i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {
    space: namespaces[prefix],
    local: name
  } : name;
}

function creatorInherit(name) {
  return function () {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml ? document.createElement(name) : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function () {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function creator (name) {
  var fullname = namespace(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}

function none() {}

function selector (selector) {
  return selector == null ? none : function () {
    return this.querySelector(selector);
  };
}

function selection_select (select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function empty() {
  return [];
}

function selectorAll (selector) {
  return selector == null ? empty : function () {
    return this.querySelectorAll(selector);
  };
}

function selection_selectAll (select) {
  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection(subgroups, parents);
}

function matcher (selector) {
  return function () {
    return this.matches(selector);
  };
}

function selection_filter (match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function sparse (update) {
  return new Array(update.length);
}

function selection_enter () {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
}
function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}
EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function appendChild(child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function insertBefore(child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function querySelector(selector) {
    return this._parent.querySelector(selector);
  },
  querySelectorAll: function querySelectorAll(selector) {
    return this._parent.querySelectorAll(selector);
  }
};

function constant (x) {
  return function () {
    return x;
  };
}

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length; // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.

  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  } // Put any non-null nodes that don’t fit into exit.


  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue; // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.

  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);

      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  } // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.


  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);

    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  } // Add any remaining nodes that were not bound to data to exit.


  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && nodeByKeyValue[keyValues[i]] === node) {
      exit[i] = node;
    }
  }
}

function selection_data (value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function (d) {
      data[++j] = d;
    });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;
  if (typeof value !== "function") value = constant(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);
    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key); // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.

    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;

        while (!(next = updateGroup[i1]) && ++i1 < dataLength) {
        }

        previous._next = next || null;
      }
    }
  }

  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

function selection_exit () {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
}

function selection_join (onenter, onupdate, onexit) {
  var enter = this.enter(),
      update = this,
      exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null) update = onupdate(update);
  if (onexit == null) exit.remove();else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

function selection_merge (selection) {
  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection(merges, this._parents);
}

function selection_order () {
  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}

function selection_sort (compare) {
  if (!compare) compare = ascending$1;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }

    sortgroup.sort(compareNode);
  }

  return new Selection(sortgroups, this._parents).order();
}

function ascending$1(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function selection_call () {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

function selection_nodes () {
  var nodes = new Array(this.size()),
      i = -1;
  this.each(function () {
    nodes[++i] = this;
  });
  return nodes;
}

function selection_node () {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}

function selection_size () {
  var size = 0;
  this.each(function () {
    ++size;
  });
  return size;
}

function selection_empty () {
  return !this.node();
}

function selection_each (callback) {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}

function attrRemove(name) {
  return function () {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function () {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function () {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function () {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function selection_attr (name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }

  return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
}

function defaultView (node) {
  return node.ownerDocument && node.ownerDocument.defaultView || // node is a Node
  node.document && node // node is a Window
  || node.defaultView; // node is a Document
}

function styleRemove(name) {
  return function () {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function () {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);else this.style.setProperty(name, v, priority);
  };
}

function selection_style (name, value, priority) {
  return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}
function styleValue(node, name) {
  return node.style.getPropertyValue(name) || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}

function propertyRemove(name) {
  return function () {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function () {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];else this[name] = v;
  };
}

function selection_property (name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function add(name) {
    var i = this._names.indexOf(name);

    if (i < 0) {
      this._names.push(name);

      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function remove(name) {
    var i = this._names.indexOf(name);

    if (i >= 0) {
      this._names.splice(i, 1);

      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function contains(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node),
      i = -1,
      n = names.length;

  while (++i < n) {
    list.add(names[i]);
  }
}

function classedRemove(node, names) {
  var list = classList(node),
      i = -1,
      n = names.length;

  while (++i < n) {
    list.remove(names[i]);
  }
}

function classedTrue(names) {
  return function () {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function () {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function () {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function selection_classed (name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()),
        i = -1,
        n = names.length;

    while (++i < n) {
      if (!list.contains(names[i])) return false;
    }

    return true;
  }

  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}

function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function () {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function () {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function selection_text (value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
}

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function () {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function () {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function selection_html (value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function selection_raise () {
  return this.each(raise);
}

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function selection_lower () {
  return this.each(lower);
}

function selection_append (name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function () {
    return this.appendChild(create.apply(this, arguments));
  });
}

function constantNull() {
  return null;
}

function selection_insert (name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function () {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function selection_remove () {
  return this.each(remove);
}

function selection_cloneShallow() {
  var clone = this.cloneNode(false),
      parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true),
      parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_clone (deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

function selection_datum (value) {
  return arguments.length ? this.property("__data__", value) : this.node().__data__;
}

var filterEvents = {};
var event$1 = null;

if (typeof document !== "undefined") {
  var element = document.documentElement;

  if (!("onmouseenter" in element)) {
    filterEvents = {
      mouseenter: "mouseover",
      mouseleave: "mouseout"
    };
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function (event) {
    var related = event.relatedTarget;

    if (!related || related !== this && !(related.compareDocumentPosition(this) & 8)) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function (event1) {
    var event0 = event$1; // Events can be reentrant (e.g., focus).

    event$1 = event1;

    try {
      listener.call(this, this.__data__, index, group);
    } finally {
      event$1 = event0;
    }
  };
}

function parseTypenames$1(typenames) {
  return typenames.trim().split(/^|\s+/).map(function (t) {
    var name = "",
        i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {
      type: t,
      name: name
    };
  });
}

function onRemove(typename) {
  return function () {
    var on = this.__on;
    if (!on) return;

    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }

    if (++i) on.length = i;else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function (d, i, group) {
    var on = this.__on,
        o,
        listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = {
      type: typename.type,
      name: typename.name,
      value: value,
      listener: listener,
      capture: capture
    };
    if (!on) this.__on = [o];else on.push(o);
  };
}

function selection_on (typename, value, capture) {
  var typenames = parseTypenames$1(typename + ""),
      i,
      n = typenames.length,
      t;

  if (arguments.length < 2) {
    var on = this.node().__on;

    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;

  for (i = 0; i < n; ++i) {
    this.each(on(typenames[i], value, capture));
  }

  return this;
}
function customEvent(event1, listener, that, args) {
  var event0 = event$1;
  event1.sourceEvent = event$1;
  event$1 = event1;

  try {
    return listener.apply(that, args);
  } finally {
    event$1 = event0;
  }
}

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function () {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function () {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function selection_dispatch (type, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
}

var root = [null];
function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selection_selectAll,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch
};

function select (selector) {
  return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
}

function sourceEvent () {
  var current = event$1,
      source;

  while (source = current.sourceEvent) {
    current = source;
  }

  return current;
}

function point (node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
}

function mouse (node) {
  var event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];
  return point(node, event);
}

function touch (node, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return point(node, touch);
    }
  }

  return null;
}

function noevent () {
  event$1.preventDefault();
  event$1.stopImmediatePropagation();
}

function dragDisable (view) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", noevent, true);

  if ("onselectstart" in root) {
    selection.on("selectstart.drag", noevent, true);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}
function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", null);

  if (noclick) {
    selection.on("click.drag", noevent, true);
    setTimeout(function () {
      selection.on("click.drag", null);
    }, 0);
  }

  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}

function define (constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);

  for (var key in definition) {
    prototype[key] = definition[key];
  }

  return prototype;
}

function Color() {}
var _darker = 0.7;

var _brighter = 1 / _darker;
var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex = /^#([0-9a-f]{3,8})$/,
    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");
var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};
define(Color, color, {
  copy: function copy(channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable: function displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});

function color_formatHex() {
  return this.rgb().formatHex();
}

function color_formatHsl() {
  return hslConvert(this).formatHsl();
}

function color_formatRgb() {
  return this.rgb().formatRgb();
}

function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
  : l === 3 ? new Rgb(m >> 8 & 0xf | m >> 4 & 0xf0, m >> 4 & 0xf | m & 0xf0, (m & 0xf) << 4 | m & 0xf, 1) // #f00
  : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
  : l === 4 ? rgba(m >> 12 & 0xf | m >> 8 & 0xf0, m >> 8 & 0xf | m >> 4 & 0xf0, m >> 4 & 0xf | m & 0xf0, ((m & 0xf) << 4 | m & 0xf) / 0xff) // #f000
  : null // invalid hex
  ) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
  : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
  : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
  : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
  : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
  : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
  : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
  : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}
define(Rgb, rgb, extend(Color, {
  brighter: function brighter(k) {
    k = k == null ? _brighter : Math.pow(_brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function darker(k) {
    k = k == null ? _darker : Math.pow(_darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function rgb() {
    return this;
  },
  displayable: function displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: rgb_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));

function rgb_formatHex() {
  return "#" + hex(this.r) + hex(this.g) + hex(this.b);
}

function rgb_formatRgb() {
  var a = this.opacity;
  a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
  return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
}

function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;else if (l <= 0 || l >= 1) h = s = NaN;else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl();
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;

  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;else if (g === max) h = (b - r) / s + 2;else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }

  return new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hsl, hsl, extend(Color, {
  brighter: function brighter(k) {
    k = k == null ? _brighter : Math.pow(_brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function darker(k) {
    k = k == null ? _darker : Math.pow(_darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function rgb() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
  },
  displayable: function displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl: function formatHsl() {
    var a = this.opacity;
    a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "hsl(" : "hsla(") + (this.h || 0) + ", " + (this.s || 0) * 100 + "%, " + (this.l || 0) * 100 + "%" + (a === 1 ? ")" : ", " + a + ")");
  }
}));
/* From FvD 13.37, CSS Color Module Level 3 */

function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}

function constant$1 (x) {
  return function () {
    return x;
  };
}

function linear(a, d) {
  return function (t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function (t) {
    return Math.pow(a + t * b, y);
  };
}
function gamma(y) {
  return (y = +y) === 1 ? nogamma : function (a, b) {
    return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
  };
}
function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant$1(isNaN(a) ? b : a);
}

var interpolateRgb = (function rgbGamma(y) {
  var color = gamma(y);

  function rgb$1(start, end) {
    var r = color((start = rgb(start)).r, (end = rgb(end)).r),
        g = color(start.g, end.g),
        b = color(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function (t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb$1.gamma = rgbGamma;
  return rgb$1;
})(1);

function interpolateNumber (a, b) {
  return a = +a, b = +b, function (t) {
    return a * (1 - t) + b * t;
  };
}

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function zero(b) {
  return function () {
    return b;
  };
}

function one(b) {
  return function (t) {
    return b(t) + "";
  };
}

function interpolateString (a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0,
      // scan index for next number in b
  am,
      // current match in a
  bm,
      // current match in b
  bs,
      // string preceding current number in b, if any
  i = -1,
      // index in s
  s = [],
      // string constants and placeholders
  q = []; // number interpolators
  // Coerce inputs to strings.

  a = a + "", b = b + ""; // Interpolate pairs of numbers in a & b.

  while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) {
      // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    if ((am = am[0]) === (bm = bm[0])) {
      // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else {
      // interpolate non-matching numbers
      s[++i] = null;
      q.push({
        i: i,
        x: interpolateNumber(am, bm)
      });
    }

    bi = reB.lastIndex;
  } // Add remains of b.


  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  } // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.


  return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function (t) {
    for (var i = 0, o; i < b; ++i) {
      s[(o = q[i]).i] = o.x(t);
    }

    return s.join("");
  });
}

var degrees = 180 / Math.PI;
var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function decompose (a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
}

var cssNode, cssRoot, cssView, svgNode;
function parseCss(value) {
  if (value === "none") return identity;
  if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
  cssNode.style.transform = value;
  value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
  cssRoot.removeChild(cssNode);
  value = value.slice(7, -1).split(",");
  return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
}
function parseSvg(value) {
  if (value == null) return identity;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}

function interpolateTransform(parse, pxComma, pxParen, degParen) {
  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({
        i: i - 4,
        x: interpolateNumber(xa, xb)
      }, {
        i: i - 2,
        x: interpolateNumber(ya, yb)
      });
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360;else if (b - a > 180) a += 360; // shortest path

      q.push({
        i: s.push(pop(s) + "rotate(", null, degParen) - 2,
        x: interpolateNumber(a, b)
      });
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({
        i: s.push(pop(s) + "skewX(", null, degParen) - 2,
        x: interpolateNumber(a, b)
      });
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({
        i: i - 4,
        x: interpolateNumber(xa, xb)
      }, {
        i: i - 2,
        x: interpolateNumber(ya, yb)
      });
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function (a, b) {
    var s = [],
        // string constants and placeholders
    q = []; // number interpolators

    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc

    return function (t) {
      var i = -1,
          n = q.length,
          o;

      while (++i < n) {
        s[(o = q[i]).i] = o.x(t);
      }

      return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

var rho = Math.SQRT2,
    rho2 = 2,
    rho4 = 4,
    epsilon2 = 1e-12;

function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}

function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}

function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
} // p0 = [ux0, uy0, w0]
// p1 = [ux1, uy1, w1]


function interpolateZoom (p0, p1) {
  var ux0 = p0[0],
      uy0 = p0[1],
      w0 = p0[2],
      ux1 = p1[0],
      uy1 = p1[1],
      w1 = p1[2],
      dx = ux1 - ux0,
      dy = uy1 - uy0,
      d2 = dx * dx + dy * dy,
      i,
      S; // Special case for u0 ≅ u1.

  if (d2 < epsilon2) {
    S = Math.log(w1 / w0) / rho;

    i = function i(t) {
      return [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(rho * t * S)];
    };
  } // General case.
  else {
      var d1 = Math.sqrt(d2),
          b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
          b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;

      i = function i(t) {
        var s = t * S,
            coshr0 = cosh(r0),
            u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / cosh(rho * s + r0)];
      };
    }

  i.duration = S * 1000;
  return i;
}

var frame = 0,
    // is an animation frame pending?
timeout = 0,
    // is a timeout pending?
interval = 0,
    // are any timers active?
pokeDelay = 1000,
    // how frequently we check for clock skew
taskHead,
    taskTail,
    clockLast = 0,
    clockNow = 0,
    clockSkew = 0,
    clock = (typeof performance === "undefined" ? "undefined" : _typeof(performance)) === "object" && performance.now ? performance : Date,
    setFrame = (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function (f) {
  setTimeout(f, 17);
};
function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

function Timer() {
  this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function restart(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);

    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;else taskHead = this;
      taskTail = this;
    }

    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function stop() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};
function timer(callback, delay, time) {
  var t = new Timer();
  t.restart(callback, delay, time);
  return t;
}
function timerFlush() {
  now(); // Get the current time, if not already set.

  ++frame; // Pretend we’ve set an alarm, if we haven’t already.

  var t = taskHead,
      e;

  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
    t = t._next;
  }

  --frame;
}

function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;

  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}

function poke() {
  var now = clock.now(),
      delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0,
      t1 = taskHead,
      t2,
      time = Infinity;

  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }

  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.

  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.

  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

function timeout$1 (callback, delay, time) {
  var t = new Timer();
  delay = delay == null ? 0 : +delay;
  t.restart(function (elapsed) {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}

var emptyOn = dispatch("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;
function schedule (node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};else if (id in schedules) return;
  create(node, id, {
    name: name,
    index: index,
    // For context during callback.
    group: group,
    // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}
function init(node, id) {
  var schedule = get$1(node, id);
  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
  return schedule;
}
function set$1(node, id) {
  var schedule = get$1(node, id);
  if (schedule.state > STARTED) throw new Error("too late; already running");
  return schedule;
}
function get$1(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
  return schedule;
}

function create(node, id, self) {
  var schedules = node.__transition,
      tween; // Initialize the self timer when the transition is created.
  // Note the actual delay is not known until the first callback!

  schedules[id] = self;
  self.timer = timer(schedule, 0, self.time);

  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start, self.delay, self.time); // If the elapsed delay is less than our first sleep, start immediately.

    if (self.delay <= elapsed) start(elapsed - self.delay);
  }

  function start(elapsed) {
    var i, j, n, o; // If the state is not SCHEDULED, then we previously errored on start.

    if (self.state !== SCHEDULED) return stop();

    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue; // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!

      if (o.state === STARTED) return timeout$1(start); // Interrupt the active transition, if any.

      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      } // Cancel any pre-empted transitions.
      else if (+i < id) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("cancel", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }
    } // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.


    timeout$1(function () {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    }); // Dispatch the start event.
    // Note this must be done before the tween are initialized.

    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return; // interrupted

    self.state = STARTED; // Initialize the tween, deleting null tween.

    tween = new Array(n = self.tween.length);

    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }

    tween.length = j + 1;
  }

  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
        i = -1,
        n = tween.length;

    while (++i < n) {
      tween[i].call(node, t);
    } // Dispatch the end event.


    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }

  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id];

    for (var i in schedules) {
      return;
    } // eslint-disable-line no-unused-vars


    delete node.__transition;
  }
}

function interrupt (node, name) {
  var schedules = node.__transition,
      schedule,
      active,
      empty = true,
      i;
  if (!schedules) return;
  name = name == null ? null : name + "";

  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) {
      empty = false;
      continue;
    }

    active = schedule.state > STARTING && schedule.state < ENDING;
    schedule.state = ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }

  if (empty) delete node.__transition;
}

function selection_interrupt (name) {
  return this.each(function () {
    interrupt(this, name);
  });
}

function tweenRemove(id, name) {
  var tween0, tween1;
  return function () {
    var schedule = set$1(this, id),
        tween = schedule.tween; // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.

    if (tween !== tween0) {
      tween1 = tween0 = tween;

      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }

    schedule.tween = tween1;
  };
}

function tweenFunction(id, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error();
  return function () {
    var schedule = set$1(this, id),
        tween = schedule.tween; // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.

    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();

      for (var t = {
        name: name,
        value: value
      }, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }

      if (i === n) tween1.push(t);
    }

    schedule.tween = tween1;
  };
}

function transition_tween (name, value) {
  var id = this._id;
  name += "";

  if (arguments.length < 2) {
    var tween = get$1(this.node(), id).tween;

    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }

    return null;
  }

  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}
function tweenValue(transition, name, value) {
  var id = transition._id;
  transition.each(function () {
    var schedule = set$1(this, id);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });
  return function (node) {
    return get$1(node, id).value[name];
  };
}

function interpolate (a, b) {
  var c;
  return (typeof b === "number" ? interpolateNumber : b instanceof color ? interpolateRgb : (c = color(b)) ? (b = c, interpolateRgb) : interpolateString)(a, b);
}

function attrRemove$1(name) {
  return function () {
    this.removeAttribute(name);
  };
}

function attrRemoveNS$1(fullname) {
  return function () {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant$1(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function () {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrConstantNS$1(fullname, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function () {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrFunction$1(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function () {
    var string0,
        value1 = value(this),
        string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function attrFunctionNS$1(fullname, interpolate, value) {
  var string00, string10, interpolate0;
  return function () {
    var string0,
        value1 = value(this),
        string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function transition_attr (name, value) {
  var fullname = namespace(name),
      i = fullname === "transform" ? interpolateTransformSvg : interpolate;
  return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname) : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value));
}

function attrInterpolate(name, i) {
  return function (t) {
    this.setAttribute(name, i.call(this, t));
  };
}

function attrInterpolateNS(fullname, i) {
  return function (t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}

function attrTweenNS(fullname, value) {
  var t0, i0;

  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }

  tween._value = value;
  return tween;
}

function attrTween(name, value) {
  var t0, i0;

  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }

  tween._value = value;
  return tween;
}

function transition_attrTween (name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  var fullname = namespace(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

function delayFunction(id, value) {
  return function () {
    init(this, id).delay = +value.apply(this, arguments);
  };
}

function delayConstant(id, value) {
  return value = +value, function () {
    init(this, id).delay = value;
  };
}

function transition_delay (value) {
  var id = this._id;
  return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id, value)) : get$1(this.node(), id).delay;
}

function durationFunction(id, value) {
  return function () {
    set$1(this, id).duration = +value.apply(this, arguments);
  };
}

function durationConstant(id, value) {
  return value = +value, function () {
    set$1(this, id).duration = value;
  };
}

function transition_duration (value) {
  var id = this._id;
  return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id, value)) : get$1(this.node(), id).duration;
}

function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error();
  return function () {
    set$1(this, id).ease = value;
  };
}

function transition_ease (value) {
  var id = this._id;
  return arguments.length ? this.each(easeConstant(id, value)) : get$1(this.node(), id).ease;
}

function transition_filter (match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Transition(subgroups, this._parents, this._name, this._id);
}

function transition_merge (transition) {
  if (transition._id !== this._id) throw new Error();

  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Transition(merges, this._parents, this._name, this._id);
}

function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function (t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}

function onFunction(id, name, listener) {
  var on0,
      on1,
      sit = start(name) ? init : set$1;
  return function () {
    var schedule = sit(this, id),
        on = schedule.on; // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.

    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
    schedule.on = on1;
  };
}

function transition_on (name, listener) {
  var id = this._id;
  return arguments.length < 2 ? get$1(this.node(), id).on.on(name) : this.each(onFunction(id, name, listener));
}

function removeFunction(id) {
  return function () {
    var parent = this.parentNode;

    for (var i in this.__transition) {
      if (+i !== id) return;
    }

    if (parent) parent.removeChild(this);
  };
}

function transition_remove () {
  return this.on("end.remove", removeFunction(this._id));
}

function transition_select (select) {
  var name = this._name,
      id = this._id;
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule(subgroup[i], name, id, i, subgroup, get$1(node, id));
      }
    }
  }

  return new Transition(subgroups, this._parents, name, id);
}

function transition_selectAll (select) {
  var name = this._name,
      id = this._id;
  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select.call(node, node.__data__, i, group), child, inherit = get$1(node, id), k = 0, l = children.length; k < l; ++k) {
          if (child = children[k]) {
            schedule(child, name, id, k, children, inherit);
          }
        }

        subgroups.push(children);
        parents.push(node);
      }
    }
  }

  return new Transition(subgroups, parents, name, id);
}

var Selection$1 = selection.prototype.constructor;
function transition_selection () {
  return new Selection$1(this._groups, this._parents);
}

function styleNull(name, interpolate) {
  var string00, string10, interpolate0;
  return function () {
    var string0 = styleValue(this, name),
        string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}

function styleRemove$1(name) {
  return function () {
    this.style.removeProperty(name);
  };
}

function styleConstant$1(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function () {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function styleFunction$1(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function () {
    var string0 = styleValue(this, name),
        value1 = value(this),
        string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function styleMaybeRemove(id, name) {
  var on0,
      on1,
      listener0,
      key = "style." + name,
      event = "end." + key,
      remove;
  return function () {
    var schedule = set$1(this, id),
        on = schedule.on,
        listener = schedule.value[key] == null ? remove || (remove = styleRemove$1(name)) : undefined; // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.

    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
    schedule.on = on1;
  };
}

function transition_style (name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
  return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove$1(name)) : typeof value === "function" ? this.styleTween(name, styleFunction$1(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant$1(name, i, value), priority).on("end.style." + name, null);
}

function styleInterpolate(name, i, priority) {
  return function (t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}

function styleTween(name, value, priority) {
  var t, i0;

  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }

  tween._value = value;
  return tween;
}

function transition_styleTween (name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}

function textConstant$1(value) {
  return function () {
    this.textContent = value;
  };
}

function textFunction$1(value) {
  return function () {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}

function transition_text (value) {
  return this.tween("text", typeof value === "function" ? textFunction$1(tweenValue(this, "text", value)) : textConstant$1(value == null ? "" : value + ""));
}

function textInterpolate(i) {
  return function (t) {
    this.textContent = i.call(this, t);
  };
}

function textTween(value) {
  var t0, i0;

  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }

  tween._value = value;
  return tween;
}

function transition_textTween (value) {
  var key = "text";
  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  return this.tween(key, textTween(value));
}

function transition_transition () {
  var name = this._name,
      id0 = this._id,
      id1 = newId();

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit = get$1(node, id0);
        schedule(node, name, id1, i, group, {
          time: inherit.time + inherit.delay + inherit.duration,
          delay: 0,
          duration: inherit.duration,
          ease: inherit.ease
        });
      }
    }
  }

  return new Transition(groups, this._parents, name, id1);
}

function transition_end () {
  var on0,
      on1,
      that = this,
      id = that._id,
      size = that.size();
  return new Promise(function (resolve, reject) {
    var cancel = {
      value: reject
    },
        end = {
      value: function value() {
        if (--size === 0) resolve();
      }
    };
    that.each(function () {
      var schedule = set$1(this, id),
          on = schedule.on; // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.

      if (on !== on0) {
        on1 = (on0 = on).copy();

        on1._.cancel.push(cancel);

        on1._.interrupt.push(cancel);

        on1._.end.push(end);
      }

      schedule.on = on1;
    });
  });
}

var id = 0;
function Transition(groups, parents, name, id) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id;
}
function transition(name) {
  return selection().transition(name);
}
function newId() {
  return ++id;
}
var selection_prototype = selection.prototype;
Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: transition_select,
  selectAll: transition_selectAll,
  filter: transition_filter,
  merge: transition_merge,
  selection: transition_selection,
  transition: transition_transition,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: transition_on,
  attr: transition_attr,
  attrTween: transition_attrTween,
  style: transition_style,
  styleTween: transition_styleTween,
  text: transition_text,
  textTween: transition_textTween,
  remove: transition_remove,
  tween: transition_tween,
  delay: transition_delay,
  duration: transition_duration,
  ease: transition_ease,
  end: transition_end
};

function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

var defaultTiming = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};

function inherit(node, id) {
  var timing;

  while (!(timing = node.__transition) || !(timing = timing[id])) {
    if (!(node = node.parentNode)) {
      return defaultTiming.time = now(), defaultTiming;
    }
  }

  return timing;
}

function selection_transition (name) {
  var id, timing;

  if (name instanceof Transition) {
    id = name._id, name = name._name;
  } else {
    id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule(node, name, id, i, group, timing || inherit(node, id));
      }
    }
  }

  return new Transition(groups, this._parents, name, id);
}

selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;

var prefix = "$";

function Map() {}

Map.prototype = map.prototype = {
  constructor: Map,
  has: function has(key) {
    return prefix + key in this;
  },
  get: function get(key) {
    return this[prefix + key];
  },
  set: function set(key, value) {
    this[prefix + key] = value;
    return this;
  },
  remove: function remove(key) {
    var property = prefix + key;
    return property in this && delete this[property];
  },
  clear: function clear() {
    for (var property in this) {
      if (property[0] === prefix) delete this[property];
    }
  },
  keys: function keys() {
    var keys = [];

    for (var property in this) {
      if (property[0] === prefix) keys.push(property.slice(1));
    }

    return keys;
  },
  values: function values() {
    var values = [];

    for (var property in this) {
      if (property[0] === prefix) values.push(this[property]);
    }

    return values;
  },
  entries: function entries() {
    var entries = [];

    for (var property in this) {
      if (property[0] === prefix) entries.push({
        key: property.slice(1),
        value: this[property]
      });
    }

    return entries;
  },
  size: function size() {
    var size = 0;

    for (var property in this) {
      if (property[0] === prefix) ++size;
    }

    return size;
  },
  empty: function empty() {
    for (var property in this) {
      if (property[0] === prefix) return false;
    }

    return true;
  },
  each: function each(f) {
    for (var property in this) {
      if (property[0] === prefix) f(this[property], property.slice(1), this);
    }
  }
};

function map(object, f) {
  var map = new Map(); // Copy constructor.

  if (object instanceof Map) object.each(function (value, key) {
    map.set(key, value);
  }); // Index array by numeric index or specified key function.
  else if (Array.isArray(object)) {
      var i = -1,
          n = object.length,
          o;
      if (f == null) while (++i < n) {
        map.set(i, object[i]);
      } else while (++i < n) {
        map.set(f(o = object[i], i, object), o);
      }
    } // Convert object to map.
    else if (object) for (var key in object) {
        map.set(key, object[key]);
      }
  return map;
}

function Set() {}

var proto = map.prototype;
Set.prototype = set$2.prototype = {
  constructor: Set,
  has: proto.has,
  add: function add(value) {
    value += "";
    this[prefix + value] = value;
    return this;
  },
  remove: proto.remove,
  clear: proto.clear,
  values: proto.keys,
  size: proto.size,
  empty: proto.empty,
  each: proto.each
};

function set$2(object, f) {
  var set = new Set(); // Copy constructor.

  if (object instanceof Set) object.each(function (value) {
    set.add(value);
  }); // Otherwise, assume it’s an array.
  else if (object) {
      var i = -1,
          n = object.length;
      if (f == null) while (++i < n) {
        set.add(object[i]);
      } else while (++i < n) {
        set.add(f(object[i], i, object));
      }
    }
  return set;
}

function count(node) {
  var sum = 0,
      children = node.children,
      i = children && children.length;
  if (!i) sum = 1;else while (--i >= 0) {
    sum += children[i].value;
  }
  node.value = sum;
}

function node_count () {
  return this.eachAfter(count);
}

function node_each (callback) {
  var node = this,
      current,
      next = [node],
      children,
      i,
      n;

  do {
    current = next.reverse(), next = [];

    while (node = current.pop()) {
      callback(node), children = node.children;
      if (children) for (i = 0, n = children.length; i < n; ++i) {
        next.push(children[i]);
      }
    }
  } while (next.length);

  return this;
}

function node_eachBefore (callback) {
  var node = this,
      nodes = [node],
      children,
      i;

  while (node = nodes.pop()) {
    callback(node), children = node.children;
    if (children) for (i = children.length - 1; i >= 0; --i) {
      nodes.push(children[i]);
    }
  }

  return this;
}

function node_eachAfter (callback) {
  var node = this,
      nodes = [node],
      next = [],
      children,
      i,
      n;

  while (node = nodes.pop()) {
    next.push(node), children = node.children;
    if (children) for (i = 0, n = children.length; i < n; ++i) {
      nodes.push(children[i]);
    }
  }

  while (node = next.pop()) {
    callback(node);
  }

  return this;
}

function node_sum (value) {
  return this.eachAfter(function (node) {
    var sum = +value(node.data) || 0,
        children = node.children,
        i = children && children.length;

    while (--i >= 0) {
      sum += children[i].value;
    }

    node.value = sum;
  });
}

function node_sort (compare) {
  return this.eachBefore(function (node) {
    if (node.children) {
      node.children.sort(compare);
    }
  });
}

function node_path (end) {
  var start = this,
      ancestor = leastCommonAncestor(start, end),
      nodes = [start];

  while (start !== ancestor) {
    start = start.parent;
    nodes.push(start);
  }

  var k = nodes.length;

  while (end !== ancestor) {
    nodes.splice(k, 0, end);
    end = end.parent;
  }

  return nodes;
}

function leastCommonAncestor(a, b) {
  if (a === b) return a;
  var aNodes = a.ancestors(),
      bNodes = b.ancestors(),
      c = null;
  a = aNodes.pop();
  b = bNodes.pop();

  while (a === b) {
    c = a;
    a = aNodes.pop();
    b = bNodes.pop();
  }

  return c;
}

function node_ancestors () {
  var node = this,
      nodes = [node];

  while (node = node.parent) {
    nodes.push(node);
  }

  return nodes;
}

function node_descendants () {
  var nodes = [];
  this.each(function (node) {
    nodes.push(node);
  });
  return nodes;
}

function node_leaves () {
  var leaves = [];
  this.eachBefore(function (node) {
    if (!node.children) {
      leaves.push(node);
    }
  });
  return leaves;
}

function node_links () {
  var root = this,
      links = [];
  root.each(function (node) {
    if (node !== root) {
      // Don’t include the root’s parent, if any.
      links.push({
        source: node.parent,
        target: node
      });
    }
  });
  return links;
}

function hierarchy(data, children) {
  var root = new Node(data),
      valued = +data.value && (root.value = data.value),
      node,
      nodes = [root],
      child,
      childs,
      i,
      n;
  if (children == null) children = defaultChildren;

  while (node = nodes.pop()) {
    if (valued) node.value = +node.data.value;

    if ((childs = children(node.data)) && (n = childs.length)) {
      node.children = new Array(n);

      for (i = n - 1; i >= 0; --i) {
        nodes.push(child = node.children[i] = new Node(childs[i]));
        child.parent = node;
        child.depth = node.depth + 1;
      }
    }
  }

  return root.eachBefore(computeHeight);
}

function node_copy() {
  return hierarchy(this).eachBefore(copyData);
}

function defaultChildren(d) {
  return d.children;
}

function copyData(node) {
  node.data = node.data.data;
}

function computeHeight(node) {
  var height = 0;

  do {
    node.height = height;
  } while ((node = node.parent) && node.height < ++height);
}
function Node(data) {
  this.data = data;
  this.depth = this.height = 0;
  this.parent = null;
}
Node.prototype = hierarchy.prototype = {
  constructor: Node,
  count: node_count,
  each: node_each,
  eachAfter: node_eachAfter,
  eachBefore: node_eachBefore,
  sum: node_sum,
  sort: node_sort,
  path: node_path,
  ancestors: node_ancestors,
  descendants: node_descendants,
  leaves: node_leaves,
  links: node_links,
  copy: node_copy
};

function defaultSeparation(a, b) {
  return a.parent === b.parent ? 1 : 2;
} // function radialSeparation(a, b) {
//   return (a.parent === b.parent ? 1 : 2) / a.depth;
// }
// This function is used to traverse the left contour of a subtree (or
// subforest). It returns the successor of v on this contour. This successor is
// either given by the leftmost child of v or by the thread of v. The function
// returns null if and only if v is on the highest level of its subtree.


function nextLeft(v) {
  var children = v.children;
  return children ? children[0] : v.t;
} // This function works analogously to nextLeft.


function nextRight(v) {
  var children = v.children;
  return children ? children[children.length - 1] : v.t;
} // Shifts the current subtree rooted at w+. This is done by increasing
// prelim(w+) and mod(w+) by shift.


function moveSubtree(wm, wp, shift) {
  var change = shift / (wp.i - wm.i);
  wp.c -= change;
  wp.s += shift;
  wm.c += change;
  wp.z += shift;
  wp.m += shift;
} // All other shifts, applied to the smaller subtrees between w- and w+, are
// performed by this function. To prepare the shifts, we have to adjust
// change(w+), shift(w+), and change(w-).


function executeShifts(v) {
  var shift = 0,
      change = 0,
      children = v.children,
      i = children.length,
      w;

  while (--i >= 0) {
    w = children[i];
    w.z += shift;
    w.m += shift;
    shift += w.s + (change += w.c);
  }
} // If vi-’s ancestor is a sibling of v, returns vi-’s ancestor. Otherwise,
// returns the specified (default) ancestor.


function nextAncestor(vim, v, ancestor) {
  return vim.a.parent === v.parent ? vim.a : ancestor;
}

function TreeNode(node, i) {
  this._ = node;
  this.parent = null;
  this.children = null;
  this.A = null; // default ancestor

  this.a = this; // ancestor

  this.z = 0; // prelim

  this.m = 0; // mod

  this.c = 0; // change

  this.s = 0; // shift

  this.t = null; // thread

  this.i = i; // number
}

TreeNode.prototype = Object.create(Node.prototype);

function treeRoot(root) {
  var tree = new TreeNode(root, 0),
      node,
      nodes = [tree],
      child,
      children,
      i,
      n;

  while (node = nodes.pop()) {
    if (children = node._.children) {
      node.children = new Array(n = children.length);

      for (i = n - 1; i >= 0; --i) {
        nodes.push(child = node.children[i] = new TreeNode(children[i], i));
        child.parent = node;
      }
    }
  }

  (tree.parent = new TreeNode(null, 0)).children = [tree];
  return tree;
} // Node-link tree diagram using the Reingold-Tilford "tidy" algorithm


function tree () {
  var separation = defaultSeparation,
      dx = 1,
      dy = 1,
      nodeSize = null;

  function tree(root) {
    var t = treeRoot(root); // Compute the layout using Buchheim et al.’s algorithm.

    t.eachAfter(firstWalk), t.parent.m = -t.z;
    t.eachBefore(secondWalk); // If a fixed node size is specified, scale x and y.

    if (nodeSize) root.eachBefore(sizeNode); // If a fixed tree size is specified, scale x and y based on the extent.
    // Compute the left-most, right-most, and depth-most nodes for extents.
    else {
        var left = root,
            right = root,
            bottom = root;
        root.eachBefore(function (node) {
          if (node.x < left.x) left = node;
          if (node.x > right.x) right = node;
          if (node.depth > bottom.depth) bottom = node;
        });
        var s = left === right ? 1 : separation(left, right) / 2,
            tx = s - left.x,
            kx = dx / (right.x + s + tx),
            ky = dy / (bottom.depth || 1);
        root.eachBefore(function (node) {
          node.x = (node.x + tx) * kx;
          node.y = node.depth * ky;
        });
      }
    return root;
  } // Computes a preliminary x-coordinate for v. Before that, FIRST WALK is
  // applied recursively to the children of v, as well as the function
  // APPORTION. After spacing out the children by calling EXECUTE SHIFTS, the
  // node v is placed to the midpoint of its outermost children.


  function firstWalk(v) {
    var children = v.children,
        siblings = v.parent.children,
        w = v.i ? siblings[v.i - 1] : null;

    if (children) {
      executeShifts(v);
      var midpoint = (children[0].z + children[children.length - 1].z) / 2;

      if (w) {
        v.z = w.z + separation(v._, w._);
        v.m = v.z - midpoint;
      } else {
        v.z = midpoint;
      }
    } else if (w) {
      v.z = w.z + separation(v._, w._);
    }

    v.parent.A = apportion(v, w, v.parent.A || siblings[0]);
  } // Computes all real x-coordinates by summing up the modifiers recursively.


  function secondWalk(v) {
    v._.x = v.z + v.parent.m;
    v.m += v.parent.m;
  } // The core of the algorithm. Here, a new subtree is combined with the
  // previous subtrees. Threads are used to traverse the inside and outside
  // contours of the left and right subtree up to the highest common level. The
  // vertices used for the traversals are vi+, vi-, vo-, and vo+, where the
  // superscript o means outside and i means inside, the subscript - means left
  // subtree and + means right subtree. For summing up the modifiers along the
  // contour, we use respective variables si+, si-, so-, and so+. Whenever two
  // nodes of the inside contours conflict, we compute the left one of the
  // greatest uncommon ancestors using the function ANCESTOR and call MOVE
  // SUBTREE to shift the subtree and prepare the shifts of smaller subtrees.
  // Finally, we add a new thread (if necessary).


  function apportion(v, w, ancestor) {
    if (w) {
      var vip = v,
          vop = v,
          vim = w,
          vom = vip.parent.children[0],
          sip = vip.m,
          sop = vop.m,
          sim = vim.m,
          som = vom.m,
          shift;

      while (vim = nextRight(vim), vip = nextLeft(vip), vim && vip) {
        vom = nextLeft(vom);
        vop = nextRight(vop);
        vop.a = v;
        shift = vim.z + sim - vip.z - sip + separation(vim._, vip._);

        if (shift > 0) {
          moveSubtree(nextAncestor(vim, v, ancestor), v, shift);
          sip += shift;
          sop += shift;
        }

        sim += vim.m;
        sip += vip.m;
        som += vom.m;
        sop += vop.m;
      }

      if (vim && !nextRight(vop)) {
        vop.t = vim;
        vop.m += sim - sop;
      }

      if (vip && !nextLeft(vom)) {
        vom.t = vip;
        vom.m += sip - som;
        ancestor = v;
      }
    }

    return ancestor;
  }

  function sizeNode(node) {
    node.x *= dx;
    node.y = node.depth * dy;
  }

  tree.separation = function (x) {
    return arguments.length ? (separation = x, tree) : separation;
  };

  tree.size = function (x) {
    return arguments.length ? (nodeSize = false, dx = +x[0], dy = +x[1], tree) : nodeSize ? null : [dx, dy];
  };

  tree.nodeSize = function (x) {
    return arguments.length ? (nodeSize = true, dx = +x[0], dy = +x[1], tree) : nodeSize ? [dx, dy] : null;
  };

  return tree;
}

function constant$2 (x) {
  return function () {
    return x;
  };
}

function ZoomEvent(target, type, transform) {
  this.target = target;
  this.type = type;
  this.transform = transform;
}

function Transform(k, x, y) {
  this.k = k;
  this.x = x;
  this.y = y;
}
Transform.prototype = {
  constructor: Transform,
  scale: function scale(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  translate: function translate(x, y) {
    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
  },
  apply: function apply(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function applyX(x) {
    return x * this.k + this.x;
  },
  applyY: function applyY(y) {
    return y * this.k + this.y;
  },
  invert: function invert(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function invertX(x) {
    return (x - this.x) / this.k;
  },
  invertY: function invertY(y) {
    return (y - this.y) / this.k;
  },
  rescaleX: function rescaleX(x) {
    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
  },
  rescaleY: function rescaleY(y) {
    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
  },
  toString: function toString() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var identity$1 = new Transform(1, 0, 0);

function nopropagation() {
  event$1.stopImmediatePropagation();
}
function noevent$1 () {
  event$1.preventDefault();
  event$1.stopImmediatePropagation();
}

function defaultFilter() {
  return !event$1.ctrlKey && !event$1.button;
}

function defaultExtent() {
  var e = this;

  if (e instanceof SVGElement) {
    e = e.ownerSVGElement || e;

    if (e.hasAttribute("viewBox")) {
      e = e.viewBox.baseVal;
      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    }

    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
  }

  return [[0, 0], [e.clientWidth, e.clientHeight]];
}

function defaultTransform() {
  return this.__zoom || identity$1;
}

function defaultWheelDelta() {
  return -event$1.deltaY * (event$1.deltaMode === 1 ? 0.05 : event$1.deltaMode ? 1 : 0.002);
}

function defaultTouchable() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}

function defaultConstrain(transform, extent, translateExtent) {
  var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
      dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
      dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
      dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
  return transform.translate(dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1), dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1));
}

function zoom () {
  var filter = defaultFilter,
      extent = defaultExtent,
      constrain = defaultConstrain,
      wheelDelta = defaultWheelDelta,
      touchable = defaultTouchable,
      scaleExtent = [0, Infinity],
      translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]],
      duration = 250,
      interpolate = interpolateZoom,
      listeners = dispatch("start", "zoom", "end"),
      touchstarting,
      touchending,
      touchDelay = 500,
      wheelDelay = 150,
      clickDistance2 = 0;

  function zoom(selection) {
    selection.property("__zoom", defaultTransform).on("wheel.zoom", wheeled).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  zoom.transform = function (collection, transform, point) {
    var selection = collection.selection ? collection.selection() : collection;
    selection.property("__zoom", defaultTransform);

    if (collection !== selection) {
      schedule(collection, transform, point);
    } else {
      selection.interrupt().each(function () {
        gesture(this, arguments).start().zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform).end();
      });
    }
  };

  zoom.scaleBy = function (selection, k, p) {
    zoom.scaleTo(selection, function () {
      var k0 = this.__zoom.k,
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return k0 * k1;
    }, p);
  };

  zoom.scaleTo = function (selection, k, p) {
    zoom.transform(selection, function () {
      var e = extent.apply(this, arguments),
          t0 = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p,
          p1 = t0.invert(p0),
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
    }, p);
  };

  zoom.translateBy = function (selection, x, y) {
    zoom.transform(selection, function () {
      return constrain(this.__zoom.translate(typeof x === "function" ? x.apply(this, arguments) : x, typeof y === "function" ? y.apply(this, arguments) : y), extent.apply(this, arguments), translateExtent);
    });
  };

  zoom.translateTo = function (selection, x, y, p) {
    zoom.transform(selection, function () {
      var e = extent.apply(this, arguments),
          t = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
      return constrain(identity$1.translate(p0[0], p0[1]).scale(t.k).translate(typeof x === "function" ? -x.apply(this, arguments) : -x, typeof y === "function" ? -y.apply(this, arguments) : -y), e, translateExtent);
    }, p);
  };

  function scale(transform, k) {
    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
    return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
  }

  function translate(transform, p0, p1) {
    var x = p0[0] - p1[0] * transform.k,
        y = p0[1] - p1[1] * transform.k;
    return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
  }

  function centroid(extent) {
    return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
  }

  function schedule(transition, transform, point) {
    transition.on("start.zoom", function () {
      gesture(this, arguments).start();
    }).on("interrupt.zoom end.zoom", function () {
      gesture(this, arguments).end();
    }).tween("zoom", function () {
      var that = this,
          args = arguments,
          g = gesture(that, args),
          e = extent.apply(that, args),
          p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point,
          w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
          a = that.__zoom,
          b = typeof transform === "function" ? transform.apply(that, args) : transform,
          i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
      return function (t) {
        if (t === 1) t = b; // Avoid rounding error on end.
        else {
            var l = i(t),
                k = w / l[2];
            t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k);
          }
        g.zoom(null, t);
      };
    });
  }

  function gesture(that, args, clean) {
    return !clean && that.__zooming || new Gesture(that, args);
  }

  function Gesture(that, args) {
    this.that = that;
    this.args = args;
    this.active = 0;
    this.extent = extent.apply(that, args);
    this.taps = 0;
  }

  Gesture.prototype = {
    start: function start() {
      if (++this.active === 1) {
        this.that.__zooming = this;
        this.emit("start");
      }

      return this;
    },
    zoom: function zoom(key, transform) {
      if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
      if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
      if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
      this.that.__zoom = transform;
      this.emit("zoom");
      return this;
    },
    end: function end() {
      if (--this.active === 0) {
        delete this.that.__zooming;
        this.emit("end");
      }

      return this;
    },
    emit: function emit(type) {
      customEvent(new ZoomEvent(zoom, type, this.that.__zoom), listeners.apply, listeners, [type, this.that, this.args]);
    }
  };

  function wheeled() {
    if (!filter.apply(this, arguments)) return;
    var g = gesture(this, arguments),
        t = this.__zoom,
        k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))),
        p = mouse(this); // If the mouse is in the same location as before, reuse it.
    // If there were recent wheel events, reset the wheel idle timeout.

    if (g.wheel) {
      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
        g.mouse[1] = t.invert(g.mouse[0] = p);
      }

      clearTimeout(g.wheel);
    } // If this wheel event won’t trigger a transform change, ignore it.
    else if (t.k === k) return; // Otherwise, capture the mouse point and location at the start.
      else {
          g.mouse = [p, t.invert(p)];
          interrupt(this);
          g.start();
        }

    noevent$1();
    g.wheel = setTimeout(wheelidled, wheelDelay);
    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));

    function wheelidled() {
      g.wheel = null;
      g.end();
    }
  }

  function mousedowned() {
    if (touchending || !filter.apply(this, arguments)) return;
    var g = gesture(this, arguments, true),
        v = select(event$1.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
        p = mouse(this),
        x0 = event$1.clientX,
        y0 = event$1.clientY;
    dragDisable(event$1.view);
    nopropagation();
    g.mouse = [p, this.__zoom.invert(p)];
    interrupt(this);
    g.start();

    function mousemoved() {
      noevent$1();

      if (!g.moved) {
        var dx = event$1.clientX - x0,
            dy = event$1.clientY - y0;
        g.moved = dx * dx + dy * dy > clickDistance2;
      }

      g.zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = mouse(g.that), g.mouse[1]), g.extent, translateExtent));
    }

    function mouseupped() {
      v.on("mousemove.zoom mouseup.zoom", null);
      yesdrag(event$1.view, g.moved);
      noevent$1();
      g.end();
    }
  }

  function dblclicked() {
    if (!filter.apply(this, arguments)) return;
    var t0 = this.__zoom,
        p0 = mouse(this),
        p1 = t0.invert(p0),
        k1 = t0.k * (event$1.shiftKey ? 0.5 : 2),
        t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, arguments), translateExtent);
    noevent$1();
    if (duration > 0) select(this).transition().duration(duration).call(schedule, t1, p0);else select(this).call(zoom.transform, t1);
  }

  function touchstarted() {
    if (!filter.apply(this, arguments)) return;
    var touches = event$1.touches,
        n = touches.length,
        g = gesture(this, arguments, event$1.changedTouches.length === n),
        started,
        i,
        t,
        p;
    nopropagation();

    for (i = 0; i < n; ++i) {
      t = touches[i], p = touch(this, touches, t.identifier);
      p = [p, this.__zoom.invert(p), t.identifier];
      if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
    }

    if (touchstarting) touchstarting = clearTimeout(touchstarting);

    if (started) {
      if (g.taps < 2) touchstarting = setTimeout(function () {
        touchstarting = null;
      }, touchDelay);
      interrupt(this);
      g.start();
    }
  }

  function touchmoved() {
    if (!this.__zooming) return;
    var g = gesture(this, arguments),
        touches = event$1.changedTouches,
        n = touches.length,
        i,
        t,
        p,
        l;
    noevent$1();
    if (touchstarting) touchstarting = clearTimeout(touchstarting);
    g.taps = 0;

    for (i = 0; i < n; ++i) {
      t = touches[i], p = touch(this, touches, t.identifier);
      if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
    }

    t = g.that.__zoom;

    if (g.touch1) {
      var p0 = g.touch0[0],
          l0 = g.touch0[1],
          p1 = g.touch1[0],
          l1 = g.touch1[1],
          dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
          dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
      t = scale(t, Math.sqrt(dp / dl));
      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
    } else if (g.touch0) p = g.touch0[0], l = g.touch0[1];else return;

    g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
  }

  function touchended() {
    if (!this.__zooming) return;
    var g = gesture(this, arguments),
        touches = event$1.changedTouches,
        n = touches.length,
        i,
        t;
    nopropagation();
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function () {
      touchending = null;
    }, touchDelay);

    for (i = 0; i < n; ++i) {
      t = touches[i];
      if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
    }

    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);else {
      g.end(); // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.

      if (g.taps === 2) {
        var p = select(this).on("dblclick.zoom");
        if (p) p.apply(this, arguments);
      }
    }
  }

  zoom.wheelDelta = function (_) {
    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant$2(+_), zoom) : wheelDelta;
  };

  zoom.filter = function (_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$2(!!_), zoom) : filter;
  };

  zoom.touchable = function (_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$2(!!_), zoom) : touchable;
  };

  zoom.extent = function (_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : constant$2([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
  };

  zoom.scaleExtent = function (_) {
    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
  };

  zoom.translateExtent = function (_) {
    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
  };

  zoom.constrain = function (_) {
    return arguments.length ? (constrain = _, zoom) : constrain;
  };

  zoom.duration = function (_) {
    return arguments.length ? (duration = +_, zoom) : duration;
  };

  zoom.interpolate = function (_) {
    return arguments.length ? (interpolate = _, zoom) : interpolate;
  };

  zoom.on = function () {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? zoom : value;
  };

  zoom.clickDistance = function (_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
  };

  return zoom;
}

var colorStruct = {
  aliceblue: {
    r: 240,
    g: 248,
    b: 255
  },
  antiquewhite: {
    r: 250,
    g: 235,
    b: 215
  },
  aqua: {
    r: 0,
    g: 255,
    b: 255
  },
  aquamarine: {
    r: 127,
    g: 255,
    b: 212
  },
  azure: {
    r: 240,
    g: 255,
    b: 255
  },
  beige: {
    r: 245,
    g: 245,
    b: 220
  },
  bisque: {
    r: 255,
    g: 228,
    b: 196
  },
  black: {
    r: 0,
    g: 0,
    b: 0
  },
  blanchedalmond: {
    r: 255,
    g: 235,
    b: 205
  },
  blue: {
    r: 0,
    g: 0,
    b: 255
  },
  blueviolet: {
    r: 138,
    g: 43,
    b: 226
  },
  brown: {
    r: 165,
    g: 42,
    b: 42
  },
  burlywood: {
    r: 222,
    g: 184,
    b: 135
  },
  cadetblue: {
    r: 95,
    g: 158,
    b: 160
  },
  chartreuse: {
    r: 127,
    g: 255,
    b: 0
  },
  chocolate: {
    r: 210,
    g: 105,
    b: 30
  },
  coral: {
    r: 255,
    g: 127,
    b: 80
  },
  cornflowerblue: {
    r: 100,
    g: 149,
    b: 237
  },
  cornsilk: {
    r: 255,
    g: 248,
    b: 220
  },
  crimson: {
    r: 220,
    g: 20,
    b: 60
  },
  cyan: {
    r: 0,
    g: 255,
    b: 255
  },
  darkblue: {
    r: 0,
    g: 0,
    b: 139
  },
  darkcyan: {
    r: 0,
    g: 139,
    b: 139
  },
  darkgoldenrod: {
    r: 184,
    g: 134,
    b: 11
  },
  darkgray: {
    r: 169,
    g: 169,
    b: 169
  },
  darkgreen: {
    r: 0,
    g: 100,
    b: 0
  },
  darkgrey: {
    r: 169,
    g: 169,
    b: 169
  },
  darkkhaki: {
    r: 189,
    g: 183,
    b: 107
  },
  darkmagenta: {
    r: 139,
    g: 0,
    b: 139
  },
  darkolivegreen: {
    r: 85,
    g: 107,
    b: 47
  },
  darkorange: {
    r: 255,
    g: 140,
    b: 0
  },
  darkorchid: {
    r: 153,
    g: 50,
    b: 204
  },
  darkred: {
    r: 139,
    g: 0,
    b: 0
  },
  darksalmon: {
    r: 233,
    g: 150,
    b: 122
  },
  darkseagreen: {
    r: 143,
    g: 188,
    b: 143
  },
  darkslateblue: {
    r: 72,
    g: 61,
    b: 139
  },
  darkslategray: {
    r: 47,
    g: 79,
    b: 79
  },
  darkslategrey: {
    r: 47,
    g: 79,
    b: 79
  },
  darkturquoise: {
    r: 0,
    g: 206,
    b: 209
  },
  darkviolet: {
    r: 148,
    g: 0,
    b: 211
  },
  deeppink: {
    r: 255,
    g: 20,
    b: 147
  },
  deepskyblue: {
    r: 0,
    g: 191,
    b: 255
  },
  dimgray: {
    r: 105,
    g: 105,
    b: 105
  },
  dimgrey: {
    r: 105,
    g: 105,
    b: 105
  },
  dodgerblue: {
    r: 30,
    g: 144,
    b: 255
  },
  firebrick: {
    r: 178,
    g: 34,
    b: 34
  },
  floralwhite: {
    r: 255,
    g: 250,
    b: 240
  },
  forestgreen: {
    r: 34,
    g: 139,
    b: 34
  },
  fuchsia: {
    r: 255,
    g: 0,
    b: 255
  },
  gainsboro: {
    r: 220,
    g: 220,
    b: 220
  },
  ghostwhite: {
    r: 248,
    g: 248,
    b: 255
  },
  gold: {
    r: 255,
    g: 215,
    b: 0
  },
  goldenrod: {
    r: 218,
    g: 165,
    b: 32
  },
  gray: {
    r: 128,
    g: 128,
    b: 128
  },
  green: {
    r: 0,
    g: 128,
    b: 0
  },
  greenyellow: {
    r: 173,
    g: 255,
    b: 47
  },
  grey: {
    r: 128,
    g: 128,
    b: 128
  },
  honeydew: {
    r: 240,
    g: 255,
    b: 240
  },
  hotpink: {
    r: 255,
    g: 105,
    b: 180
  },
  indianred: {
    r: 205,
    g: 92,
    b: 92
  },
  indigo: {
    r: 75,
    g: 0,
    b: 130
  },
  ivory: {
    r: 255,
    g: 255,
    b: 240
  },
  khaki: {
    r: 240,
    g: 230,
    b: 140
  },
  lavender: {
    r: 230,
    g: 230,
    b: 250
  },
  lavenderblush: {
    r: 255,
    g: 240,
    b: 245
  },
  lawngreen: {
    r: 124,
    g: 252,
    b: 0
  },
  lemonchiffon: {
    r: 255,
    g: 250,
    b: 205
  },
  lightblue: {
    r: 173,
    g: 216,
    b: 230
  },
  lightcoral: {
    r: 240,
    g: 128,
    b: 128
  },
  lightcyan: {
    r: 224,
    g: 255,
    b: 255
  },
  lightgoldenrodyellow: {
    r: 250,
    g: 250,
    b: 210
  },
  lightgray: {
    r: 211,
    g: 211,
    b: 211
  },
  lightgreen: {
    r: 144,
    g: 238,
    b: 144
  },
  lightgrey: {
    r: 211,
    g: 211,
    b: 211
  },
  lightpink: {
    r: 255,
    g: 182,
    b: 193
  },
  lightsalmon: {
    r: 255,
    g: 160,
    b: 122
  },
  lightseagreen: {
    r: 32,
    g: 178,
    b: 170
  },
  lightskyblue: {
    r: 135,
    g: 206,
    b: 250
  },
  lightslategray: {
    r: 119,
    g: 136,
    b: 153
  },
  lightslategrey: {
    r: 119,
    g: 136,
    b: 153
  },
  lightsteelblue: {
    r: 176,
    g: 196,
    b: 222
  },
  lightyellow: {
    r: 255,
    g: 255,
    b: 224
  },
  lime: {
    r: 0,
    g: 255,
    b: 0
  },
  limegreen: {
    r: 50,
    g: 205,
    b: 50
  },
  linen: {
    r: 250,
    g: 240,
    b: 230
  },
  magenta: {
    r: 255,
    g: 0,
    b: 255
  },
  maroon: {
    r: 128,
    g: 0,
    b: 0
  },
  mediumaquamarine: {
    r: 102,
    g: 205,
    b: 170
  },
  mediumblue: {
    r: 0,
    g: 0,
    b: 205
  },
  mediumorchid: {
    r: 186,
    g: 85,
    b: 211
  },
  mediumpurple: {
    r: 147,
    g: 112,
    b: 219
  },
  mediumseagreen: {
    r: 60,
    g: 179,
    b: 113
  },
  mediumslateblue: {
    r: 123,
    g: 104,
    b: 238
  },
  mediumspringgreen: {
    r: 0,
    g: 250,
    b: 154
  },
  mediumturquoise: {
    r: 72,
    g: 209,
    b: 204
  },
  mediumvioletred: {
    r: 199,
    g: 21,
    b: 133
  },
  midnightblue: {
    r: 25,
    g: 25,
    b: 112
  },
  mintcream: {
    r: 245,
    g: 255,
    b: 250
  },
  mistyrose: {
    r: 255,
    g: 228,
    b: 225
  },
  moccasin: {
    r: 255,
    g: 228,
    b: 181
  },
  navajowhite: {
    r: 255,
    g: 222,
    b: 173
  },
  navy: {
    r: 0,
    g: 0,
    b: 128
  },
  oldlace: {
    r: 253,
    g: 245,
    b: 230
  },
  olive: {
    r: 128,
    g: 128,
    b: 0
  },
  olivedrab: {
    r: 107,
    g: 142,
    b: 35
  },
  orange: {
    r: 255,
    g: 165,
    b: 0
  },
  orangered: {
    r: 255,
    g: 69,
    b: 0
  },
  orchid: {
    r: 218,
    g: 112,
    b: 214
  },
  palegoldenrod: {
    r: 238,
    g: 232,
    b: 170
  },
  palegreen: {
    r: 152,
    g: 251,
    b: 152
  },
  paleturquoise: {
    r: 175,
    g: 238,
    b: 238
  },
  palevioletred: {
    r: 219,
    g: 112,
    b: 147
  },
  papayawhip: {
    r: 255,
    g: 239,
    b: 213
  },
  peachpuff: {
    r: 255,
    g: 218,
    b: 185
  },
  peru: {
    r: 205,
    g: 133,
    b: 63
  },
  pink: {
    r: 255,
    g: 192,
    b: 203
  },
  plum: {
    r: 221,
    g: 160,
    b: 221
  },
  powderblue: {
    r: 176,
    g: 224,
    b: 230
  },
  purple: {
    r: 128,
    g: 0,
    b: 128
  },
  rebeccapurple: {
    r: 102,
    g: 51,
    b: 153
  },
  red: {
    r: 255,
    g: 0,
    b: 0
  },
  rosybrown: {
    r: 188,
    g: 143,
    b: 143
  },
  royalblue: {
    r: 65,
    g: 105,
    b: 225
  },
  saddlebrown: {
    r: 139,
    g: 69,
    b: 19
  },
  salmon: {
    r: 250,
    g: 128,
    b: 114
  },
  sandybrown: {
    r: 244,
    g: 164,
    b: 96
  },
  seagreen: {
    r: 46,
    g: 139,
    b: 87
  },
  seashell: {
    r: 255,
    g: 245,
    b: 238
  },
  sienna: {
    r: 160,
    g: 82,
    b: 45
  },
  silver: {
    r: 192,
    g: 192,
    b: 192
  },
  skyblue: {
    r: 135,
    g: 206,
    b: 235
  },
  slateblue: {
    r: 106,
    g: 90,
    b: 205
  },
  slategray: {
    r: 112,
    g: 128,
    b: 144
  },
  slategrey: {
    r: 112,
    g: 128,
    b: 144
  },
  snow: {
    r: 255,
    g: 250,
    b: 250
  },
  springgreen: {
    r: 0,
    g: 255,
    b: 127
  },
  steelblue: {
    r: 70,
    g: 130,
    b: 180
  },
  tan: {
    r: 210,
    g: 180,
    b: 140
  },
  teal: {
    r: 0,
    g: 128,
    b: 128
  },
  thistle: {
    r: 216,
    g: 191,
    b: 216
  },
  tomato: {
    r: 255,
    g: 99,
    b: 71
  },
  transparent: {
    r: 255,
    g: 255,
    b: 255,
    a: 0
  },
  turquoise: {
    r: 64,
    g: 224,
    b: 208
  },
  violet: {
    r: 238,
    g: 130,
    b: 238
  },
  wheat: {
    r: 245,
    g: 222,
    b: 179
  },
  white: {
    r: 255,
    g: 255,
    b: 255
  },
  whitesmoke: {
    r: 245,
    g: 245,
    b: 245
  },
  yellow: {
    r: 255,
    g: 255,
    b: 0
  },
  yellowgreen: {
    r: 154,
    g: 205,
    b: 50
  }
};

/* eslint-disable no-cond-assign */
var colorUtils = {
  resolveExpression: function resolveExpression(input) {
    // rgb
    var matches = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(input);

    if (matches) {
      return "rgb(".concat(matches[1], ",").concat(matches[2], ",").concat(matches[3], ")");
    } // rgba


    matches = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d(\.\d+)?)\s*\)$/i.exec(input);

    if (matches) {
      return "rgba(".concat(matches[1], ",").concat(matches[2], ",").concat(matches[3], ",").concat(matches[4], ")");
    } // argb


    matches = /^argb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(input);

    if (matches) {
      var a = Math.round(matches[1] / 2.55) / 100;
      return "rgba(".concat(matches[2], ",").concat(matches[3], ",").concat(matches[4], ",").concat(a, ")");
    } // hex


    matches = /^#([A-f0-9]{2})([A-f0-9]{2})([A-f0-9]{2})$/i.exec(input);

    if (matches) {
      return input;
    } // css color


    var color = input && colorStruct[input.toLowerCase()];

    if (color) {
      var _a = color.a !== undefined ? color.a : 1;

      return "rgba(".concat(color.r, ",").concat(color.g, ",").concat(color.b, ",").concat(_a, ")");
    } // invalid


    return 'none';
  },
  getDarkColor: function getDarkColor(color) {
    var percent = 0.5;
    var f;
    var R;
    var B;
    var G;

    if (color.length > 7) {
      f = color.split(',');
      var rgba = f[0].indexOf('a') !== -1;
      R = rgba ? parseInt(f[0].slice(5), 10) : parseInt(f[0].slice(4), 10);
      G = parseInt(f[1], 10);
      B = parseInt(f[2], 10);
      return "".concat((rgba ? 'rgba(' : 'rgb(') + (Math.round((0 - R) * percent) + R), ",").concat(Math.round((0 - G) * percent) + G, ",").concat(Math.round((0 - B) * percent) + B).concat(rgba ? ",".concat(f[3]) : ')');
    }

    f = parseInt(color.slice(1), 16);
    R = f >> 16;
    G = f >> 8 & 0x00ff;
    B = f & 0x0000ff;
    return "#".concat((0x1000000 + (Math.round((0 - R) * percent) + R) * 0x10000 + (Math.round((0 - G) * percent) + G) * 0x100 + (Math.round((0 - B) * percent) + B)).toString(16).slice(1));
  },
  isDarkColor: function isDarkColor(color) {
    var r;
    var g;
    var b;
    var matches;

    if (matches = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(color)) {
      r = parseInt(matches[1], 10);
      g = parseInt(matches[2], 10);
      b = parseInt(matches[3], 10);
    } else if (matches = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d(\.\d+)?)\s*\)$/i.exec(color)) {
      // rgba(1, 2, 3, 0.4)
      r = parseInt(matches[1], 10);
      g = parseInt(matches[2], 10);
      b = parseInt(matches[3], 10);
    } else if (matches = /^#([A-f0-9]{2})([A-f0-9]{2})([A-f0-9]{2})$/i.exec(color)) {
      // #aBc123
      r = parseInt(matches[1], 16);
      g = parseInt(matches[2], 16);
      b = parseInt(matches[3], 16);
    }

    return 0.299 * r + 0.587 * g + 0.114 * b < 125;
  }
};

var pageSize = 3300;
var attributeIDs = {
  colorByExpression: 'color',
  labelExpression: 'label',
  subLabelExpression: 'subLabel',
  extraLabelExpression: 'extraLabel'
};
var MAX_DATA = 'max-data-limit';
var NO_ROOT = 'no_root';

function getId(row) {
  return row[0].qText;
}

function getParentId(row) {
  return row[1].qText;
}

function anyCycle(nodes) {
  var visited = {};
  var marked = {};

  function isCycleUtil(node) {
    visited[node.id] = true;
    marked[node.id] = true;

    for (var i = 0; i < node.children.length; ++i) {
      if (!visited[node.children[i].id] && isCycleUtil(node.children[i])) {
        return true;
      }

      if (marked[node.children[i].id]) {
        return true;
      }
    }

    marked[node.id] = false;
    return false;
  }

  for (var i = 0; i < nodes.length; ++i) {
    var node = nodes[i];

    if (!visited[node.id] && isCycleUtil(node)) {
      return true;
    }
  }

  return false;
}
function fetchPage(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
  return _fetchPage.apply(this, arguments);
}

function _fetchPage() {
  _fetchPage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(dataPages, dataMatrix, model, fullHeight, currentRow, callNum, maxCalls) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return model.getHyperCubeData('/qHyperCubeDef', [{
              qTop: currentRow,
              qLeft: 0,
              qWidth: 3,
              qHeight: pageSize
            }]).then(function (data) {
              dataPages.push(data[0]);
              dataMatrix.push.apply(dataMatrix, _toConsumableArray(data[0].qMatrix)); // eslint-disable-next-line no-param-reassign

              currentRow += data[0].qArea.qHeight;
            });

          case 2:
            if (!(callNum >= maxCalls)) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt("return", MAX_DATA);

          case 4:
            if (!(fullHeight > currentRow)) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", fetchPage(dataPages, dataMatrix, model, fullHeight, currentRow, callNum + 1, maxCalls));

          case 6:
            return _context2.abrupt("return", '');

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _fetchPage.apply(this, arguments);
}

var getDataMatrix = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(layout, model) {
    var dataPages, fullHeight, loadedHeight, dataMatrix, status;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!layout.snapshotData) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", {
              status: '',
              dataMatrix: layout.snapshotData.dataMatrix
            });

          case 2:
            dataPages = layout.qHyperCube && layout.qHyperCube.qDataPages;
            fullHeight = layout.qHyperCube.qSize.qcy;
            loadedHeight = dataPages[0].qArea.qHeight;
            dataMatrix = _toConsumableArray(dataPages[0].qMatrix);
            status = ''; // If there seems to be more data, check if it is already loadad or load it

            if (!(fullHeight > loadedHeight && dataPages.length === 1 && model)) {
              _context.next = 13;
              break;
            }

            _context.next = 10;
            return fetchPage(layout.qHyperCube.qDataPages, dataMatrix, model, fullHeight, loadedHeight, 0, layout.rowLimit / pageSize || 10);

          case 10:
            status = _context.sent;
            _context.next = 14;
            break;

          case 13:
            dataPages.forEach(function (page, i) {
              i > 0 ? dataMatrix.push.apply(dataMatrix, _toConsumableArray(page.qMatrix)) : '';
            });

          case 14:
            return _context.abrupt("return", {
              status: status,
              dataMatrix: dataMatrix
            });

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getDataMatrix(_x8, _x9) {
    return _ref.apply(this, arguments);
  };
}();
function getAttributeIndecies(attrsInfo) {
  if (attrsInfo && attrsInfo.length) {
    var indecies = [];
    attrsInfo.forEach(function (attr, i) {
      if (attributeIDs[attr.id]) {
        indecies.push({
          prop: attributeIDs[attr.id],
          index: i
        });
      }
    });
    return indecies;
  }

  return [];
}
function getAttributes(indecies, qAttrExps) {
  var attributes = {};
  indecies.forEach(function (attr) {
    if (attr.prop === 'color') {
      attributes[attr.prop] = colorUtils.resolveExpression(qAttrExps.qValues[attr.index].qText);
    } else {
      attributes[attr.prop] = qAttrExps.qValues[attr.index].qText;
    }
  });
  return attributes;
}
function getAllTreeElemNo(node, activate) {
  var idList = [];

  var pushChildrenIds = function pushChildrenIds(currentNode) {
    currentNode.children.forEach(function (child) {
      child.data.selected = activate;
      idList.push(child.data.elemNo);

      if (child.children && child.children.length > 0) {
        pushChildrenIds(child);
      }
    });
  };

  node.children && pushChildrenIds(node);
  return idList;
}
function haveNoChildren(nodes) {
  if (!nodes) {
    return true;
  }

  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i].children !== undefined) {
      return false;
    }
  }

  return true;
}
function createNodes(matrix, attributeIndecies, status, navigationMode, translator) {
  var nodeMap = {};
  var allNodes = [];

  for (var i = 0; i < matrix.length; ++i) {
    var row = matrix[i];
    var id = getId(row);
    var parentId = getParentId(row);
    var node = {
      id: id,
      parentId: parentId,
      children: [],
      elemNo: row[0].qElemNumber,
      attributes: getAttributes(attributeIndecies, row[0].qAttrExps),
      measure: row[2] && row[2].qText,
      rowNo: i
    };
    nodeMap[id] = node;
    allNodes.push(node);
  }

  var rootNodes = [];
  var maxNodeWarning = false;

  for (var _i = 0; _i < allNodes.length; ++_i) {
    var _node = allNodes[_i];
    var parentNode = nodeMap[_node.parentId];
    _node.parent = parentNode;

    if (parentNode) {
      parentNode.children.length > 98 ? maxNodeWarning = true : parentNode.children.push(_objectSpread2({
        childNumber: parentNode.children.length
      }, _node));
    } else {
      rootNodes.length > 98 ? maxNodeWarning = true : rootNodes.push(_node);
    }
  } // We might be able to use the rootnodes lenght as well


  if (rootNodes.length === 0) {
    // The only way to have no root noot is to have a single cycle, which means we cannot break it
    return {
      error: NO_ROOT,
      message: translator.get('Object.OrgChart.MissingRoot')
    };
  }

  var warn = [];

  if (status === MAX_DATA) {
    warn.push(translator.get('Object.OrgChart.MaxData'));
  } // Only show a maximum of children.


  if (maxNodeWarning) {
    warn.push(translator.get('Object.OrgChart.MaxChildren'));
  } // I have not looked at these functions at all. But we need to check the data as well I would say.


  if (anyCycle(allNodes)) {
    warn.push(translator.get('Object.OrgChart.CycleWarning'));
  }

  if (rootNodes.length === 1) {
    rootNodes[0].warn = warn;
    rootNodes[0].navigationMode = navigationMode;
    return rootNodes[0];
  } // Here a fake root node is created when multiple rootnodes exist


  warn.push(translator.get('Object.OrgChart.DummyWarn'));
  var rootNode = {
    id: 'Root',
    name: translator.get('Object.OrgChart.DummyRoot'),
    isDummy: true,
    // Should be rendered in a specific way?
    warn: warn,
    children: rootNodes,
    navigationMode: navigationMode
  };
  rootNodes.forEach(function (node, i) {
    // eslint-disable-next-line no-param-reassign
    node.parentId = 'Root'; // eslint-disable-next-line no-param-reassign

    node.parent = rootNode; // eslint-disable-next-line no-param-reassign

    node.childNumber = i;
  });
  return rootNode;
}
function transform(_x10) {
  return _transform.apply(this, arguments);
}

function _transform() {
  _transform = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref2) {
    var layout, model, translator, _yield$getDataMatrix, status, dataMatrix, attributeIndecies;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            layout = _ref2.layout, model = _ref2.model, translator = _ref2.translator;

            if (layout.qHyperCube) {
              _context3.next = 3;
              break;
            }

            throw new Error('Require a hypercube');

          case 3:
            if (!(layout.qHyperCube.qDimensionInfo.length < 2)) {
              _context3.next = 5;
              break;
            }

            return _context3.abrupt("return", false);

          case 5:
            _context3.next = 7;
            return getDataMatrix(layout, model);

          case 7:
            _yield$getDataMatrix = _context3.sent;
            status = _yield$getDataMatrix.status;
            dataMatrix = _yield$getDataMatrix.dataMatrix;
            attributeIndecies = getAttributeIndecies(layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo);

            if (dataMatrix) {
              _context3.next = 13;
              break;
            }

            return _context3.abrupt("return", null);

          case 13:
            if (!(dataMatrix.length < 1)) {
              _context3.next = 15;
              break;
            }

            return _context3.abrupt("return", null);

          case 15:
            return _context3.abrupt("return", createNodes(dataMatrix, attributeIndecies, status, layout.navigationMode, translator));

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _transform.apply(this, arguments);
}

var cardPadding = 8;
var buttonMargin = 16;
var buttonHeight = 24;
var constants = {
  cardWidth: 152,
  cardHeight: 64,
  widthMargin: 32,
  heightMargin: buttonHeight + cardPadding * 2 + buttonMargin,
  buttonMargin: buttonMargin,
  leafMargin: 16,
  cardPadding: cardPadding,
  buttonWidth: 48,
  // TODO: might need to be dynamic
  buttonHeight: buttonHeight,
  rootDiameter: 20,
  r: 4,
  tooltipWidth: 240,
  tooltipPadding: 15,
  maxZoom: 6,
  minZoom: 0.2
};

var widthTranslation = function widthTranslation(d, widthSpacing, element, axis, initialZoomState, navigationMode) {
  var buttonMargin = constants.buttonMargin;
  var initialX = initialZoomState && initialZoomState.initialX || 0;

  if (navigationMode === 'expandAll') {
    d[axis] = d.x + initialX;
    return d[axis];
  }

  if (d.parent) {
    if (!d.parent[axis]) {
      d.parent[axis] = widthTranslation(d.parent, widthSpacing, element, axis, initialZoomState);
    }

    if (d.parent.data.id === 'Root') {
      d[axis] = d.parent[axis] + (d.data.childNumber - (d.parent.children.length - 1) / 2) * widthSpacing;
    } else {
      d[axis] = haveNoChildren(d.parent.children) ? d.parent[axis] + buttonMargin : d.parent[axis] + (d.data.childNumber - (d.parent.children.length - 1) / 2) * widthSpacing;
    }
  } else {
    // In case of zoom mode we need to have the tree moved to the right from the start
    d[axis] = initialX;
  }

  return d[axis];
};
var depthTranslation = function depthTranslation(d, depthSpacing, axis, initialZoomState, navigationMode) {
  var cardHeight = constants.cardHeight,
      leafMargin = constants.leafMargin;
  var initialY = initialZoomState && initialZoomState.initialY || 0;

  if (d.parent && d.parent.data.id !== 'Root' && navigationMode !== 'expandAll' && haveNoChildren(d.parent.children)) {
    d[axis] = d.parent.y + depthSpacing + d.data.childNumber * (cardHeight + leafMargin) + initialY;
  } else {
    d[axis] = d.y + initialY;
  }

  return d[axis];
};
function position(orientation, element, initialZoomState, navigationMode) {
  var widthMargin = constants.widthMargin,
      heightMargin = constants.heightMargin,
      cardWidth = constants.cardWidth,
      cardHeight = constants.cardHeight,
      cardPadding = constants.cardPadding;
  var widthSpacing;
  var depthSpacing;
  var orientations;

  switch (orientation) {
    case 'ttb':
      widthSpacing = cardWidth + widthMargin;
      depthSpacing = navigationMode === 'expandAll' ? cardHeight + 2 * cardPadding : cardHeight + heightMargin;
      orientations = {
        depthSpacing: depthSpacing,
        isVertical: true,
        x: function x(d) {
          return widthTranslation(d, widthSpacing, element, 'xActual', initialZoomState, navigationMode);
        },
        y: function y(d) {
          return depthTranslation(d, depthSpacing, 'yActual', initialZoomState, navigationMode);
        }
      };
      break;
  }

  return orientations;
}

var encodeUtils = {
  encodeTitle: function encodeTitle(input) {
    var encodingDiv = document.createElement('div');
    var textNode = document.createTextNode(input);
    encodingDiv.appendChild(textNode);
    return encodingDiv.innerHTML;
  },
  encodeCssColor: function encodeCssColor(input) {
    var immune = ['#', ' ', '(', ')'];
    var encoded = '';

    for (var i = 0; i < input.length; i++) {
      var ch = input.charAt(i);
      var cc = input.charCodeAt(i);

      if (!ch.match(/[a-zA-Z0-9]/) && immune.indexOf(ch) < 0) {
        var hex = cc.toString(16);
        var pad = '000000'.substr(hex.length);
        encoded += "\\".concat(pad).concat(hex);
      } else {
        encoded += ch;
      }
    }

    return encoded;
  }
};

function resolveColor(color) {
  var resolvedColor = colorUtils.resolveExpression(color);
  return resolvedColor !== 'none' ? resolvedColor : encodeUtils.encodeCssColor(color);
}
function getBackgroundColor(data, cardStyling) {
  if (data.attributes && data.attributes.color) {
    var resolvedColor = colorUtils.resolveExpression(data.attributes.color);

    if (resolvedColor !== 'none') {
      return resolvedColor;
    }
  }

  return resolveColor(cardStyling.backgroundColor);
}
function getFontColor(cardStyling, backgroundColor) {
  if (cardStyling.fontColor === 'default') {
    return colorUtils.isDarkColor(backgroundColor) ? '#e6e6e6' : '#484848';
  }

  return cardStyling.fontColor;
}
var card = (function (data, cardStyling, selectionObj) {
  var api = selectionObj.api,
      state = selectionObj.state;
  var isSelected = api && api.isActive() && state.indexOf(data.elemNo) !== -1;
  var backgroundColor = getBackgroundColor(data, cardStyling);
  var fontColor = resolveColor(getFontColor(cardStyling, backgroundColor));
  var attributes = data.attributes || {};
  var html = "<div class=\"sn-org-card-title\">".concat(encodeUtils.encodeTitle(attributes.label || data.id), "</div>");

  if (attributes.subLabel) {
    html += "<div class=\"sn-org-card-label\">".concat(encodeUtils.encodeTitle(attributes.subLabel), "</div>");
  }

  if (data.measure) {
    var measureLabel = cardStyling.measureLabel ? "".concat(cardStyling.measureLabel, ": ") : '';
    html += "<div class=\"sn-org-card-label\">".concat(encodeUtils.encodeTitle(measureLabel + data.measure), "</div>");
  } else if (attributes.extraLabel) {
    html += "<div class=\"sn-org-card-label\">".concat(encodeUtils.encodeTitle(attributes.extraLabel), "</div>");
  }

  var selectedClass = api && api.isActive() ? isSelected ? ' selected' : ' not-selected' : '';
  var _cardStyling$border = cardStyling.border,
      _cardStyling$border$t = _cardStyling$border.top,
      top = _cardStyling$border$t === void 0 ? true : _cardStyling$border$t,
      fullBorder = _cardStyling$border.fullBorder,
      _cardStyling$border$c = _cardStyling$border.colorType,
      colorType = _cardStyling$border$c === void 0 ? 'auto' : _cardStyling$border$c;
  var borderColor = colorType === 'auto' ? colorUtils.getDarkColor(backgroundColor) : resolveColor(cardStyling.borderColor);
  var topBorder = top && !isSelected ? "3px solid ".concat(borderColor) : '';
  var borderStyle = fullBorder && !isSelected ? "1px solid ".concat(borderColor) : '';
  var newCardHeight = constants.cardHeight;

  if (isSelected) {
    newCardHeight -= 8;
  } else if (fullBorder) {
    newCardHeight -= 4;
  } else if (top) {
    newCardHeight -= 3;
  }

  return "<div class=\"sn-org-card-text".concat(selectedClass, "\" style=\"background-color:").concat(backgroundColor, ";color:").concat(fontColor, "; border:").concat(borderStyle, "; border-top:").concat(topBorder, "; height:").concat(newCardHeight, "px;\">").concat(html, "</div>");
});

var selections = {
  select: function select(node, selectionObj) {
    var api = selectionObj.api,
        state = selectionObj.state,
        singleSelect = selectionObj.singleSelect,
        setState = selectionObj.setState;

    if (node && api) {
      var newState;

      if (node.data.elemNo < 0 && node.data.elemNo !== -3) {
        return;
      }

      if (node.data.isLocked) {
        return;
      }

      if (!api.isActive() || !state) {
        api.begin('/qHyperCubeDef');
        newState = [];
      } else {
        newState = state.concat();
      }

      var ind = newState.indexOf(node.data.elemNo);
      var activate = ind === -1;
      var linkedIds = [];

      if (!singleSelect) {
        linkedIds = getAllTreeElemNo(node, activate);
      }

      if (!activate) {
        newState.splice(ind, 1);
        linkedIds.forEach(function (id) {
          var idInd = newState.indexOf(id);
          idInd !== -1 && newState.splice(idInd, 1);
        });
      } else {
        newState.push(node.data.elemNo);
        linkedIds.forEach(function (id) {
          if (newState.indexOf(id) === -1) {
            newState.push(id);
          }
        });
      }

      if (newState.length === 0) {
        api.clear();
      } else {
        api.select({
          method: 'selectHyperCubeValues',
          params: ['/qHyperCubeDef', 0, newState, false]
        });
      }

      setState(newState);
    }
  }
};

function createTooltip(element) {
  var tooltip = select(element).append('div').attr('class', 'sn-org-tooltip').on('mousedown', function () {
    tooltip.classed('sn-org-tooltip-visible', false);
  });
  return tooltip;
}
function getTooltipStyle(d, containerHeight, x, y, transform) {
  var cardWidth = constants.cardWidth,
      tooltipPadding = constants.tooltipPadding;
  var halfCardWidth = cardWidth / 2;
  var yLocation = containerHeight - (y(d) * transform.zoom + transform.y - tooltipPadding);
  var xLocation = x(d) * transform.zoom + transform.x + halfCardWidth * transform.zoom;
  return "bottom:".concat(yLocation, "px;left:").concat(xLocation, "px;");
}
function getTooltipContent(d, styling) {
  var label = encodeUtils.encodeTitle(d.data.attributes.label || d.data.id);
  var subLabel = d.data.attributes.subLabel ? "".concat(encodeUtils.encodeTitle(d.data.attributes.subLabel), "<br />") : '';
  var extraLabel = d.data.attributes.extraLabel ? "".concat(encodeUtils.encodeTitle(d.data.attributes.extraLabel), "<br />") : '';
  var measure = encodeUtils.encodeTitle(d.data.measure ? "".concat(styling.measureLabel ? "".concat(styling.measureLabel, ": ") : '').concat(d.data.measure) : '');
  return "<div class=\"sn-org-tooltip-inner\"><div class=\"sn-org-tooltip-header\">".concat(label, "</div>").concat(subLabel).concat(extraLabel).concat(measure, "</div>");
}
function openTooltip(tooltip, d, containerHeight, styling, x, y, transform) {
  var delay = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 250;
  tooltip.active = true;
  tooltip.timeout = setTimeout(function () {
    if (tooltip.active) {
      tooltip.html(getTooltipContent(d, styling)).classed('sn-org-tooltip-visible', true).attr('style', function () {
        return getTooltipStyle(d, containerHeight, x, y, transform);
      });
    }
  }, delay);
}
function closeTooltip(tooltip) {
  clearTimeout(tooltip.timeout);
  tooltip.active = false;
  tooltip.classed('sn-org-tooltip-visible', false);
}

var getSign = function getSign(d, _ref, ancestorIds) {
  var topId = _ref.topId,
      isExpanded = _ref.isExpanded,
      expandedChildren = _ref.expandedChildren;

  if (d.data.id === topId && isExpanded || d.parent && d.parent.data.id === topId && expandedChildren.includes(d.data.id) || ancestorIds.includes(d.data.id)) {
    return '-';
  }

  return '+';
};
var getNewState = function getNewState(d, _ref2, ancestorIds) {
  var topId = _ref2.topId,
      isExpanded = _ref2.isExpanded,
      expandedChildren = _ref2.expandedChildren;

  if (d.data.id === topId) {
    // top
    isExpanded = !isExpanded;
    expandedChildren = [];
  } else if (ancestorIds.includes(d.data.id)) {
    // ancestors
    topId = d.parent ? d.parent.data.id : d.data.id;
    isExpanded = !!d.parent;
    expandedChildren = [];
  } else if (d.parent.data.id === topId) {
    // children
    var expandedHaveNoChildren = d.parent.children.filter(function (sibling) {
      return expandedChildren.includes(sibling.data.id);
    }).every(function (n) {
      return haveNoChildren(n.children);
    });

    if (expandedChildren.includes(d.data.id)) {
      // Collapse if already exists in expandedChildren
      expandedChildren.splice(expandedChildren.indexOf(d.data.id), 1);
    } else if (haveNoChildren(d.children) && expandedHaveNoChildren) {
      // Add this node as expanded if possible
      expandedChildren.push(d.data.id);
    } else {
      // Replace expanded with this node
      expandedChildren = [d.data.id];
    }
  } else {
    // grand children
    topId = d.parent.data.id;
    isExpanded = true;
    expandedChildren = [d.data.id];
  }

  return {
    topId: topId,
    isExpanded: isExpanded,
    expandedChildren: expandedChildren
  };
};
function box(_ref3) {
  var positioning = _ref3.positioning,
      divBox = _ref3.divBox,
      nodes = _ref3.nodes,
      styling = _ref3.styling,
      setExpandedCallback = _ref3.setExpandedCallback,
      wrapperState = _ref3.wrapperState,
      selectionObj = _ref3.selectionObj,
      navigationMode = _ref3.navigationMode,
      element = _ref3.element,
      tooltip = _ref3.tooltip;
  var x = positioning.x,
      y = positioning.y;
  var cardWidth = constants.cardWidth,
      cardHeight = constants.cardHeight,
      buttonWidth = constants.buttonWidth,
      buttonHeight = constants.buttonHeight,
      cardPadding = constants.cardPadding,
      rootDiameter = constants.rootDiameter;
  var topId = wrapperState.expandedState.topId;
  var topNode = nodes.find(function (node) {
    return node.data.id === topId;
  });
  var ancestorIds = topNode && topNode.parent ? topNode.parent.ancestors().map(function (anc) {
    return anc.data.id;
  }) : [];
  var touchmode = document.getElementsByTagName('html')[0].classList.contains('touch-on'); // dummy root

  divBox.selectAll('.sn-org-nodes').data(nodes.filter(function (node) {
    return node.parent && node.parent.data.id === 'Root';
  })).enter().append('div').attr('class', 'sn-org-root').attr('style', function (d) {
    return "top:".concat(y(d) - rootDiameter - cardPadding, "px;left:").concat(x(d) + (cardWidth - rootDiameter) / 2, "px");
  }).attr('id', function (d) {
    return d.data.id;
  }); // cards

  divBox.selectAll('.sn-org-nodes').data(nodes.filter(function (node) {
    return node.data.id !== 'Root';
  })).enter().append('div').attr('class', 'sn-org-card').attr('style', function (d) {
    return "width:".concat(cardWidth, "px;height:").concat(cardHeight, "px; top:").concat(y(d), "px;left:").concat(x(d), "px;");
  }).attr('id', function (d) {
    return d.data.id;
  }).on('click', function (node) {
    if (!wrapperState.constraints.active && node.data.id !== 'Root') {
      touchmode && openTooltip(tooltip, node, element.clientHeight, styling, x, y, wrapperState.transform, 0);
      selections.select(node, selectionObj);
    }
  }).html(function (d) {
    return card(d.data, styling, selectionObj);
  }).on('mouseenter', function (d) {
    if (!touchmode && !wrapperState.constraints.active && event.buttons === 0) {
      openTooltip(tooltip, d, element.clientHeight, styling, x, y, wrapperState.transform);
    }
  }).on('mouseleave', function () {
    !touchmode && closeTooltip(tooltip);
  }).on('mousedown', function () {
    closeTooltip(tooltip);
  }).on('touchmove', function () {
    closeTooltip(tooltip);
  }).on('wheel', function () {
    closeTooltip(tooltip);
  }); // expand/collapse

  if (navigationMode !== 'expandAll') {
    divBox.selectAll('.sn-org-nodes').data(nodes.filter(function (node) {
      return !!node.children && node.data.id !== 'Root';
    })).enter().append('div').attr('class', 'sn-org-traverse').attr('style', function (d) {
      return "width:".concat(buttonWidth, "px;height:").concat(buttonHeight, "px;top:").concat(y(d) + cardHeight + cardPadding, "px;left:").concat(x(d) + (cardWidth - buttonWidth) / 2, "px;");
    }).attr('id', function (d) {
      return "".concat(d.data.id, "-expand");
    }).on('mouseenter', function () {
      if (!wrapperState.constraints.active) event.target.style.cursor = 'pointer';
    }).on('click', function (d) {
      if (!wrapperState.constraints.active) {
        setExpandedCallback(getNewState(d, wrapperState.expandedState, ancestorIds));
        event.stopPropagation();
      }
    }).html(function (d) {
      return "".concat(getSign(d, wrapperState.expandedState, ancestorIds), " ").concat(d.data.children.length);
    });
  } // go up only necessary in page navigation mode
  // if (navigationMode !== 'free') {
  //   divBox
  //     .selectAll('.sn-org-nodes')
  //     .data(nodes.filter(node => node.data.id === topId && node.parent))
  //     .enter()
  //     .append('div')
  //     .attr('class', 'sn-org-traverse')
  //     .attr(
  //       'style',
  //       d =>
  //         `width:${buttonWidth}px;height:${buttonHeight}px;top:${y(d) - buttonHeight - cardPadding}px;left:${x(d) +
  //           (cardWidth - buttonWidth) / 2}px;`
  //     )
  //     .attr('id', d => `${d.data.id}-up`)
  //     .on('click', d => {
  //       if (!wrapperState.constraints.active) {
  //         setExpandedCallback(getNewUpState(d, isExpanded));
  //       }
  //     })
  //     .html('↑');
  // }

}

function getPoints(d, topId, _ref, navigationMode) {
  var depthSpacing = _ref.depthSpacing,
      isVertical = _ref.isVertical,
      x = _ref.x,
      y = _ref.y;
  // TODO: Generalize to make all directions work, currently on only ttb working
  var cardWidth = constants.cardWidth,
      cardHeight = constants.cardHeight,
      buttonHeight = constants.buttonHeight,
      cardPadding = constants.cardPadding,
      buttonMargin = constants.buttonMargin;
  var points = [];
  var halfCard = {
    x: cardWidth / 2,
    y: cardHeight / 2
  };
  var start = {
    x: d.xActual,
    y: d.yActual
  }; // TODO: fix so auto mode does not get a path to parent not showing

  if (d.parent && d.parent.data.id !== 'Root') {
    var halfDepth = depthSpacing / 2;
    var yOffset = navigationMode === 'expandAll' ? cardHeight : cardHeight + cardPadding + buttonHeight;
    var end = {
      x: x(d.parent) + halfCard.x,
      y: y(d.parent) + yOffset
    };

    if (navigationMode !== 'expandAll' && haveNoChildren(d.parent.children)) {
      // to leafs
      points.push(isVertical ? [{
        x: start.x,
        y: start.y + halfCard.y
      }, {
        x: end.x - halfCard.x,
        y: start.y + halfCard.y
      }, {
        x: end.x - halfCard.x,
        y: end.y + buttonMargin
      }, {
        x: end.x,
        y: end.y + buttonMargin
      }, {
        x: end.x,
        y: end.y
      }] : [{
        x: start.x,
        y: start.y
      }, {
        x: start.x,
        y: end.y - halfCard.y
      }, {
        x: end.x + halfDepth,
        y: end.y - halfCard.y
      }, {
        x: end.x + halfDepth,
        y: end.y
      }, {
        x: end.x,
        y: end.y
      }]);
    } else if (start.x === x(d.parent) || start.y === y(d.parent)) {
      // straight line
      points.push([{
        x: start.x + halfCard.x,
        y: start.y
      }, {
        x: end.x,
        y: end.y
      }]);
    } else {
      // to nodes with children
      points.push(isVertical ? [{
        x: start.x + halfCard.x,
        y: start.y
      }, {
        x: start.x + halfCard.x,
        y: start.y - cardPadding
      }, {
        x: end.x,
        y: start.y - cardPadding
      }, {
        x: end.x,
        y: end.y
      }] : [{
        x: start.x,
        y: start.y
      }, {
        x: start.x - cardPadding,
        y: start.y
      }, {
        x: start.x - cardPadding,
        y: end.y
      }, {
        x: end.x,
        y: end.y
      }]);
    }
  } else if (d.parent) {
    // to up button or dummy root
    points.push([{
      x: start.x + halfCard.x,
      y: start.y
    }, {
      x: start.x + halfCard.x,
      y: start.y - cardPadding
    }]);
  }

  if (d.children && d.data.id !== 'Root') {
    // to expand button
    points.push([{
      x: start.x + halfCard.x,
      y: start.y + cardHeight
    }, {
      x: start.x + halfCard.x,
      y: start.y + cardHeight + cardPadding
    }]);
  }

  return points;
}
function getPath(points) {
  // gets the path from first to last points, making turns with radius r at intermediate points
  var r = constants.r;
  var pathString = "M ".concat(points[0].x, " ").concat(points[0].y, " ");
  var dir;

  var setDir = function setDir(i) {
    var delta = {
      x: points[i].x - points[i - 1].x,
      y: points[i].y - points[i - 1].y
    };
    dir = {
      x: (delta.x > 0) - (delta.x < 0) || +delta.x,
      y: (delta.y > 0) - (delta.y < 0) || +delta.y
    };
  };

  setDir(1);

  for (var i = 1; i < points.length; ++i) {
    var point = points[i];

    if (i < points.length - 1) {
      pathString += "L ".concat(point.x - dir.x * r, " ").concat(point.y - dir.y * r, " ");
      setDir(i + 1);
      pathString += "Q ".concat(point.x, " ").concat(point.y, " ").concat(point.x + dir.x * r, " ").concat(point.y + dir.y * r, " ");
    } else {
      // Don't add curve for last point
      pathString += "L ".concat(point.x, " ").concat(point.y, " ");
    }
  }

  return pathString;
}
function createPaths(node, positioning, topId, navigationMode) {
  node.append('path').attr('class', 'sn-org-path').attr('id', function (d) {
    return d.data.id;
  }).attr('d', function (d) {
    var path = '';
    var pointSets = getPoints(d, topId, positioning, navigationMode);
    pointSets.forEach(function (points) {
      path += getPath(points).slice(0, -1);
    });
    return path;
  });
}

var getBBoxOfNodes = function getBBoxOfNodes(nodes) {
  var cardWidth = constants.cardWidth,
      cardHeight = constants.cardHeight,
      buttonHeight = constants.buttonHeight,
      buttonMargin = constants.buttonMargin;
  var bbox = {
    left: Infinity,
    top: Infinity,
    right: -Infinity,
    bottom: -Infinity
  };
  nodes.forEach(function (node) {
    bbox.left = Math.min(node.xActual, bbox.left);
    bbox.top = Math.min(node.yActual, bbox.top);
    bbox.right = Math.max(node.xActual, bbox.right);
    bbox.bottom = Math.max(node.yActual, bbox.bottom);
  });
  return {
    x: bbox.left,
    y: bbox.top - buttonHeight - buttonMargin,
    width: bbox.right - bbox.left + cardWidth,
    height: bbox.bottom - bbox.top + cardHeight + (buttonHeight + buttonMargin) * 2
  };
};
var getInitialZoomState = function getInitialZoomState(bBox, element, navigationMode) {
  var widthMargin = constants.widthMargin,
      cardHeight = constants.cardHeight,
      minZoom = constants.minZoom;
  var maxZoom = navigationMode === 'expandAll' ? Infinity : constants.maxZoom;
  var width = bBox.width,
      height = bBox.height;
  var clientHeight = element.clientHeight,
      clientWidth = element.clientWidth;
  var calcWidth = width + 2 * widthMargin;
  var calcHeight = height + cardHeight;
  var xZoom = Math.max(Math.min(calcWidth / clientWidth, maxZoom), minZoom);
  var yZoom = Math.max(Math.min(calcHeight / clientHeight, maxZoom), minZoom);

  if (xZoom > yZoom) {
    // Zooming for x direction
    return {
      initialX: -bBox.x + widthMargin,
      initialY: -bBox.y + (clientHeight * xZoom - height) / 2,
      initialZoom: xZoom
    };
  } // Zooming for y direction


  return {
    initialX: -bBox.x + (clientWidth * yZoom - width) / 2,
    initialY: cardHeight / 2,
    initialZoom: yZoom
  };
};
var applyTransform = function applyTransform(eventTransform, svg, divBox, width, height) {
  var scaleFactor = eventTransform.k;
  var translation = "".concat(eventTransform.x, "px, ").concat(eventTransform.y, "px");
  svg.attr('transform', eventTransform);
  divBox.classed('org-disable-transition', true);
  svg.classed('org-disable-transition', true);
  divBox.attr('style', "width:".concat(width, "px;height:").concat(height, "px; transform: translate(").concat(translation, ") scale(").concat(scaleFactor, ")"));
};
function setZooming(_ref) {
  var containerData = _ref.containerData,
      setTransform = _ref.setTransform,
      transformState = _ref.transformState,
      wrapperState = _ref.wrapperState,
      initialZoomState = _ref.initialZoomState,
      navigationMode = _ref.navigationMode;
  var svg = containerData.svg,
      divBox = containerData.divBox,
      width = containerData.width,
      height = containerData.height,
      zoomWrapper = containerData.zoomWrapper,
      element = containerData.element,
      tooltip = containerData.tooltip,
      homeButton = containerData.homeButton;
  var _transformState$x = transformState.x,
      x = _transformState$x === void 0 ? 0 : _transformState$x,
      _transformState$y = transformState.y,
      y = _transformState$y === void 0 ? 0 : _transformState$y;
  var minZoom = constants.minZoom,
      maxZoom = constants.maxZoom;
  var zoomFactor = transformState && 1 / transformState.zoom || initialZoomState.initialZoom;
  var scaleFactor = navigationMode === 'expandAll' ? zoomFactor : Math.max(Math.min(maxZoom, zoomFactor), minZoom); // sends otherwise captured mouse event to handle context menu correctly in sense

  var bubbleEvent = function bubbleEvent() {
    var newEvent = document.createEvent('MouseEvents');
    newEvent.initEvent('mousedown', true, false);
    element.dispatchEvent(newEvent);
  };

  var zoomed = function zoomed() {
    select(homeButton).attr('class', 'sn-org-homebutton lui-fade-button lui-fade-button--large');
    setTransform({
      zoom: event$1.transform.k / scaleFactor,
      x: event$1.transform.x,
      y: event$1.transform.y
    });
    bubbleEvent();
    closeTooltip(tooltip);
    applyTransform(identity$1.translate(event$1.transform.x, event$1.transform.y).scale(event$1.transform.k / scaleFactor), svg, divBox, width, height);
  };

  select(zoomWrapper).call(zoom().extent([[0, 0], [width, height]]).filter(function () {
    return !wrapperState.constraints.active && event$1.type !== 'dblclick' && !(event$1.type === 'mousedown' && event$1.which === 3);
  }).scaleExtent([navigationMode === 'expandAll' ? 0.8 : minZoom * scaleFactor, maxZoom * scaleFactor]).on('start', bubbleEvent).on('zoom', zoomed));
  setTransform({
    zoom: 1 / scaleFactor,
    x: x,
    y: y
  });
  applyTransform(identity$1.translate(x, y).scale(1 / scaleFactor), svg, divBox, width, height);
}
var getSnapshotZoom = function getSnapshotZoom(rect, viewState, initialTransform) {
  if (!viewState) {
    return identity$1.translate(initialTransform.x, initialTransform.y).scale(initialTransform.zoom);
  }

  var size = viewState.size;
  var snapZoom = rect.width / size.w > rect.height / size.h ? rect.height / size.h : rect.width / size.w;
  var newX = viewState.transform.x * snapZoom;
  var newY = viewState.transform.y * snapZoom;
  var newZoom = viewState.transform.zoom * snapZoom;
  return identity$1.translate(newX, newY).scale(newZoom);
};

var singleSelectionIcon = 'M9.5,15 C9.77614237,15 10,15.2238576 10,15.5 C10,15.7761424 9.77614237,16 9.5,16 L6.5,16 C6.22385763,16 6,15.7761424 6,15.5 C6,15.2238576 6.22385763,15 6.5,15 L9.5,15 Z M15.5,13 C15.7761424,13 16,13.2238576 16,13.5 L16,15 C16,15.5522847 15.5522847,16 15,16 L13.5,16 C13.2238576,16 13,15.7761424 13,15.5 C13,15.2238576 13.2238576,15 13.5,15 L14.4,15 C14.7313708,15 15,14.7313708 15,14.4 L15,13.5 C15,13.2238576 15.2238576,13 15.5,13 Z M0.5,13 C0.776142375,13 1,13.2238576 1,13.5 L1,14.4 C1,14.7313708 1.26862915,15 1.6,15 L2.5,15 C2.77614237,15 3,15.2238576 3,15.5 C3,15.7761424 2.77614237,16 2.5,16 L1,16 C0.44771525,16 0,15.5522847 0,15 L0,13.5 C0,13.2238576 0.223857625,13 0.5,13 Z M6.8,9 C6.91045695,9 7,9.08954305 7,9.2 L7,12.8 C7,12.9104569 6.91045695,13 6.8,13 L3.2,13 C3.08954305,13 3,12.9104569 3,12.8 L3,9.2 C3,9.08954305 3.08954305,9 3.2,9 L6.8,9 Z M12.8,9 C12.9104569,9 13,9.08954305 13,9.2 L13,12.8 C13,12.9104569 12.9104569,13 12.8,13 L9.2,13 C9.08954305,13 9,12.9104569 9,12.8 L9,9.2 C9,9.08954305 9.08954305,9 9.2,9 L12.8,9 Z M6,10 L4,10 L4,12 L6,12 L6,10 Z M12,10 L10,10 L10,12 L12,12 L12,10 Z M15.5,6 C15.7761424,6 16,6.22385763 16,6.5 L16,9.5 C16,9.77614237 15.7761424,10 15.5,10 C15.2238576,10 15,9.77614237 15,9.5 L15,6.5 C15,6.22385763 15.2238576,6 15.5,6 Z M0.5,6 C0.776142375,6 1,6.22385763 1,6.5 L1,9.5 C1,9.77614237 0.776142375,10 0.5,10 C0.223857625,10 0,9.77614237 0,9.5 L0,6.5 C0,6.22385763 0.223857625,6 0.5,6 Z M6.8,3 C6.91045695,3 7,3.08954305 7,3.2 L7,6.8 C7,6.91045695 6.91045695,7 6.8,7 L3.2,7 C3.08954305,7 3,6.91045695 3,6.8 L3,3.2 C3,3.08954305 3.08954305,3 3.2,3 L6.8,3 Z M12.8,3 C12.9104569,3 13,3.08954305 13,3.2 L13,6.8 C13,6.91045695 12.9104569,7 12.8,7 L9.2,7 C9.08954305,7 9,6.91045695 9,6.8 L9,3.2 C9,3.08954305 9.08954305,3 9.2,3 L12.8,3 Z M12,4 L10,4 L10,6 L12,6 L12,4 Z M2.5,5.70654635e-14 C2.77614237,5.70654635e-14 3,0.223857625 3,0.5 C3,0.776142375 2.77614237,1 2.5,1 L1.6,1 C1.26862915,1 1,1.26862915 1,1.6 L1,2.5 C1,2.77614237 0.776142375,3 0.5,3 C0.223857625,3 0,2.77614237 0,2.5 L0,1 C0,0.44771525 0.44771525,5.70654635e-14 1,5.70654635e-14 L2.5,5.70654635e-14 Z M15,0 C15.5522847,0 16,0.44771525 16,1 L16,2.5 C16,2.77614237 15.7761424,3 15.5,3 C15.2238576,3 15,2.77614237 15,2.5 L15,1.6 C15,1.26862915 14.7313708,1 14.4,1 L13.5,1 C13.2238576,1 13,0.776142375 13,0.5 C13,0.223857625 13.2238576,0 13.5,0 L15,0 Z M9.5,5.67323966e-14 C9.77614237,5.67323966e-14 10,0.223857625 10,0.5 C10,0.776142375 9.77614237,1 9.5,1 L6.5,1 C6.22385763,1 6,0.776142375 6,0.5 C6,0.223857625 6.22385763,5.67323966e-14 6.5,5.67323966e-14 L9.5,5.67323966e-14 Z';
var homeIcon = "<span class=\"lui-fade-button__icon sn-org-home-icon\">\n                          <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"20\" height=\"20\" viewBox=\"0 0 16 16\">\n                            <defs>\n                              <path id=\"home-a\" d=\"M2,7.9 L8,3.4 L14,7.9 L14,16 L12,16 L12,11.2 C12,11.0895431 11.9104569,11 11.8,11 L9.2,11 C9.08954305,11 9,11.0895431 9,11.2 L9,16 L2,16 L2,7.9 Z M7,13.8 L7,11.2 C7,11.0895431 6.91045695,11 6.8,11 L4.2,11 C4.08954305,11 4,11.0895431 4,11.2 L4,13.8 C4,13.9104569 4.08954305,14 4.2,14 L6.8,14 C6.91045695,14 7,13.9104569 7,13.8 Z M13,4.1 L16,6.5 L15,7.5 L8,2 L1,7.5 L0,6.5 L8,0 L11,2.4 L11,1 L13,1 L13,4.1 Z\"/>\n                            </defs>\n                            <use xlink:href=\"#home-a\"/>\n                          </svg>\n                        </span>";

var filterTree = function filterTree(_ref, nodeTree, extended, navigationMode) {
  var topId = _ref.topId,
      isExpanded = _ref.isExpanded,
      expandedChildren = _ref.expandedChildren;

  if (navigationMode === 'expandAll') {
    return nodeTree.descendants();
  }

  var topNode = nodeTree.descendants().find(function (node) {
    return node.data.id === topId;
  }) || nodeTree;
  var subTree = [];

  if (isExpanded && topNode.children) {
    // children
    topNode.children.forEach(function (child) {
      subTree.push(child);

      if (child.children) {
        if (expandedChildren.indexOf(child.data.id) !== -1 || extended) {
          child.children.forEach(function (grandChild) {
            subTree.push(grandChild);

            if (expandedChildren.indexOf(child.data.id) !== -1 && extended && grandChild.children) {
              grandChild.children.forEach(function (extendedChild) {
                subTree.push(extendedChild);
              });
            }
          });
        }
      }
    });
  }

  if (nodeTree.data.navigationMode === 'free' && topNode.parent) {
    var ancestors = topNode.parent.ancestors();
    var ancestorIds = ancestors.map(function (anc) {
      return anc.data.id;
    });
    ancestors.forEach(function (ancestor) {
      if (extended) {
        ancestor.children.forEach(function (child) {
          child.children && ancestorIds.indexOf(child.data.id) === -1 && child.data.id !== topNode.data.id && subTree.unshift.apply(subTree, _toConsumableArray(child.children));
        });
      }

      subTree.unshift.apply(subTree, _toConsumableArray(ancestor.children));

      if (!ancestor.parent) {
        subTree.unshift(ancestor);
      }
    });
  } else {
    subTree.unshift(topNode); // self
  }

  return subTree;
};
var paintTree = function paintTree(_ref2) {
  var containerData = _ref2.containerData,
      styling = _ref2.styling,
      setExpandedCallback = _ref2.setExpandedCallback,
      wrapperState = _ref2.wrapperState,
      selectionObj = _ref2.selectionObj,
      element = _ref2.element;
  var svg = containerData.svg,
      divBox = containerData.divBox,
      allNodes = containerData.allNodes,
      positioning = containerData.positioning,
      tooltip = containerData.tooltip;
  var navigationMode = allNodes.data.navigationMode;
  divBox.selectAll('*').remove();
  svg.selectAll('*').remove(); // filter the nodes the nodes

  var nodes = filterTree(wrapperState.expandedState, allNodes, false, navigationMode); // Create cards and naviagation buttons

  box({
    positioning: positioning,
    divBox: divBox,
    nodes: nodes,
    styling: styling,
    setExpandedCallback: setExpandedCallback,
    wrapperState: wrapperState,
    selectionObj: selectionObj,
    navigationMode: navigationMode,
    element: element,
    tooltip: tooltip
  }); // Create the lines (links) between the nodes

  var node = svg.selectAll('.sn-org-paths').data(nodes).enter();
  createPaths(node, positioning, wrapperState.expandedState.topId, navigationMode); // Scale and translate only needed when user cannot zoom
  // if (navigationMode !== 'free') {
  //   transform(nodes, width, height, svg, divBox, useTransitions);
  // }
};
var createContainer = function createContainer(_ref3) {
  var element = _ref3.element,
      dataTree = _ref3.dataTree,
      selectionObj = _ref3.selectionObj,
      wrapperState = _ref3.wrapperState,
      setInitialZoom = _ref3.setInitialZoom,
      setTransform = _ref3.setTransform,
      setExpandedState = _ref3.setExpandedState,
      viewState = _ref3.viewState,
      setContainerData = _ref3.setContainerData,
      layout = _ref3.layout;
  element.innerHTML = '';
  element.className = 'sn-org-chart';
  var navigationMode = layout.navigationMode;
  var positioning = position('ttb', element, {}, navigationMode);

  var _element$getBoundingC = element.getBoundingClientRect(),
      width = _element$getBoundingC.width,
      height = _element$getBoundingC.height;

  var zoomWrapper = select(element).append('span').attr('class', 'sn-org-zoomwrapper').on('click', function () {
    if (!wrapperState.constraints.active && (!selectionObj.api.isActive() || !selectionObj.state)) {
      selectionObj.api.begin('/qHyperCubeDef');
      selectionObj.setState([]);
    }
  }).node();
  var svgBox = select(zoomWrapper).selectAll('svg').data([{}]).enter().append('svg').attr('class', 'sn-org-svg').attr('width', '100%').attr('height', '100%');
  var divBox = select(zoomWrapper).selectAll('div').data([{}]).enter().append('div').attr('class', 'sn-org-nodes');
  var homeButton = select(element).append('button').attr('class', 'sn-org-homebutton disabled').on('click', function () {
    createContainer({
      element: element,
      dataTree: dataTree,
      selectionObj: selectionObj,
      wrapperState: wrapperState,
      setInitialZoom: setInitialZoom,
      setTransform: setTransform,
      setExpandedState: setExpandedState,
      viewState: viewState,
      setContainerData: setContainerData,
      layout: layout
    });
  }).html(homeIcon).node();
  var tooltip = createTooltip(element);

  if (dataTree.error) {
    select(zoomWrapper).append('div').attr('class', 'sn-org-error').html(dataTree.message);
    return false;
  }

  if (dataTree.warn && dataTree.warn.length) {
    select(zoomWrapper).append('span').attr('class', 'sn-org-warning').html("*".concat(dataTree.warn.join(' ')));
  }

  var svg = svgBox.append('g').attr('class', 'sn-org-paths'); // Here are the settings for the tree. For instance nodesize can be adjusted

  var treemap = tree().size([width, height]).nodeSize([constants.cardWidth + constants.cardPadding, positioning.depthSpacing]);
  var allNodes = treemap(hierarchy(dataTree));
  var resetExpandedState = !wrapperState.expandedState || !allNodes.descendants().find(function (node) {
    return node.data.id === wrapperState.expandedState.topId;
  });
  var newExpandedState = resetExpandedState ? {
    topId: allNodes.data.id,
    isExpanded: true,
    expandedChildren: [],
    useTransitions: false
  } : wrapperState.expandedState;
  var renderNodes = filterTree(newExpandedState, allNodes, false, navigationMode);
  renderNodes.forEach(function (node) {
    if (!node.xActual || !node.yActual) {
      positioning.x(node);
      positioning.y(node);
    }
  });
  var bBox = getBBoxOfNodes(renderNodes);
  var initialZoomState = viewState && viewState.initialZoom ? viewState.initialZoom : getInitialZoomState(bBox, element, navigationMode);
  setInitialZoom(initialZoomState);
  positioning = position('ttb', element, initialZoomState, navigationMode);
  setZooming({
    containerData: {
      svg: svg,
      divBox: divBox,
      width: width,
      height: height,
      zoomWrapper: zoomWrapper,
      element: element,
      tooltip: tooltip,
      homeButton: homeButton
    },
    setTransform: setTransform,
    transformState: viewState && viewState.transform || {},
    wrapperState: wrapperState,
    initialZoomState: initialZoomState,
    navigationMode: navigationMode
  });

  if (resetExpandedState) {
    setExpandedState(newExpandedState);
  }

  return setContainerData({
    svg: svg,
    divBox: divBox,
    allNodes: allNodes,
    positioning: positioning,
    width: width,
    height: height,
    element: element,
    zoomWrapper: zoomWrapper,
    tooltip: tooltip,
    homeButton: homeButton
  });
};

var createSnapshotData = function createSnapshotData(expandedState, allNodes, layout) {
  if (layout.snapshotData && layout.snapshotData.dataMatrix) {
    // Need a check here becuase of free resize in storytelling
    return layout.snapshotData.dataMatrix;
  } // filter down to the visible nodes


  var navigationMode = layout.navigationMode;
  var nodes = filterTree(expandedState, allNodes, true, navigationMode);
  var usedMatrix = [];
  var qDataPages = layout.qHyperCube.qDataPages;
  var dataMatrix = [];
  qDataPages.forEach(function (page) {
    dataMatrix.push.apply(dataMatrix, _toConsumableArray(page.qMatrix));
  });
  nodes.forEach(function (n) {
    if (n.data.rowNo !== undefined) {
      usedMatrix.push(dataMatrix[n.data.rowNo]);
    }
  });
  return usedMatrix;
};
var createViewState = function createViewState(expandedState, transform, initialZoom, element) {
  var size = {
    w: element.clientWidth,
    h: element.clientHeight
  };
  var vs = {
    expandedState: expandedState,
    transform: transform,
    size: size,
    initialZoom: initialZoom
  };
  vs.expandedState.useTransitions = false;
  return vs;
};
function snapshot(expandedState, containerData, layout, transform, initialZoom) {
  var element = useElement();
  onTakeSnapshot(function (snapshotLayout) {
    if (!snapshotLayout.snapshotData) {
      snapshotLayout.snapshotData = {};
    }

    if (!layout.snapshotData || !layout.snapshotData.viewState) {
      snapshotLayout.snapshotData.viewState = createViewState(expandedState, transform, initialZoom, element);
    }

    snapshotLayout.snapshotData.dataMatrix = createSnapshotData(expandedState, containerData.allNodes, layout);
  });
  useImperativeHandle(function () {
    return {
      getViewState: function getViewState() {
        return createViewState(expandedState, transform, initialZoom, element);
      }
    };
  });
}

// Local translations when used outside of sense
var en = {
  'Object.OrgChart': 'Org chart',
  // Name of chart, to be added to sense when native
  'Object.OrgChart.Description': 'Displays the relations of an organization or similarly structured data. Starts at the top and allows for navigation through the hierarchy.',
  // Description of chart, to be added to sense when native
  'Object.OrgChart.MaxData': 'The maximum data limit is reached. The tree may display incorrectly.',
  'Object.OrgChart.DummyWarn': 'The data contains multiple root nodes.',
  'Object.OrgChart.CycleWarning': 'Data contains circular references, nodes are omitted.',
  'Object.OrgChart.MissingRoot': 'No root node, check your data for circular references.',
  'Object.OrgChart.MaxChildren': 'Maximum number of child nodes reached, nodes are omitted.',
  'Object.OrgChart.LabelExpression': 'Card title',
  'Object.OrgChart.SubLabelExpression': 'Card sub-title',
  'Object.OrgChart.ExtraLabelExpression': 'Card description',
  'Object.OrgChart.ColorLabelExpression': 'Card background color',
  'Object.OrgChart.BackgroundColor': 'Background color',
  'Object.OrgChart.FontColor': 'Font color',
  'Object.OrgChart.IncludeDescendants': 'Include descendants',
  'Object.OrgChart.ExtraLabelDesc': 'Description is only visible when a measure is not used'
};

function autoRegister(translator) {
  if (translator && translator.get && translator.add) {
    var t = 'Object.OrgChart.MaxData';
    var g = translator.get(t); // if translated string is different from its id
    // assume translations already exists for current locale

    if (g !== t) {
      return;
    }

    Object.keys(en).forEach(function (key) {
      translator.add({
        id: key,
        locale: {
          'en-US': en[key]
        }
      });
    });
  }
}

function selectionHandler(translator) {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      singleSelect = _useState2[0],
      setSingleSelect = _useState2[1];

  var selectionsAPI = useSelections();
  var isInSelections = !!useLayout().qSelectionInfo.qInSelections;

  var _useState3 = useState({
    api: selectionsAPI,
    setState: function setState(state) {
      selectionObj.state = state;
    },
    state: [],
    singleSelect: false
  }),
      _useState4 = _slicedToArray(_useState3, 1),
      selectionObj = _useState4[0];

  useEffect(function () {
    autoRegister(translator);
  }, [translator]);

  var resetSelections = function resetSelections() {
    selectionObj.state = [];
  };

  var resetSelectionsAndSingleSelect = function resetSelectionsAndSingleSelect() {
    selectionObj.state = [];
    setSingleSelect(false);
  };

  useEffect(function () {
    if (!selectionObj.api) {
      return function () {};
    }

    selectionObj.api = selectionsAPI;
    selectionObj.api.on('deactivated', resetSelections);
    selectionObj.api.on('canceled', resetSelectionsAndSingleSelect);
    selectionObj.api.on('confirmed', resetSelectionsAndSingleSelect);
    selectionObj.api.on('cleared', resetSelections); // Return function called on unmount

    return function () {
      selectionObj.api.removeListener('deactivated', resetSelections);
      selectionObj.api.removeListener('canceled', resetSelectionsAndSingleSelect);
      selectionObj.api.removeListener('confirmed', resetSelectionsAndSingleSelect);
      selectionObj.api.removeListener('cleared', resetSelections);
    };
  }, [selectionsAPI]);
  useEffect(function () {
    selectionObj.singleSelect = singleSelect;
  }, [singleSelect]);
  useAction(function () {
    return {
      action: function action() {
        setSingleSelect(!singleSelect);
      },
      icon: {
        shapes: [{
          type: 'path',
          attrs: {
            d: singleSelectionIcon
          }
        }]
      },
      active: singleSelect,
      hidden: !isInSelections,
      label: translator.get('Object.OrgChart.SingleSelect')
    };
  }, [singleSelect, isInSelections]);
  useEffect(function () {
    var addKeyPress = function addKeyPress(event) {
      if (event.key === 'Shift') {
        setSingleSelect(true);
      }
    };

    var removeKeyPress = function removeKeyPress(event) {
      if (event.key === 'Shift') {
        setSingleSelect(false);
      }
    };

    document.addEventListener('keydown', addKeyPress);
    document.addEventListener('keyup', removeKeyPress);
    return function () {
      document.removeEventListener('keydown', addKeyPress);
      document.removeEventListener('keyup', removeKeyPress);
    };
  }, []);
  return selectionObj;
}

function getColor(reference, Theme, defaultColor) {
  var color;

  switch (reference.colorType) {
    case 'byExpression':
      color = colorUtils.resolveExpression(reference.colorExpression);
      break;

    case 'colorPicker':
      color = Theme.getColorPickerColor(reference.color);
      break;

    default:
      color = defaultColor;
  }

  return color === 'none' ? defaultColor : color;
}
var stylingUtils = {
  cardStyling: function cardStyling(_ref) {
    var Theme = _ref.Theme,
        layout = _ref.layout;
    var backgroundColor = getColor(layout.style.backgroundColor, Theme, '#e6e6e6');
    var fontColor = getColor(layout.style.fontColor, Theme, 'default');
    var measureLabel = layout.qHyperCube.qMeasureInfo.length ? layout.qHyperCube.qMeasureInfo[0].qFallbackTitle : null;
    var _layout$style$border = layout.style.border,
        border = _layout$style$border === void 0 ? {
      colorType: 'auto'
    } : _layout$style$border;
    var borderColor = border.colorType !== 'auto' ? getColor(border, Theme, colorUtils.getDarkColor(backgroundColor)) : colorUtils.getDarkColor(backgroundColor);
    return {
      backgroundColor: backgroundColor,
      fontColor: fontColor,
      measureLabel: measureLabel,
      border: border,
      borderColor: borderColor
    };
  }
};

var viewStateUtil = {
  getViewState: function getViewState(opts, layout) {
    // Get from options passed to object (used in live printing)
    var viewState = opts.viewState;

    if (!viewState && layout.snapshotData && layout.snapshotData.viewState) {
      // Get from layout (used in snapshot mode)
      viewState = layout.snapshotData.viewState;
    }

    return viewState;
  }
};

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".sn-org-chart {\n  /* Tooltip arrow */\n}\n.sn-org-chart .sn-org-tooltip {\n  visibility: hidden;\n  opacity: 0;\n  /* Unsupported in IE, so there we set width explicitly */\n  width: 230px;\n  width: -moz-max-content;\n  width: fit-content;\n  /* Position the tooltip text */\n  position: absolute;\n  z-index: 1;\n}\n.sn-org-chart .sn-org-tooltip::after {\n  content: '';\n  position: absolute;\n  top: 100%;\n  left: 0%;\n  margin-left: -10px;\n  border-width: 10px;\n  border-style: solid;\n  border-color: #404040 transparent transparent transparent;\n}\n.sn-org-chart .sn-org-tooltip-visible {\n  opacity: 0.9;\n  visibility: visible;\n}\n.sn-org-chart .sn-org-tooltip-inner {\n  max-width: 240px;\n  right: 50%;\n  font-family: 'QlikView Sans', sans-serif;\n  position: relative;\n  max-height: 150px;\n  background-color: #404040;\n  color: #e6e6e6;\n  text-align: left;\n  font-size: 13px;\n  line-height: 15px;\n  padding: 10px 10px 10px 10px;\n  border-radius: 6px;\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  word-break: break-word;\n  overflow: hidden;\n}\n.sn-org-chart .sn-org-tooltip-inner .sn-org-tooltip-header {\n  font-weight: bold;\n  padding-bottom: 5px;\n}\n";
styleInject(css_248z);

var css_248z$1 = ".sn-org-chart .sn-org-svg {\n  position: absolute;\n  /* For css only transitions, does not work in IE11 */\n}\n.sn-org-chart .sn-org-svg .sn-org-path {\n  fill: none;\n  stroke: #4c4c4c;\n  stroke-width: 1;\n}\n.sn-org-chart .sn-org-svg .sn-org-paths:not(.org-disable-transition) {\n  transform-origin: 0% 0%;\n  transition-property: all;\n  transition-duration: 0.5s;\n}\n";
styleInject(css_248z$1);

var css_248z$2 = ".sn-org-chart .sn-org-warning {\n  position: absolute;\n  bottom: 0px;\n  left: 0px;\n  font-style: italic;\n  font-size: 13px;\n  color: #7b7a78;\n}\n.sn-org-chart .sn-org-error {\n  margin: 0;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  font-size: 1.2em;\n  transform: translate(-50%, -50%);\n}\n";
styleInject(css_248z$2);

var css_248z$3 = ".sn-org-chart {\n  overflow: hidden;\n}\n.sn-org-chart .sn-org-nodes {\n  position: absolute;\n  transform-origin: 0% 0%;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  backface-visibility: hidden;\n}\n.sn-org-chart .sn-org-nodes:not(.org-disable-transition) {\n  transition-property: all;\n  transition-duration: 0.5s;\n}\n.sn-org-chart .sn-org-nodes .sn-org-traverse {\n  position: absolute;\n  background-color: white;\n  font-size: 20px;\n  font-weight: bold;\n  border-radius: 3px;\n  border: 1px solid #8c8c8c;\n  text-align: center;\n  line-height: 24px;\n}\n.sn-org-chart .sn-org-nodes .sn-org-root {\n  position: absolute;\n  background-color: #8c8c8c;\n  width: 20px;\n  height: 20px;\n  border-radius: 20px;\n}\n.sn-org-chart .sn-org-nodes .sn-org-card {\n  position: absolute;\n}\n.sn-org-chart .sn-org-nodes .sn-org-card .sn-org-card-text {\n  padding-left: 5px;\n  padding-right: 5px;\n  border-radius: 3px;\n}\n.sn-org-chart .sn-org-nodes .sn-org-card .sn-org-card-text.selected {\n  border: 4px solid black;\n  border-radius: 4px;\n}\n.sn-org-chart .sn-org-nodes .sn-org-card .sn-org-card-text.not-selected {\n  opacity: 0.5;\n}\n.sn-org-chart .sn-org-nodes .sn-org-card .sn-org-card-title {\n  font-size: 14px;\n  font-weight: bold;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.sn-org-chart .sn-org-nodes .sn-org-card .sn-org-card-label {\n  font-size: 11px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n";
styleInject(css_248z$3);

var css_248z$4 = ".sn-org-chart .sn-org-homebutton {\n  position: absolute;\n  top: 20px;\n  right: 20px;\n  height: 20px;\n  width: 20px;\n  border-color: transparent;\n  background-color: transparent;\n  fill: rgba(89, 89, 89, 0.8);\n  transition: fill 200ms ease-out;\n}\n.sn-org-chart .sn-org-homebutton:hover {\n  fill: #595959;\n}\n.sn-org-chart .sn-org-homebutton.disabled {\n  display: none;\n}\n";
styleInject(css_248z$4);

function supernova(env) {
  return {
    qae: {
      properties: properties,
      data: data
    },
    component: function component() {
      var layout = useStaleLayout();
      var model = useModel();
      var element = useElement();
      var Theme = useTheme();
      var options = useOptions();
      var rect = useRect();
      var constraints = useConstraints();
      var translator = useTranslator();

      var _useState = useState(null),
          _useState2 = _slicedToArray(_useState, 2),
          containerData = _useState2[0],
          setContainerData = _useState2[1];

      var _useState3 = useState(null),
          _useState4 = _slicedToArray(_useState3, 2),
          styling = _useState4[0],
          setStyling = _useState4[1];

      var _useState5 = useState(null),
          _useState6 = _slicedToArray(_useState5, 2),
          expandedState = _useState6[0],
          setExpandedState = _useState6[1];

      var _useState7 = useState(null),
          _useState8 = _slicedToArray(_useState7, 2),
          transform$1 = _useState8[0],
          setTransform = _useState8[1];

      var _useState9 = useState(null),
          _useState10 = _slicedToArray(_useState9, 2),
          initialZoom = _useState10[0],
          setInitialZoom = _useState10[1];

      var _useState11 = useState({
        transform: {},
        constraints: constraints,
        expandedState: expandedState
      }),
          _useState12 = _slicedToArray(_useState11, 1),
          wrapperState = _useState12[0];

      var selectionObj = selectionHandler(translator);
      useEffect(function () {
        autoRegister(translator);
      }, [translator.language()]);
      useEffect(function () {
        wrapperState.constraints = constraints;
      }, [constraints]);
      useEffect(function () {
        wrapperState.transform = transform$1;
      }, [transform$1]);
      useEffect(function () {
        wrapperState.expandedState = expandedState;
      }, [expandedState]);

      var setExpandedCallback = function setExpandedCallback(newExpandedState) {
        newExpandedState.useTransitions = true;
        setExpandedState(newExpandedState);
      }; // Get and transform the data into a tree structure, get styling, reset active selections


      var _usePromise = usePromise(function () {
        if (!layout) {
          return Promise.resolve();
        }

        var viewState = viewStateUtil.getViewState(options, layout);
        viewState && viewState.expandedState && setExpandedState(viewState.expandedState);
        viewState && viewState.transform && setTransform(viewState.transform);
        return transform({
          layout: layout,
          model: model,
          translator: translator
        }).then(function (transformed) {
          setStyling(stylingUtils.cardStyling({
            Theme: Theme,
            layout: layout
          }));
          selectionObj.setState([]); // Resolving the promise to indicate readiness for printing

          return transformed;
        });
      }, [layout, model, translator.language(), Theme.name()]),
          _usePromise2 = _slicedToArray(_usePromise, 1),
          dataTree = _usePromise2[0]; // Create d3 elements, calculate initial zoom and sets expandedState


      var fullReload = function fullReload() {
        if (element && dataTree) {
          var viewState = viewStateUtil.getViewState(options, layout);
          createContainer({
            element: element,
            dataTree: dataTree,
            viewState: viewState,
            wrapperState: wrapperState,
            selectionObj: selectionObj,
            setInitialZoom: setInitialZoom,
            setTransform: setTransform,
            setExpandedState: setExpandedState,
            setContainerData: setContainerData,
            layout: layout
          });
        }
      }; // Call paintTree, currenly repaints all current nodes


      var rePaint = function rePaint() {
        if (containerData && expandedState && styling) {
          paintTree({
            containerData: containerData,
            styling: styling,
            setExpandedCallback: setExpandedCallback,
            wrapperState: wrapperState,
            selectionObj: selectionObj,
            useTransitions: expandedState.useTransitions,
            element: element
          });
        }
      };

      useEffect(function () {
        rePaint();
      }, [containerData, selectionObj.state]);
      useEffect(function () {
        fullReload();
      }, [element, dataTree, constraints]);
      useEffect(function () {
        if (layout.resizeOnExpand) {
          fullReload();
        } else {
          rePaint();
        }
      }, [expandedState]); // Updates snapshot when resizing

      useEffect(function () {
        if (containerData && layout && layout.snapshotData) {
          var snapshotZoom = getSnapshotZoom(rect, layout.snapshotData.viewState, transform$1);
          applyTransform(snapshotZoom, containerData.svg, containerData.divBox, rect.width, rect.height);
        }
      }, [rect, containerData]);
      snapshot(expandedState, containerData, layout, transform$1, initialZoom);
    },
    ext: ext()
  };
}

export default supernova;
