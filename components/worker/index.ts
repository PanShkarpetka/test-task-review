import { ISpinParams } from '../../types'

/**
 * Runs the agent with the given parameters.
 * @param spinParams - The parameters for running the agent.
 */
function run(spinParams: ISpinParams) {
  spinParams.agentDI.injector.inject(spinParams, { win: { total: 100 }})
  spinParams.agentDI.finalizer.finish(spinParams)
}

export default { run }
