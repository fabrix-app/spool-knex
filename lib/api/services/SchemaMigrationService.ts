import { FabrixService as Service } from '@fabrix/fabrix/dist/common'
import { map } from 'lodash'
/**
 * @module SchemaMigrationService
 * @description Schema Migrations
 */
export class SchemaMigrationService extends Service {

  /**
   * @param knex connection object
   *
   * Drop schema for a store
   */
  drop (knex, models) {
    return knex.transaction(txn => {
      return Promise.all(map(models, model => {
        this.app.log.debug('SchemaMigrationService: performing "drop" migration',
          'for model', model.name)

        return txn.schema.dropTableIfExists(model.tableName)
      }))
    })
  }

  /**
   * @param knex connection object
   *
   * Create schema for models in a store
   */
  create (knex, models) {
    return knex.transaction(txn => {
      return Promise.all(map(models, model => {
        this.app.log.debug('SchemaMigrationService: performing "create" migration',
          'for model', model.name)

        return txn.schema.hasTable(model.tableName)
          .then(exists => {
            if (exists) {
              return
            }

            return txn.schema.createTable(model.tableName, table => {
              return model.constructor.schema(this.app, table)
            })
          })
      }))
    })
  }

  /**
   * Alter an existing schema
   */
  alter (knex, model) {
    throw new Error('spool-knex does not currently support migrate=alter')
  }

  none () {

  }
}

