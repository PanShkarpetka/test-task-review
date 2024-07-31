import { ISpinParams } from '../../types'

/**
 * Checks if the current value is less than the maximum value for the collectible.
 * @param {ISpinParams} params - The spin parameters.
 * @returns {boolean} - True if the current value is less than the maximum value, false otherwise.
 */
function lessThanMaxValue(params: ISpinParams): boolean {
  const { settings, agentDI } = params
  const { [agentDI.glossary.finalizerTypes.COLLECTIBLE]: config } = settings.finalizer
  const { [agentDI.glossary.finalizerTypes.COLLECTIBLE]: currentValue } = agentDI.stats.getValuesByMode()

  return currentValue < config.max
}

/**
 * Checks if the previous win is smaller than the current win.
 * @param {ISpinParams} params - The spin parameters.
 * @returns {boolean} - True if the previous win is smaller than the current win, false otherwise.
 */
function previousWinSmaller(params: ISpinParams): boolean {
  const { agentDI, win } = params
  const { prevWin } = agentDI.stats.getValuesByMode()

  return win?.total ? win.total > prevWin : false
}

/**
 * Checks if it is not the first spin.
 * @param {ISpinParams} params - The spin parameters.
 * @returns {boolean} - True if it is not the first spin, false otherwise.
 */
function isNotFirstSpin(params: ISpinParams): boolean {
  const { agentDI } = params
  const { total, rest } = agentDI.stats.getValuesByMode()

  return total - 1 !== rest
}

/**
 * Checks if there is a win.
 * @param {ISpinParams} params - The spin parameters.
 * @returns {boolean} - True if there is a win, false otherwise.
 */
function hasWin(params: ISpinParams): boolean {
  const { win } = params

  return win?.total ? win.total > 0 : false
}

/**
 * Checks if the spin is finished.
 * @param {ISpinParams} params - The spin parameters.
 * @returns {boolean} - True if the spin is finished, false otherwise.
 */
function isFinished(params: ISpinParams): boolean {
  const { features } = params

  return features.finished
}

export default {
  lessThanMaxValue,
  previousWinSmaller,
  isNotFirstSpin,
  hasWin,
  isFinished,
}
