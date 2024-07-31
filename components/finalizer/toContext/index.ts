import { ISpinParams } from '../../../types'
import {isFinalizerEnabled} from "../helpers";

/**
 * The check function takes an object of type ISpinParams as a parameter and returns any.
 * It checks if the finalizer is enabled based on the conditions specified in the finalizer config.
 * If the finalizer is enabled, it returns the 'toContext' property of the finalizer config.
 * @param {ISpinParams} params - The parameters for the check function.
 * @returns {any} - The value of the 'toContext' property of the finalizer config if the finalizer is enabled, otherwise undefined.
 */
function check(params: ISpinParams): any {
  const { settings: {finalizer}, agentDI } = params
  const { [agentDI.glossary.finalizerTypes.CONTEXT]: config } = finalizer

  if (isFinalizerEnabled(params, config.conditions)) {
    return config.toContext
  }
}

/** @type {FinalizerInterface} */
export default { check }
