class Router {
  constructor({history = true, routes=[], onChange} = {}) {
    this.keepHistory = history
    this.routes = []
    this._eventHash = {
      change: onChange ? [onChange] : []
    }
    routes.forEach(::this.addRoute)
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
    this._hashChangeListener = ::this.routeChanged
    window.addEventListener('hashchange', this._hashChangeListener)
  }
  destroy() {
    window.removeEventListener('hashchange', this._hashChangeListener)
  }
}

class Route {
  constructor(routeDefinition = '') {
    const noOp = function() {}
    this.routeDefinition = routeDefinition
    this.parsedSegments = this.getSegments(routeDefinition).map((val, index) => {
      if (noOp[val] !== undefined) {
        throw new Error(`Cannot add route, ${val} is a reserved word`)
      }
      const isDymanic = val.indexOf(':') === 0
      const value = isDymanic ? val.slice(1) : val
      return {isDymanic, value}
    })
  }
  matches(route = '') {
    const routeSegments = this.getSegments(route)
    if (this.parsedSegments.length !== routeSegments.length) return false
    // whine whine functional programming blah blah....
    // This needs to be fast
    for (let i = 0; i < this.parsedSegments.length; i++) {
      const originalSegment = this.parsedSegments[i]
      const segment = routeSegments[i]
      if (!originalSegment.isDymanic && originalSegment.value !== segment.toLowerCase()) {
        return false
      }
    }
    return true
  }
  toParsedRoute(route = '') {
    if (!this.matches(route)) throw new Error('Route does not match')
    const routeSegments = this.getSegments(route)
    const {parsedSegments, routeDefinition} = this
    return new ParsedRoute({routeSegments, parsedSegments, routeDefinition, route})
  }
  getSegments(route = '') {
    return route.charAt(0) === '/' ? route.slice(1).split('/') : route.split('/')
  }

}

class ParsedRoute {
  constructor({parsedSegments, routeSegments, routeDefinition, route}) {
    this._originalRoute = route
    this._definition = routeDefinition
    this._segmentArray = [...routeSegments]
    this._segmentIndex = 0
    this._routeObject = {}
    this._parseSegments({parsedSegments, routeSegments, routeDefinition, route})
    this._indexSegments({parsedSegments, routeSegments})
  }
  segment() {
    return this._segmentArray[this._segmentIndex]
  }
  next() {
    this._segmentIndex = Math.min(this._segmentIndex + 1, this._segmentArray.length)
    return this
  }
  prev() {
    this._segmentIndex = Math.max(this._segmentIndex - 1, 0)
    return this
  }
  beginning() {
    this._segmentIndex = 0
    return this
  }
  end() {
    this._segmentIndex = this._segmentArray.length - 1
    return this
  }
  toObj() {
    return Object.assign({}, this._segmentDict)
  }
  valByDefinition(def) {
    return this._segmentDict[def]
  }
  objectify() {
    return Object.assign({}, this._routeObject)
  }

  _parseSegments({parsedSegments, routeSegments}) {
    const routeObject = this._routeObject
    let last = routeObject
    for (let i = 0; i < parsedSegments.length; i++) {
      const segment = parsedSegments[i]
      const segmentValue = routeSegments[i]

      if (segment.isDymanic) {
        last[segment.value] = function() {
          return segmentValue
        }
      } else {
        last[segment.value] = {segmentValue}
      }
      last = last[segment.value]
    }
    this._segmentIndex = 0
  }
  _indexSegments({parsedSegments, routeSegments}) {
    this._segmentDict = parsedSegments
      .reduce((collector, seg, index) => {
        collector[seg.value] = routeSegments[index]
        return collector
      }, {})
  }

}

export default Router
export {Route, ParsedRoute}
