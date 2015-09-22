import Router from '../src/router';
import {expect} from 'chai'
describe('rendering', function() {
  it('should do something', () => {
    expect(Router).to.exist
    expect(new Router()).to.exist
  })
});
