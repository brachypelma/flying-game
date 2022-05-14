<template>
  <div class="start-button">
    <input
      id="play"
      type="checkbox"
      class="start-button__input hidden"
      :checked="isPlaying"
      v-on:change="toggleGameStart"
    />
    <label for="play" class="start-button__label">Play</label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import {
  BooleanMutationPayload,
  NumberArrayMutationPayload,
  NumberParamMutationPayload,
} from '../store/interfaces';
import store from '../store';

export default defineComponent({
  name: 'StartButton',
  computed: {
    ...mapGetters([
      'arrayParams',
      'booleanParams',
      'numberParams',
    ]),
    isPlaying(): boolean {
      return store.state.booleanParams.playing;
    },
  },
  methods: {
    addColumn() {
      const arr: Array<number> = this.arrayParams.nextSegment[0];
      const payload: NumberArrayMutationPayload = {
        prop: 'range',
        type: typeof arr,
        arr,
      };
      store.dispatch('changeStoreParam', payload);
      store.commit('removeNextSegEl');
    },
    addCoin() {
      const { arrayParams: { range } } = this;
      const lastRange: Array<number> = range[range.length - 1];
      const max: number = lastRange[0] - 10;
      const min: number = lastRange[1];

      this.setNumber('coinX', ((range.length - 1) / 2));
      this.setNumber('coinY', this.getRandomIntInRange(min, max));
      this.setBool('coinOnBoard', true);
    },
    addCoinScore() {
      this.removeCoin();
      this.setNumber('score', 1000);
      this.setNumber('coinsGot', 1);
      this.setBool('coinOnBoard', false);
    },
    addSegment() {
      const currRange: Array<Array<number>> = this.arrayParams.range;
      const segment = this.getRangeSegment(currRange);

      segment.forEach((arr: Array<number>) => {
        this.setArr('nextSegment', arr);
      });

      this.addColumn();
    },
    changePosition() {
      const {
        arrayParams: { nextSegment },
        booleanParams: { coinOnBoard, falling },
        numberParams: { level },
      } = this;
      const changeNumber: number = this.getChangeNumber(level);
      const changeRate: number = falling ? -1 : 1;

      this.setNumber('position', (changeNumber * changeRate));
      this.setLevel();
      this.checkSpeed(level);
      this.checkGameEnd();

      if (nextSegment.length) {
        this.addColumn();
      } else {
        this.addSegment();
      }

      if (coinOnBoard) {
        this.moveCoin();
        this.checkCoin();
      } else {
        this.addCoin();
      }
    },
    checkCoin() {
      const { numberParams: { coinX, coinY, position } } = this;
      const posRound = Math.round(position);
      const xMatch = (coinX > 3) && (coinX < 10);
      const yMatch = ((posRound > coinY - 5) && (posRound < coinY + 5));

      if (xMatch && yMatch) {
        this.addCoinScore();
      } else if (coinX < -10) {
        this.removeCoin();
      }
    },
    checkGameEnd() {
      const currentRange: Array<number> = this.getCurrentRange();

      if (
        this.numberParams.position >= (currentRange[0] - 5)
        || this.numberParams.position <= currentRange[1]
      ) {
        this.endGame();
      }
    },
    checkSpeed(level: number) {
      if (level < 6) {
        return;
      }

      const speed = this.getLargerNumber((16 - level), 5);

      this.clearPositionChangeInterval(this.numberParams.int);
      this.setNumber('int', this.setPositionChangeInterval(speed));
    },
    clearNextSegmentArray() {
      while (this.arrayParams.nextSegment.length) {
        store.commit('removeNextSegEl');
      }
    },
    clearPositionChangeInterval(int: number) {
      clearInterval(int);
      this.zeroNumVals(['int']);
    },
    endGame() {
      this.setBools(['coinOnBoard', 'playing'], false);
      this.resetScores();
      this.initRange();
    },
    getChangeNumber(level: number): number {
      let num = 0.5;

      if (level === 7) {
        num = 0.517;
      } else if (level === 8) {
        num = 0.534;
      } else if (level > 8) {
        num = 0.55;
      }

      return num;
    },
    getCurrentRange(): Array<number> {
      return this.arrayParams.range[19];
    },
    getLargerNumber(a: number, b: number): number {
      return a >= b ? a : b;
    },
    getRandomIntInRange(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min) + min);
    },
    getRangeSegment(currRange: Array<Array<number>>): Array<Array<number>> {
      const { numberParams: { level } } = this;
      const gapHeight: number = this.getVertexDiff(level);
      const vertex: number = this.getVertex(gapHeight);
      const lastTop: number = currRange[(currRange.length - 1)][0];
      const slope: number = (vertex - lastTop) / 50;
      const newArr: Array<Array<number>> = [];

      for (let i = 0; i < 50; i += 1) {
        const top: number = lastTop + (i * slope);
        const bottom: number = top - gapHeight;
        const arr: Array<number> = [top, bottom];

        newArr.push(arr);
      }

      return newArr;
    },
    getVertex(diff: number): number {
      return this.getRandomIntInRange(diff, 95);
    },
    getVertexDiff(level: number): number {
      return this.getLargerNumber((65 - ((level - 1) * 5)), 40);
    },
    initRange() {
      const startRange: Array<Array<number>> = this.arrayParams.range;
      let segment: Array<Array<number>> = [];

      while (segment.length < 200) {
        segment = [...segment, ...this.getRangeSegment(startRange)];
        segment.forEach((arr: Array<number>) => {
          const payload: NumberArrayMutationPayload = {
            prop: 'range',
            type: typeof arr,
            arr,
          };
          store.dispatch('changeStoreParam', payload);
        });
      }

      this.clearNextSegmentArray();
    },
    moveCoin() {
      this.setNumber('coinX', -0.5);
    },
    removeCoin() {
      this.zeroNumVals(['coinX', 'coinY']);
      this.setNumber('coinsAdded', 1);
      this.setBool('coinOnBoard', false);
    },
    resetScores() {
      const valsToSave: Array<string> = [
        'coinsAdded', 'coinsGot', 'level', 'score',
      ];
      const otherVals: Array<string> = ['coinX', 'coinY', 'time'];

      this.saveScores(valsToSave);
      this.zeroNumVals([...valsToSave, ...otherVals]);
      this.setNumber('level', 1);
    },
    saveScores(vals: Array<string>) {
      const { numberParams } = this;
      const valPrevs: Array<string> = vals.map((val: string) => `${val}Prev`);

      this.zeroNumVals(valPrevs);

      vals.forEach((val: string) => {
        this.setNumber(`${val}Prev`, numberParams[val]);
      });
    },
    setArr(prop: string, arr: Array<number>) {
      const payload: NumberArrayMutationPayload = {
        prop,
        type: typeof arr,
        arr,
      };
      store.dispatch('changeStoreParam', payload);
    },
    setBool(prop: string, bool: boolean) {
      const payload: BooleanMutationPayload = {
        prop,
        type: typeof bool,
        bool,
      };
      store.dispatch('changeStoreParam', payload);
    },
    setBools(props: Array<string>, bool: boolean) {
      props.forEach((prop) => {
        this.setBool(prop, bool);
      });
    },
    setLevel() {
      const { numberParams: { time } } = this;
      const levelInc: number = ((time > 0) && (time % 2000 === 0)) ? 1 : 0;

      this.setNumber('level', levelInc);
    },
    setNumber(prop: string, num: number) {
      const payload: NumberParamMutationPayload = {
        prop,
        type: typeof num,
        num,
      };
      store.dispatch('changeStoreParam', payload);
    },
    setPositionChangeInterval(interval = 10): number {
      return setInterval(() => {
        const {
          booleanParams: { playing },
          numberParams: { position },
        } = this;

        if (playing) {
          this.changePosition();
          this.setNumber('time', 1);
          this.setNumber('score', 1);
        } else if (position !== 47.5) {
          this.setNumber('position', (47.5 - position));
        }
      }, interval);
    },
    startGame() {
      this.setBool('playing', true);
      this.clearPositionChangeInterval(this.numberParams.int);
      this.setNumber('int', this.setPositionChangeInterval());
    },
    toggleGameStart() {
      if (this.booleanParams.playing) {
        this.endGame();
      } else {
        this.startGame();
      }
    },
    zeroNumVals(vals: Array<string>) {
      vals.forEach((val) => {
        this.setNumber(val, (this.numberParams[val]) * -1);
      });
    },
  },
  mounted: function initStartButton() {
    this.initRange();
  },
});
</script>
