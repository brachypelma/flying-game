import { createStore } from 'vuex';
import {
  BooleanMutationPayload,
  NumberArrayMutationPayload,
  NumberParamMutationPayload,
  StoreActionPayload,
  StoreArrayParams,
  StoreBooleanParams,
  StoreNumberParams,
} from './interfaces';

export default createStore({
  state: {
    arrayParams: {
      nextSegment: [
        [95, 0],
      ],
      range: [
        [75, 25],
      ],
    },
    booleanParams: {
      coinOnBoard: false,
      falling: true,
      playing: false,
    },
    numberParams: {
      coinsAdded: 0,
      coinsGot: 0,
      coinX: 0,
      coinY: 0,
      level: 1,
      score: 0,
      coinsAddedPrev: 0,
      coinsGotPrev: 0,
      coinXPrev: 0,
      coinYPrev: 0,
      levelPrev: 0,
      scorePrev: 0,
      int: 0,
      position: 47.5,
      time: 0,
      vertex: 95,
    },
  },
  getters: {
    arrayParams(state): StoreArrayParams {
      return state.arrayParams;
    },
    booleanParams(state): StoreBooleanParams {
      return state.booleanParams;
    },
    numberParams(state): StoreNumberParams {
      return state.numberParams;
    },
  },
  mutations: {
    changeArrayParam(
      state,
      { prop, arr }: NumberArrayMutationPayload,
    ) {
      const key = prop as keyof StoreArrayParams;
      const outerArray = state.arrayParams[key];
      const len = outerArray.length;

      if (
        (key === 'range' && len === 200)
        || (key === 'nextSegment' && len === 50)
      ) {
        outerArray.shift();
      }
      outerArray.push(arr);
    },
    changeBooleanParam(
      state,
      { prop, bool }: BooleanMutationPayload,
    ) {
      const key = prop as keyof StoreBooleanParams;
      state.booleanParams[key] = bool;
    },
    changeNumberParam(
      state,
      { prop, num }: NumberParamMutationPayload,
    ) {
      const key = prop as keyof StoreNumberParams;
      state.numberParams[key] += num;
    },
    removeNextSegEl(state) {
      state.arrayParams.nextSegment.shift();
    },
  },
  actions: {
    changeStoreParam(
      { commit },
      {
        prop,
        type,
        arr = [],
        bool = true,
        num = 1,
      }: StoreActionPayload,
    ) {
      if (type === 'object') {
        const payload: NumberArrayMutationPayload = {
          prop,
          type,
          arr,
        };
        commit('changeArrayParam', payload);
      } else if (type === 'boolean') {
        const payload: BooleanMutationPayload = {
          prop,
          type,
          bool,
        };
        commit('changeBooleanParam', payload);
      } else if (type === 'number') {
        const payload: NumberParamMutationPayload = {
          prop,
          type,
          num,
        };
        commit('changeNumberParam', payload);
      }
    },
  },
  modules: {
  },
});
