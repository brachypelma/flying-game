<template>
  <div class="header">
    <div class="header__name">
      <h1 class="header__title">Tunnel Vision</h1>
    </div>
    <div class="header__stats">
      <div class="header__item">Level: {{ getLevel }}</div>
      <div class="header__item">Score: {{ getScore }}</div>
      <div class="header__item">Coins: {{ getCoinString }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '../store';

export default defineComponent({
  name: 'Header',
  computed: {
    getCoinString(): string {
      const { state: { numberParams: { coinsAdded, coinsGot } } } = store;
      const percent: number = (coinsGot / coinsAdded) * 100;
      const pctStr: string = percent ? `(${percent.toFixed(0)}%)` : '(0%)';

      return `${coinsGot}/${coinsAdded} ${pctStr}`;
    },
    getLevel(): number {
      return store.state.numberParams.level;
    },
    getScore(): string {
      return Math.floor(store.state.numberParams.score / 10)
        .toLocaleString();
    },
  },
});
</script>
