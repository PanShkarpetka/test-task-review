import { ISpinParams } from '../../../types'
import {isFinalizerEnabled} from "../helpers";

/**
* Checks if the finalizer is enabled and executes the finalizer function if so.
    *
    * @param {ISpinParams} params - The parameters for the finalizer.
*/
function check(params: ISpinParams): void {
  const { settings: {finalizer}, agentDI } = params
  const { [agentDI.glossary.finalizerTypes.FUNCTION]: config } = finalizer

  if (isFinalizerEnabled(params, config.conditions)) {
    config.fn(params)
  }
}

/** @type {FinalizerInterface} */
export default { check }
