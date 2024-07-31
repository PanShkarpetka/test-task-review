import conditions from './conditions'

export function isFinalizerEnabled(params, configConditions): boolean {
  for (const conditionType of configConditions) {
    if (!conditions?.[conditionType](params)) {
      return false;
    }
  }
  return true;
}
