import Router from '../src/router'
import {expect} from 'chai'

describe('rendering', () => {
  it('should do something', () => {
    expect(Router).to.exist
    expect(new Router()).to.exist
  })
});
