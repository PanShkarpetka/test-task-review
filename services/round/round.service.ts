import { container } from 'tsyringe'
import { RoundParamsDto } from '../../common/dto/round-params.dto'
import { RoundProcessor } from './round-processor'
import { RoundState } from './round-state'

/**
 * Service for executing a round.
 */
export class RoundService {
  /**
   * Executes a round with the given parameters.
   * @param params - The parameters for the round.
   * @returns The result of the round.
   */
  executeRound(params: RoundParamsDto) {
    const roundProcessor = container.createChildContainer()
      .register(RoundState, { useValue: new RoundState(params) })
      .resolve(RoundProcessor)

    roundProcessor.processRound()

    return roundProcessor.getRoundResult()
  }
}
