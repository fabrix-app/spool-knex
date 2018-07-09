/**
 * Spool Configuration
 *
 * @see {@link http://fabrix-app.io/doc/spool/config}
 */
export const spool = {
  lifecycle: {
    initialize: {
      listen: [ ],
      emit: [ ]
    }
  },

  poolDefaults: {
    min: 1,
    max: 16
  }
}
