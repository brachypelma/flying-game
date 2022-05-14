<template>
  <div class="coin" :style="setCoinPosition"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'Coin',
  computed: {
    ...mapGetters([
      'booleanParams',
      'numberParams',
    ]),
    setCoinPosition(): string {
      return this.getCoinCSS();
    },
  },
  methods: {
    getCoinCSS(): string {
      const { numberParams: { coinX, coinY } } = this;

      if (!this.getCoinOnBoard()) {
        return 'display: none;';
      }

      return `${this.getCoinLeft(coinX)} ${this.getCoinBottom(coinY)}`;
    },
    getCoinBottom(coinY: number): string {
      return this.getCSSValue('bottom', coinY);
    },
    getCoinLeft(coinX: number): string {
      return this.getCSSValue('left', (coinX - 2.5));
    },
    getCoinOnBoard(): boolean {
      return this.booleanParams.coinOnBoard;
    },
    getCSSValue(prop: string, val: number): string {
      return `${prop}: ${val}%;`;
    },
  },
});
</script>
