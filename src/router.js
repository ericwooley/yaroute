import Route from './route'
class Router {
  constructor({history = true, routes=[], onChange} = {}) {
    this.keepHistory = history
    this.routes = []
    this._eventHash = {
      change: onChange ? [onChange] : []
    }
    routes.forEach(this.addRoute.bind(this))
  }
  static emptyRoute() {
    const emptyRoute = new Route('')
    return emptyRoute.toParsedRoute('')
  }
  addRoute(route = '') {
    this.routes.push(new Route(route))
  }
  getCurrentRoute() {

  }
  forceUpdate() {
    this.routeChanged()
  }
  _routeChanged(newLocation = location.hash.slice(1)) {
    // could be an event
    if(typeof newLocation !== 'string') newLocation = location.hash
    if(newLocation.charAt(0) === '#') newLocation = newLocation.substr(1)
    console.log(newLocation)
    const matchingRoute = this.getParsedRoute(newLocation)
    this.trigger('change', matchingRoute)
  }
  getParsedRoute(route) {
    return this.findMatchingRoute(route) || (new Route(route)).toParsedRoute(route)
  }
  findMatchingRoute(route) {
    for (let i = 0; i < this.routes.length; i++) {
      const routeDefinition = this.routes[i]
      if (routeDefinition.matches(route)) return routeDefinition.toParsedRoute(route)
    }
  }
  trigger(event, value) {
    if (this._eventHash[event]) this._eventHash[event].forEach(func => func(value))
  }
  on(event, listener) {
    if (!event) throw new Error('Event must be defined')
    if (!listener) throw new Error('Listener must be defined')
    if (this._eventHash[event]) {
      this._eventHash[event].push(listener)
    } else {
      this._eventHash[event] = [listener]
    }

  }
  off(event, listener = false) {
    const newListeners = []
    if (listener) {
      for (let i = 0; i < this._eventHash[event].length; i++) {
        const oldListeners = this._eventHash[event][i]
        if (oldListeners !== listener) newListeners.push(listener)
      }
    }
    this._eventHash[event] = newListeners
  }
  init() {
    if(window && window.location) {
      this._hashChangeListener = this._routeChanged.bind(this)
      window.addEventListener('hashchange', this._hashChangeListener)
      this._routeChanged(location.hash)
    } else {
      console.log('Non browser enviornment')
    }
  }
  destroy() {
    window.removeEventListener('hashchange', this._hashChangeListener)
  }
}

export default Router
