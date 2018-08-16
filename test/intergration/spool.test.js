const assert = require('assert')

describe('Knex Spool', () => {
  describe('#initialize', () => {
    it('should group stores and models', () => {
      const stores = global.app.spools.knex.stores
      // console.log('BROKE', stores)
      assert(stores.get('teststore'))
      assert(stores.get('teststore').models)
      assert.equal(stores.get('teststore').models.user)
      assert.equal(stores.get('teststore').models.user)
    })
  })
})
