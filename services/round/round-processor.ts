import { injectable } from 'tsyringe'
import { RoundInjector } from './round-injector'
import { RoundState } from './round-state'
import {RoundProcessorResult} from '../../types';

/**
 * The RoundProcessor class is responsible for processing a round.
 * It takes the round state and the round injector as dependencies.
 * It provides methods to process a round and get the round result.
 */
@injectable()
export class RoundProcessor {
  constructor(
    private injector: RoundInjector,
    private roundState: RoundState,
  ) {}

  /**
   * Processes a round.
   * @returns void
   */
  public processRound (): void {
    this.roundState.params.agentDI.worker.run(this.roundState.params)
  }

  /**
   * Gets the round result.
   * @returns The round processor result.
   */
  public getRoundResult(): RoundProcessorResult {
    return {
      contexts: this.roundState.params.contexts,
    }
  }
}
