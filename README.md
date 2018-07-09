# spool-knex

[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Build Status][ci-image]][ci-url]
[![Test Coverage][coverage-image]][coverage-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Follow @FabrixApp on Twitter][twitter-image]][twitter-url]

Provides support for database queries and schema migrations via [knex.js](http://knexjs.org/).

## Install

```sh
$ npm install --save @fabrix/spool-knex
```

## Configure

#### `main.ts`

```js
// config/main.ts
export const main = {
  spools: [
    // ... other spools
    require('@fabrix/spool-knex').KnexSpool
  ]
}
```

#### `database.ts`

```js
// config/stores.ts
export const stores = {
  knexPostgres: {
    client: 'pg',

    /**
     * knex connection object
     * see: http://knexjs.org/#Installation-client
     */
    connection: {
      host: 'localhost',
      user: 'admin',
      password: '1234',
      database: 'mydb'
    }
  }
}
// config/models.ts
export const models = {
  /**
   * Supported Migrate Settings:
   * - drop
   * - create
   */
  migrate: 'create',
  defaultStore: 'knexPostgres'
}
```

## Usage

### Models

```js
// api/models/User.ts
class User extends Model {
  static schema (app, table) {
    table.increments('id').primary()
    table.string('username')
    table.string('firstName')
    table.string('lastName')
  }
}

// api/models/Role.ts
class Role extends Model {
  static schema (app, table) {
    table.increments('id').primary()
    table.string('name')
    table.integer('user_id').references('user.id')
  }
}
```

### Services

#### `SchemaMigrationService`

##### `create`
Create the schema using knex

##### `drop`
Drop the schema using knex

##### `alter`
Not currently supported.

## Contributing
We love contributions! Please check out our [Contributor's Guide](https://github.com/fabrix-app/fabrix/blob/master/.github/CONTRIBUTING.md) for more
information on how our projects are organized and how to get started.

## License
[MIT](https://github.com/fabrix-app/fabrix/blob/master/LICENSE)

[npm-image]: https://img.shields.io/npm/v/@fabrix/spool-knex.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@fabrix/spool-knex
[ci-image]: https://img.shields.io/circleci/project/github/fabrix-app/spool-knex/master.svg
[ci-url]: https://circleci.com/gh/fabrix-app/spool-knex/tree/master
[daviddm-image]: http://img.shields.io/david/fabrix-app/spool-knex.svg?style=flat-square
[daviddm-url]: https://david-dm.org/fabrix-app/spool-knex
[gitter-image]: http://img.shields.io/badge/+%20GITTER-JOIN%20CHAT%20%E2%86%92-1DCE73.svg?style=flat-square
[gitter-url]: https://gitter.im/fabrix-app/fabrix
[twitter-image]: https://img.shields.io/twitter/follow/FabrixApp.svg?style=social
[twitter-url]: https://twitter.com/FabrixApp
[coverage-image]: https://img.shields.io/codeclimate/coverage/github/fabrix-app/spool-knex.svg?style=flat-square
[coverage-url]: https://codeclimate.com/github/fabrix-app/spool-knex/coverage


