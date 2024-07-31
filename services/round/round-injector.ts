import { Lifecycle, scoped } from 'tsyringe'
import {
  InjectionToPatternItem,
  InjectionToRoundState,
  ISpinParams,
  ModulesInjectiveFunctions,
  RoundStateUpdates
} from '../../types'
import { RoundState } from './round-state'
import {INJECTION_TYPES, PROPERTY_SEPARATOR} from '../../common/constants';

/**
 * The RoundInjector class is responsible for managing and executing injections for a round.
 * It allows for the injection of parameters, updates, and functions for specific modes and win patterns.
 * It also provides methods for resetting the injections, executing the injections, and getting the injection history.
 */
@scoped(Lifecycle.ResolutionScoped)
export class RoundInjector {
  public injectableFunctions: Record<string, Record<string, Function>> = {}

  private allModes: Record<string, any> = {}
  private nextMode: Record<string, any> = {}
  private [INJECTION_TYPES.TO_DELETE]: string[] = []
  private [INJECTION_TYPES.TO_PATTERN]: InjectionToPatternItem[] = []
  private [INJECTION_TYPES.TO_ROUND_STATE]: InjectionToRoundState = {
    roundState: {},
    updates: {},
  }
  private injectionHistory: any[] = []

  constructor(private roundState: RoundState) {
    this.roundState.registerDependenciesInAgent({ injector: this })
    this[INJECTION_TYPES.TO_ROUND_STATE].roundState = this.roundState.params.args.state
  }

  /**
   * Get the injections for a specific win pattern
   * @param pattern The win pattern to get injections for
   * @returns The injections for the pattern
   */
  public getWinPatternInjections = (pattern: string) => {
    const injections: Partial<ISpinParams> = {}
    const patternInjections = this[INJECTION_TYPES.TO_PATTERN].filter(({ to }: InjectionToPatternItem) => pattern === to)

    if (!patternInjections.length) {
      return injections;
    }

    patternInjections.forEach(item => {
      this.injectionHistory.push(item)
      this.inject(injections, item.params)
    })

    this[INJECTION_TYPES.TO_PATTERN] = this[INJECTION_TYPES.TO_PATTERN]
        .filter(({ to }: InjectionToPatternItem) => pattern !== to)

    return injections
  }

  /**
   * Deletes specified properties from the given object.
   * @param spinParams - The object from which to delete properties.
   * @param properties - An array of property names to delete.
   * @returns void
   */
  private deleteProperties(spinParams: ISpinParams, properties: string[]) {
    properties.forEach(property => {
      if (property.includes(PROPERTY_SEPARATOR)) {
        const [parent, child] = property.split(PROPERTY_SEPARATOR);

        delete spinParams[parent][child];
      } else {
        delete spinParams[property];
      }
    });
  }

  /**
   * Resets the injections.
   * @returns {void}
   */
  private resetInjections() {
    this.nextMode = {};
    this.toDelete = [];
  }

  /**
   * Execute the injections and return the result
   * @param spinParams The spin parameters
   * @param updates The updates to apply to the parameters
   * @returns The result of the injections
   */
  public executeInjections = (spinParams: ISpinParams, updates: RoundStateUpdates) => {
    this.deleteProperties(spinParams, this[INJECTION_TYPES.TO_DELETE])
    this.inject(spinParams, updates)

    const result = { ...spinParams, ...this.allModes, ...this.nextMode }

    this.resetInjections()

    return result
  }

  /**
   * Execute the injections for the round state and return the result
   * @returns The result of the injections for the round state
   */
  public executeInjectionsToRoundState = () => {
    const result = {}

    this.inject(result, this[INJECTION_TYPES.TO_ROUND_STATE].updates)
    this[INJECTION_TYPES.TO_ROUND_STATE].updates = {}

    return result
  }

  /**
   * Add injections to the round state
   * @param updates The updates to add to the round state
   */
  public addInjectionsToRoundState = (updates: RoundStateUpdates) => {
    Object.assign(this[INJECTION_TYPES.TO_ROUND_STATE].updates, updates)
  }

  /**
   * Inject new parameters to the nextMode mode
   * @param newParams New parameters to inject
   */
  public injectToNextMode = (newParams: Record<string, any>) => {
    Object.assign(this.nextMode, newParams)
  }

  /**
   * Inject new parameters to allModes modes
   * @param newParams New parameters to inject
   */
  public injectToAllModes = (newParams: Record<string, any>) => {
    Object.assign(this.allModes, newParams)
  }

  /**
   * Inject the updates to the current mode
   * @param params The spin parameters
   * @param updates The updates to apply to the parameters
   */
  public injectToCurrentMode = (params: ISpinParams, updates: RoundStateUpdates) => {
    this.inject(params, updates, true)
  }

  /**
   * Delete a property from the spin parameters
   * @param prop The property to delete
   */
  public deleteFromParams = (prop: string) => {
    this[INJECTION_TYPES.TO_DELETE].push(prop)
  }

  /**
   * Delete a child property from the spin parameters
   * @param prop The parent property
   * @param child The child property to delete
   */
  public deleteFromParamsChildProperty = (prop: string, child: string) => {
    this[INJECTION_TYPES.TO_DELETE].push(`${prop}${PROPERTY_SEPARATOR}${child}`)
  }

  /**
   * Add injective functions for a module after module reset
   * @param module The module to add functions for
   * @param functionsToAdd The functions to add
   */
  public addInjectiveFunctionsToModule = (
    module: string,
    functionsToAdd: ModulesInjectiveFunctions,
  ) => {
    this.injectableFunctions[module] = {}

    functionsToAdd.forEach(functionToAdd => {
      this.injectableFunctions[module][functionToAdd.name] = functionToAdd;
    });
  }

  /**
   * Add an injection to the win pattern
   * @param item The injection to add
   */
  public injectToWinPattern = (item: InjectionToPatternItem) => {
    this[INJECTION_TYPES.TO_PATTERN].push(item)
  }

  /**
   * Add an injection to the win pattern
   * @param item The injection to add
   */
  public addInjectionToWinPattern = (item: InjectionToPatternItem) => {
    this.injectToWinPattern(item)
  }

  /**
   * Get the injectionHistory of injections
   * @returns The injectionHistory of injections
   */
  public getHistory = () => {
    return this.injectionHistory
  }

  /**
   * Inject the updates to the current mode
   * @param spinParams The spin parameters
   * @param updates The updates to apply to the parameters
   * @param replaceArrays Whether to replace arrays or push to them
   */
  private inject(spinParams: ISpinParams, updates: RoundStateUpdates, replaceArrays = false) {
    if (!updates) {
      return
    }
    if (replaceArrays) {
      Object.keys(updates).forEach(updateKey => {
        if (updateKey in spinParams && Array.isArray(spinParams[updateKey])) {
          spinParams[updateKey].push(...updates[updateKey])

          delete updates[updateKey]
        }
      })
    }

    Object.assign(spinParams, updates)
    this.injectionHistory.push(updates)
  }
}
