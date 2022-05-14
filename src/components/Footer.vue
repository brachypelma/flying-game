<template>
  <div class="footer" v-if="show">
    <div class="footer__title">
      Previous Round
    </div>
    <div class="footer__stats">
      <div class="footer__item">Level: {{ getLevel }}</div>
      <div class="footer__item">Score: {{ getScore }}</div>
      <div class="footer__item">Coins: {{ getCoinString }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '../store';

export default defineComponent({
  name: 'Footer',
  computed: {
    getCoinString(): string {
      const { state: { numberParams: { coinsAddedPrev, coinsGotPrev } } } = store;
      const percent: number = (coinsGotPrev / coinsAddedPrev) * 100;
      const pctStr: string = percent ? `(${percent.toFixed(0)}%)` : '(0%)';

      return `${coinsGotPrev}/${coinsAddedPrev} ${pctStr}`;
    },
    getLevel(): number {
      return store.state.numberParams.levelPrev;
    },
    getScore(): string {
      return Math.floor(store.state.numberParams.scorePrev / 10)
        .toLocaleString();
    },
    show(): boolean {
      return !!store.state.numberParams.scorePrev;
    },
  },
});
</script>
