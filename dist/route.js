'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _parsedRoute = require('./parsed-route');

var _parsedRoute2 = _interopRequireDefault(_parsedRoute);

var Route = (function () {
  function Route() {
    var routeDefinition = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    _classCallCheck(this, Route);

    var noOp = function noOp() {};
    this.routeDefinition = routeDefinition;
    this.parsedSegments = this.getSegments(routeDefinition).map(function (val) {
      if (noOp[val] !== undefined) {
        throw new Error('Cannot add route, ' + val + ' is a reserved word');
      }
      var isDymanic = val.indexOf(':') === 0;
      var id = val;
      return { isDymanic: isDymanic, id: id };
    });
  }

  _createClass(Route, [{
    key: 'matches',
    value: function matches() {
      var route = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

      var routeSegments = this.getSegments(route);
      if (this.parsedSegments.length !== routeSegments.length) return false;
      // whine whine functional programming blah blah....
      // This needs to be fast
      for (var i = 0; i < this.parsedSegments.length; i++) {
        var originalSegment = this.parsedSegments[i];
        var segment = routeSegments[i];
        if (!originalSegment.isDymanic && originalSegment.id !== segment.toLowerCase()) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: 'toParsedRoute',
    value: function toParsedRoute() {
      var route = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

      if (!this.matches(route)) throw new Error('Route does not match');
      var routeSegments = this.getSegments(route);
      var parsedSegments = this.parsedSegments;
      var routeDefinition = this.routeDefinition;

      return new _parsedRoute2['default']({ routeSegments: routeSegments, parsedSegments: parsedSegments, routeDefinition: routeDefinition, route: route });
    }
  }, {
    key: 'getSegments',
    value: function getSegments() {
      var route = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

      return route.charAt(0) === '/' ? route.slice(1).split('/') : route.split('/');
    }
  }]);

  return Route;
})();

exports['default'] = Route;
module.exports = exports['default'];