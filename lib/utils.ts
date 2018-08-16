import { FabrixApp } from '@fabrix/fabrix'
import { pickBy } from 'lodash'

export const Utils = {
  /**
   * Pick only models stores from app config that will use this orm
   */
  pickModels (app: FabrixApp, storeName): {[key: string]: any} {
    return pickBy(app.models, (_model, name) => {
      const modelConfig = _model.config
      const store = modelConfig.store || app.config.get('models.defaultStore')
      return storeName === store
    })
  },
}
