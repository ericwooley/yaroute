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
  addRoute(route = '') {
    this.routes.push(new Route(route))
  }
  routeChanged() {
    const matchingRoute = this.findMatchingRoute(location.hash.slice(1))
    if (matchingRoute) this.trigger('change', matchingRoute)
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
    this._hashChangeListener = this.routeChanged.bind(this)
    window.addEventListener('hashchange', this._hashChangeListener)
  }
  destroy() {
    window.removeEventListener('hashchange', this._hashChangeListener)
  }
}

export default Router
