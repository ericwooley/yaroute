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
        /* eslint-disable */
        last[segment.value] = function () {
          return segmentValue
        }
        /* eslint-enable */
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

export default ParsedRoute
