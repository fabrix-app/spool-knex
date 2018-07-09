const assert = require('assert')

describe('Knex Spool', () => {
  describe('#initialize', () => {
    it('should group stores and models', () => {
      const stores = global.app.spools.knex.stores

      assert(stores.teststore)
      assert(stores.teststore.models)
      assert.equal(stores.teststore.models.user)
      assert.equal(stores.teststore.models.user)
    })
  })
})
