import "reflect-metadata"

import { RoundService } from './services/round/round.service'
import { RoundParamsDto } from './common/dto/round-params.dto'

const roundService = new RoundService()
const roundParams = new RoundParamsDto({})
const result = roundService.executeRound(roundParams)

console.log(result)

