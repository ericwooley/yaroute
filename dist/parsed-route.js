'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var ParsedRoute = (function () {
  function ParsedRoute(_ref) {
    var parsedSegments = _ref.parsedSegments;
    var routeSegments = _ref.routeSegments;
    var routeDefinition = _ref.routeDefinition;
    var route = _ref.route;

    _classCallCheck(this, ParsedRoute);

    routeSegments = routeSegments.map(function (seg) {
      return decodeURIComponent(seg);
    });
    this._originalRoute = route;
    this._definition = routeDefinition;
    this._segmentArray = [].concat(_toConsumableArray(routeSegments));
    this._segmentIndex = 0;
    this._parsedSegments = parsedSegments;
    this._routeObject = {};
    this._parseSegments({ parsedSegments: parsedSegments, routeSegments: routeSegments, routeDefinition: routeDefinition, route: route });
    this._indexSegments({ parsedSegments: parsedSegments, routeSegments: routeSegments });
  }

  _createClass(ParsedRoute, [{
    key: 'segment',
    value: function segment() {
      return this._segmentArray[this._segmentIndex];
    }
  }, {
    key: 'next',
    value: function next() {
      this._segmentIndex = Math.min(this._segmentIndex + 1, this._segmentArray.length);
      return this;
    }
  }, {
    key: 'prev',
    value: function prev() {
      this._segmentIndex = Math.max(this._segmentIndex - 1, 0);
      return this;
    }
  }, {
    key: 'beginning',
    value: function beginning() {
      this._segmentIndex = 0;
      return this;
    }
  }, {
    key: 'end',
    value: function end() {
      this._segmentIndex = this._segmentArray.length - 1;
      return this;
    }
  }, {
    key: 'toObj',
    value: function toObj() {
      return _Object$assign({}, this._segmentDict);
    }
  }, {
    key: 'getVal',
    value: function getVal(def) {
      return this._segmentDict[def];
    }
  }, {
    key: 'objectify',
    value: function objectify() {
      return _Object$assign({}, this._routeObject);
    }
  }, {
    key: 'updateLocation',
    value: function updateLocation() {
      var newRoute = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var pushState = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      newRoute = newRoute.charAt(0) === '#' ? newRoute.substr(1) : newRoute;
      console.log(newRoute.split('/'));
      console.log(newRoute.split('/').map(function (uri) {
        return encodeURIComponent(uri);
      }));
      console.log(newRoute.split('/').map(function (uri) {
        return encodeURIComponent(uri);
      }).join('/'));
      newRoute = newRoute.split('/').map(function (uri) {
        return encodeURIComponent(uri);
      }).join('/');
      if (pushState) {
        location.hash = newRoute;
      } else {
        history.replaceState(undefined, undefined, newRoute);
      }
    }
  }, {
    key: 'update',
    value: function update() {
      var newSegVars = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var pushState = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var newRouteArr = [];
      for (var i = 0; i < this._segmentArray.length; i++) {
        var originalSegment = this._segmentArray[i];
        var segmentInfo = this._parsedSegments[i];
        var replacementValue = newSegVars[segmentInfo.id];
        if (replacementValue) {
          newRouteArr.push(replacementValue);
        } else {
          newRouteArr.push(originalSegment);
        }
      }
      var newRoute = newRouteArr.join('/');
      if (this._originalRoute.charAt(0) === '/') newRoute = '/' + newRoute;
      if (this._originalRoute.charAt(this._originalRoute.length - 1) === '/') newRoute += '/';
      this.updateLocation(newRoute, pushState);
    }
  }, {
    key: '_parseSegments',
    value: function _parseSegments(_ref2) {
      var parsedSegments = _ref2.parsedSegments;
      var routeSegments = _ref2.routeSegments;

      var routeObject = {};
      var last = routeObject;

      var _loop = function (i) {
        var segment = parsedSegments[i];
        var segmentValue = routeSegments[i];

        if (segment.isDymanic) {
          /* eslint-disable */
          last[segment.id] = function () {
            return segmentValue.substr(1);
          };
          /* eslint-enable */
        } else {
            last[segment.id] = { segmentValue: segmentValue };
          }
        last = last[segment.id];
      };

      for (var i = 0; i < parsedSegments.length; i++) {
        _loop(i);
      }
      this._routeObject = routeObject;
    }
  }, {
    key: '_indexSegments',
    value: function _indexSegments(_ref3) {
      var parsedSegments = _ref3.parsedSegments;
      var routeSegments = _ref3.routeSegments;

      this._segmentDict = parsedSegments.reduce(function (collector, seg, index) {
        collector[seg.id] = routeSegments[index];
        return collector;
      }, {});
    }
  }]);

  return ParsedRoute;
})();

exports['default'] = ParsedRoute;
module.exports = exports['default'];