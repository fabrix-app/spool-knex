import knex from 'knex'
import { DatastoreSpool } from '@fabrix/fabrix/dist/common/spools/datastore'
import { pickBy, mapValues, map } from 'lodash'
import { Utils } from './utils'

import * as config from './config/index'
import * as pkg from '../package.json'
import * as api from './api/index'
/**
 * Knex integration for Fabrix. Allows knex to read its configration from the
 * fabrix datastore config, and auto-migrate on startup.
 */

export class KnexSpool extends DatastoreSpool {
  public stores = new Map()
  private _models: {[key: string]: any} = { }

  constructor(app) {
    super(app, {
      config: config,
      pkg: pkg,
      api: api
    })
  }

  get models() {
    return this._models || {}
  }

  /**
   * Ensure that this spool supports the configured migration
   */
  // async validate () {
  //   /*
  //   if (!includes([ 'none', 'drop', 'create' ], this.app.config.database.models.migrate)) {
  //     throw new Error('Migrate must be configured to either "create" or "drop"')
  //   }
  //   */
  // }

  configure () {
    this.app.config.set('stores.orm', 'knex')
  }

  /**
   * Initialize knex connections, and perform migrations.
   */
  async initialize () {
    super.initialize()

    const knexStores = Object.entries(this.app.config.get('stores'))
      .filter(([name, store]: [string, {[key: string]: any}]) => {
        return store.orm === 'knex'
      })

    knexStores
      .forEach(([storeName, store]: [string, any]) => {
        this._models = Object.assign({}, this._models, Utils.pickModels(this.app, storeName))
        this.stores.set(storeName, {
          knex: knex(Object.assign({ }, store)),
          models: Utils.pickModels(this.app, storeName),
          migrate: store.migrate || this.app.config.get('models.migrate')
        })
      })

    return this.migrate()
  }

  /**
   * Close all database connections
   */
  async unload () {
    return Promise.all(
      Array.from(this.stores).map(([name, store]) => {
        return store.knex.destroy()
      })
    )
  }

  /**
   * Migrate schema according to the database configuration
   */
  migrate () {
    const SchemaMigrationService = this.app.services.SchemaMigrationService

    return Promise.all(
      Array.from(this.stores).map(([name, store]) => {
        if (store.migrate === 'drop') {
          return SchemaMigrationService.drop(store.knex, store.models)
            .then(result => SchemaMigrationService.create(store.knex, store.models))
        }
        else {
          if (SchemaMigrationService.hasOwnProperty(store.migrate)) {
            return SchemaMigrationService[store.migrate](store.knex, store.models)
          }
          else {
            this.app.log.error(`${store.migrate} does not exist on SchemaMigrationService`)
          }
        }
      })
    )
  }
}

