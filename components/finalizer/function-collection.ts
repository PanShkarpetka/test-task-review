import base from './base'
import collectible from './collectible'
import functionType from './function'
import toContext from './toContext'
import {TYPES} from '../../common/constants';

export default {
  [TYPES.COLLECTIBLE]: collectible,
  [TYPES.COLLECTIBLE2]: collectible,
  [TYPES.BASE]: base,
  [TYPES.FUNCTION]: functionType,
  [TYPES.CONTEXT]: toContext,
}
