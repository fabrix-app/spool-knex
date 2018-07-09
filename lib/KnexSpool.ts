import * as knex from 'knex'
import { DatastoreSpool } from '@fabrix/fabrix/dist/common/spools/datastore'
import { pickBy, mapValues, map } from 'lodash'

import * as config from './config/index'
import * as pkg from '../package.json'
import * as api from './api/index'
/**
 * Knex integration for Fabrix. Allows knex to read its configration from the
 * fabrix datastore config, and auto-migrate on startup.
 */

export class KnexSpool extends DatastoreSpool {
  public stores
  constructor(app) {
    super(app, {
      config: config,
      pkg: pkg,
      api: api
    })
  }

  /**
   * Ensure that this spool supports the configured migration
   */
  validate () {
    /*
    if (!includes([ 'none', 'drop', 'create' ], this.app.config.database.models.migrate)) {
      throw new Error('Migrate must be configured to either "create" or "drop"')
    }
    */
  }

  configure () {
    this.app.config.set('stores.orm', 'knex')
  }

  /**
   * Initialize knex connections, and perform migrations.
   */
  async initialize () {
    super.initialize()

    this.stores = Object.entries(this.app.config.get('stores')).map((store: any, storeName: any) => {
      return {
        knex: knex(Object.assign({ }, store)),
        models: pickBy(this.app.models, { store: storeName, orm: 'knex' }),
        migrate: store.migrate
      }
    })
    console.log('BROKE', this.stores)
    return this.migrate()
  }

  /**
   * Close all database connections
   */
  async unload () {
    return Promise.all(
      map(this.stores, store => store.knex.destroy())
    )
  }

  /**
   * Migrate schema according to the database configuration
   */
  migrate () {
    const SchemaMigrationService = this.app.services.SchemaMigrationService

    return Promise.all(
     map(this.stores, (store, storeName) => {
        if (store.migrate === 'drop') {
          return SchemaMigrationService.drop(store.knex, this.app.models)
            .then(result => SchemaMigrationService.create(store.knex, this.app.models))
        }
        else {
          if (SchemaMigrationService.hasOwnProperty(store.migrate)) {
            return SchemaMigrationService[store.migrate](store.knex, this.app.models)
          }
          else {
            this.app.log.error(`${store.migrate} does not exist on SchemaMigrationService`)
          }
        }
      })
    )
  }
}

