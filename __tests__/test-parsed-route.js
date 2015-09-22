import {expect} from 'chai'
import sinon from 'sinon'
import Router from '../src/router'
describe('Router', () => {
  let router, route
  beforeEach((done) => {
    router = new Router({
      routes: [
        '/test/:id/search/:query'
      ]
    })
    router.on('change', (r) => {
      route = r
      route.updateLocation = router.routeChanged.bind(router)
      router.off('change')
      done()

    })
    router.routeChanged('/test/5/search/test')
  })
  it('should be able to update pieces', (done) => {
    router.on('change', (r) => {
      const newId = r.valByDefinition(':id')
      expect(newId).to.equal('7')
      done()
    })
    route.update({
      ':id': 7
    })
  })
})
