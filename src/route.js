import ParsedRoute from './parsed-route'
class Route {
  constructor(routeDefinition = '') {
    const noOp = function() {}
    this.routeDefinition = routeDefinition
    this.parsedSegments = this.getSegments(routeDefinition).map((val) => {
      if (noOp[val] !== undefined) {
        throw new Error(`Cannot add route, ${val} is a reserved word`)
      }
      const isDymanic = val.indexOf(':') === 0
      const id = val
      return {isDymanic, id}
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
      if (!originalSegment.isDymanic && originalSegment.id !== segment.toLowerCase()) {
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

export default Route
