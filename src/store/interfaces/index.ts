interface BaseMutationPayload {
  prop: string,
  type: string,
}

export interface BooleanMutationPayload extends BaseMutationPayload {
  bool: boolean,
}

export interface NumberArrayMutationPayload extends BaseMutationPayload {
  arr: Array<number>,
}

export interface NumberParamMutationPayload extends BaseMutationPayload {
  num: number,
}

export interface StoreActionPayload extends BooleanMutationPayload, NumberArrayMutationPayload, NumberParamMutationPayload {}

export interface StoreArrayParams {
  nextSegment: Array<Array<number>>,
  range: Array<Array<number>>,
}

export interface StoreBooleanParams {
  coinOnBoard: boolean,
  falling: boolean,
  playing: boolean,
}

export interface StoreNumberParams {
  coinsAdded: number,
  coinsGot: number,
  coinX: number,
  coinY: number,
  level: number,
  score: number,
  coinsAddedPrev: number,
  coinsGotPrev: number,
  coinXPrev: number,
  coinYPrev: number,
  levelPrev: number,
  scorePrev: number,
  int: number,
  position: number,
  time: number,
  vertex: number,
}
