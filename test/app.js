const _ = require('lodash')
const smokesignals = require('smokesignals')
const Model = require('@fabrix/fabrix/dist/common').FabrixModel

module.exports = _.defaultsDeep({
  pkg: {
    name: 'knex-spool-test'
  },
  api: {
    models: {
      User: class User extends Model {
        static config (app, datastore) {
          return {
            store: 'teststore'
          }
        }
        static schema (app, datastore) {
          datastore.increments('id').primary()
          datastore.string('username')
        }
      },
      Role: class Role extends Model {
        static config (app, datastore) {
          return {
            store: 'teststore'
          }
        }
        static schema (app, datastore) {
          datastore.increments('id').primary()
          datastore.string('username')
        }
      }
    }
  },
  config: {
    log: {
      logger: new smokesignals.Logger('error')
    },
    main: {
      spools: [
        require('../dist').KnexSpool // spool-knex
      ]
    },
    stores: {
      teststore: {
        orm: 'knex',
        migrate: 'drop',
        client: 'sqlite3',
        connection: {
          filename: './testdb.sqlite'
        }
      }
    },
    models: {
      defaultStore: 'teststore',
      migrate: 'drop'
    }
  }
}, smokesignals.FailsafeConfig)


