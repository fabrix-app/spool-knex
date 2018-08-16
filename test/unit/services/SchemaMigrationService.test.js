/* global describe, it */

const _ = require('lodash')
const assert = require('assert')

describe('SchemaMigrationService', () => {
  it('should exist', () => {
    assert(global.app.api.services['SchemaMigrationService'])
  })
  describe('#create', () => {
    it('should create tables', () => {
      return Promise.all(_.map(global.app.models, model => {

        if (global.app.spools.knex.stores.has([model.store])) {
          const store = global.app.spools.knex.stores.get([model.store])

          console.log('created table?', model.tableName)
          return store.knex.schema.hasTable(model.tableName)
            .then(exists => {
              console.log('table exists?', exists)
              return exists ? Promise.resolve() : Promise.reject()
            })
        }
      }))
    })
  })
})
