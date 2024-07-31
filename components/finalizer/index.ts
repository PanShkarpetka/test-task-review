import {Finalizer, ISpinParams} from '../../types'
import COLLECTION from './function-collection';

/**
 * Finish the spin process and return the finalizer results
 * @param {ISpinParams} spinParams - The parameters for the spin process
 * @returns {Object} - The finalizer results
 */
function finish(spinParams: ISpinParams): { finalizer: Finalizer } {
  const { mode, settings: { finalizer: config } } = spinParams;
  const items = (() => {
    if (config?.items) {
      return config.items
    } else if (config?.itemsByMode && config.itemsByMode?.[mode]) {
      return config.itemsByMode[mode]
    }
    return []
  })()

  return {
    finalizer: items.reduce((acc, item) => {
      acc[item] = COLLECTION[item].check(spinParams, item)
    }, {})
  }
}

export default { finish }
