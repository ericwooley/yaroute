class ParsedRoute {
  constructor({parsedSegments, routeSegments, routeDefinition, route}) {
    routeSegments = routeSegments.map(seg => decodeURIComponent(seg))
    this._originalRoute = route
    this._definition = routeDefinition
    this._segmentArray = [...routeSegments]
    this._segmentIndex = 0
    this._parsedSegments = parsedSegments
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
  getVal(def) {
    return this._segmentDict[def]
  }
  objectify() {
    return Object.assign({}, this._routeObject)
  }
  updateLocation(newRoute = '', pushState = false) {
    newRoute = newRoute.charAt(0) === '#' ? newRoute.substr(1) : newRoute
    console.log(newRoute.split('/'))
    console.log(newRoute.split('/').map(uri => encodeURIComponent(uri)))
    console.log(newRoute.split('/').map(uri => encodeURIComponent(uri)).join('/'))
    newRoute = newRoute.split('/').map(uri => encodeURIComponent(uri)).join('/')
    if(pushState) {
      location.hash = newRoute
    } else {
      history.replaceState(undefined, undefined, newRoute)
    }
  }
  update(newSegVars = {}, pushState = false) {
    const newRouteArr = []
    for (let i = 0; i < this._segmentArray.length; i++) {
      const originalSegment = this._segmentArray[i]
      const segmentInfo = this._parsedSegments[i]
      const replacementValue = newSegVars[segmentInfo.id]
      if(replacementValue) {
        newRouteArr.push(replacementValue)
      } else {
        newRouteArr.push(originalSegment)
      }
    }
    let newRoute = newRouteArr.join('/')
    if(this._originalRoute.charAt(0) === '/') newRoute = '/' + newRoute
    if(this._originalRoute.charAt(this._originalRoute.length - 1) === '/') newRoute += '/'
    this.updateLocation(newRoute, pushState)
  }

  _parseSegments({parsedSegments, routeSegments}) {
    const routeObject = {}
    let last = routeObject
    for (let i = 0; i < parsedSegments.length; i++) {
      const segment = parsedSegments[i]
      const segmentValue = routeSegments[i]

      if (segment.isDymanic) {
        /* eslint-disable */
        last[segment.id] = function () {
          return segmentValue.substr(1)
        }
        /* eslint-enable */
      } else {
        last[segment.id] = {segmentValue}
      }
      last = last[segment.id]
    }
    this._routeObject = routeObject
  }
  _indexSegments({parsedSegments, routeSegments}) {
    this._segmentDict = parsedSegments
      .reduce((collector, seg, index) => {
        collector[seg.id] = routeSegments[index]
        return collector
      }, {})
  }

}

export default ParsedRoute
