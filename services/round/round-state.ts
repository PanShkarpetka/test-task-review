import { Lifecycle, scoped } from 'tsyringe'
import { RoundParamsDto } from '../../common/dto/round-params.dto'
import { ModeParams } from '../../types'
import finalizer from '../../components/finalizer'
import worker from '../../components/worker'
import config from '../../config'

/**
 * Represents the state of a round.
 */
@scoped(Lifecycle.ResolutionScoped)
export class RoundState {
  public agentDI = {
    finalizer: finalizer,
    worker: worker,
    injector: null,
  }
  public params: Partial<ModeParams>

  constructor(public readonly args: RoundParamsDto) {
    this.params = {
      args,
      settings: config.settings,
      agentDI: this.agentDI,
      mode: config.mode,
    }
  }

  /**
   * Registers dependencies in the agent.
   * @param dependencies - Dependencies to register.
   */
  public registerDependenciesInAgent(dependencies: Record<string, any>): void {
    Object.assign(this.agentDI, dependencies)
  }
}
