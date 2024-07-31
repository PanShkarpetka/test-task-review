import { ISpinParams } from '../../../types'
import {isFinalizerEnabled} from '../helpers';
import {FINALIZER_ENABLED_CONTEXTS} from '../../../common/constants';

/**
 * Checks if the finalizer should be enabled based on the provided settings and agentDI.
 * If the finalizer is enabled, it injects the agentDI into the params object.
 *
 * @param {ISpinParams} params - The parameters for the finalizer.
 */
function check(params: ISpinParams): void {
  const { settings: {finalizer: {finalizerBase: { conditions}}}, agentDI } = params
  if (isFinalizerEnabled(params, conditions)) {
    agentDI.injector.inject(params,{ contexts: FINALIZER_ENABLED_CONTEXTS })
  }
}

/** @type {FinalizerInterface} */
export default { check }
