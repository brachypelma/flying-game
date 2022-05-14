<template>
  <div class="grid">
    <div class="grid__cell" v-for="item in getRange" :key="item">
      <div class="grid__end" :style="getTopStyle(item[0])"></div>
      <div class="grid__middle" :style="getMiddleStyle(item)"></div>
      <div class="grid__end" :style="getBottomStyle(item[1])"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import store from '../store';

export default defineComponent({
  name: 'Grid',
  computed: {
    ...mapGetters([
      'booleanParams',
      'numberParams',
    ]),
    getRange(): Array<Array<number>> {
      return store.state.arrayParams.range;
    },
  },
  methods: {
    calcOpacity(time: number): number {
      const calc: number = (18000 - time) / 24000;

      return calc > 0.1 ? calc : 0.1;
    },
    getTopStyle(num: number): string {
      return `${this.getOpacity()} ${this.getTopHeight(num)}`;
    },
    getMiddleStyle(item: Array<number>): string {
      return this.getCSSValue('height', (item[0] - item[1]), true);
    },
    getBottomStyle(num: number): string {
      return `${this.getOpacity()} ${this.getBottomHeight(num)}`;
    },
    getTopHeight(num: number): string {
      return this.getCSSValue('height', (100 - num), true);
    },
    getBottomHeight(num: number): string {
      return this.getCSSValue('height', num, true);
    },
    getOpacity(): string {
      const {
        booleanParams: { playing },
        numberParams: { time },
      } = this;
      let opacity = 0.75;

      if (playing) {
        opacity = this.calcOpacity(time);
      }

      return this.getCSSValue('opacity', opacity);
    },
    getCSSValue(prop: string, val: number, percent = false): string {
      return percent ? `${prop}: ${val}%;` : `${prop}: ${val};`;
    },
  },
});
</script>
