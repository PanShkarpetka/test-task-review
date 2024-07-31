import { ISpinParams } from '../../../types'
import {isFinalizerEnabled} from "../helpers";

/**
 * Checks if the finalizer is enabled based on the given conditions.
 * If enabled, updates the collectible stat and adds a feature to the agent's featurer.
 *
 * @param {ISpinParams} params - The parameters for the finalizer.
 * @param {string} type - The type of finalizer.
 */
function check(params: ISpinParams, type): void {
  const { settings: {finalizer}, agentDI } = params

  if (!finalizer[type]) {
    return
  }

  const {conditions, step, name} = finalizer[type]

  if (isFinalizerEnabled(params, conditions)) {
    agentDI.stats.get().updateCollectible(step)
    agentDI.featurer.add({
      type: agentDI.glossary.finalizerTypes.COLLECTIBLE,
      name: name,
      value: agentDI.stats.getValuesByMode()[agentDI.glossary.finalizerTypes.COLLECTIBLE],
    })
  }
}

/** @type {FinalizerInterface} */
export default { check }
