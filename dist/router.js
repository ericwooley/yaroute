'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _route = require('./route');

var _route2 = _interopRequireDefault(_route);

var Router = (function () {
  function Router() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$history = _ref.history;
    var history = _ref$history === undefined ? true : _ref$history;
    var _ref$routes = _ref.routes;
    var routes = _ref$routes === undefined ? [] : _ref$routes;
    var onChange = _ref.onChange;

    _classCallCheck(this, Router);

    this.keepHistory = history;
    this.routes = [];
    this._eventHash = {
      change: onChange ? [onChange] : []
    };
    routes.forEach(this.addRoute.bind(this));
  }

  _createClass(Router, [{
    key: 'addRoute',
    value: function addRoute() {
      var route = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

      this.routes.push(new _route2['default'](route));
    }
  }, {
    key: 'routeChanged',
    value: function routeChanged() {
      var newLocation = arguments.length <= 0 || arguments[0] === undefined ? location.hash.slice(1) : arguments[0];

      var matchingRoute = this.findMatchingRoute(newLocation);
      if (matchingRoute) this.trigger('change', matchingRoute);
    }
  }, {
    key: 'findMatchingRoute',
    value: function findMatchingRoute(route) {
      for (var i = 0; i < this.routes.length; i++) {
        var routeDefinition = this.routes[i];
        if (routeDefinition.matches(route)) return routeDefinition.toParsedRoute(route);
      }
    }
  }, {
    key: 'trigger',
    value: function trigger(event, value) {
      if (this._eventHash[event]) this._eventHash[event].forEach(function (func) {
        return func(value);
      });
    }
  }, {
    key: 'on',
    value: function on(event, listener) {
      if (!event) throw new Error('Event must be defined');
      if (!listener) throw new Error('Listener must be defined');
      if (this._eventHash[event]) {
        this._eventHash[event].push(listener);
      } else {
        this._eventHash[event] = [listener];
      }
    }
  }, {
    key: 'off',
    value: function off(event) {
      var listener = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var newListeners = [];
      if (listener) {
        for (var i = 0; i < this._eventHash[event].length; i++) {
          var oldListeners = this._eventHash[event][i];
          if (oldListeners !== listener) newListeners.push(listener);
        }
      }
      this._eventHash[event] = newListeners;
    }
  }, {
    key: 'init',
    value: function init() {
      this._hashChangeListener = this.routeChanged.bind(this);
      window.addEventListener('hashchange', this._hashChangeListener);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      window.removeEventListener('hashchange', this._hashChangeListener);
    }
  }]);

  return Router;
})();

exports['default'] = Router;
module.exports = exports['default'];