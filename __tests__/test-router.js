import {expect} from 'chai'
import sinon from 'sinon'
import Router from '../src/router'
describe('Router', () => {
  let router
  beforeEach(() => {
    router = new Router({
      routes: [
        '/test/:id'
      ]
    })
  })
  it('should call back a change when a change happens that matches a route', () => {
    const spy = sinon.spy()
    router.on('change', spy)
    router.routeChanged('/test/5')
    router.routeChanged('/tes/5')
    expect(spy.calledOnce).to.be.true
  })
  it('should call all the on change listeners', () => {
    const spy = sinon.spy()
    router.on('change', spy)
    const spy2 = sinon.spy()
    router.on('change', spy2)
    router.routeChanged('/test/5')
    expect(spy.calledOnce).to.be.true
    expect(spy2.calledOnce).to.be.true
  })
})
