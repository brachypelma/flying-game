<template>
  <div id="board" class="board">
    <Grid></Grid>
    <Ship></Ship>
    <Coin></Coin>
    <StartButton></StartButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import {
  BooleanMutationPayload,
} from '../store/interfaces';
import store from '../store';
import Coin from './Coin.vue';
import Grid from './Grid.vue';
import Ship from './Ship.vue';
import StartButton from './StartButton.vue';

export default defineComponent({
  name: 'Board',
  components: {
    Coin,
    Grid,
    Ship,
    StartButton,
  },
  computed: {
    ...mapGetters([
      'arrayParams',
      'booleanParams',
      'numberParams',
    ]),
  },
  methods: {
    moveShip(bool: boolean) {
      const payload: BooleanMutationPayload = {
        prop: 'falling',
        type: typeof bool,
        bool,
      };
      store.dispatch('changeStoreParam', payload);
    },
    setFallingEventListeners() {
      document.addEventListener('keydown', () => {
        this.moveShip(false);
      });
      document.addEventListener('keyup', () => {
        this.moveShip(true);
      });
    },
  },
  mounted: function init() {
    this.setFallingEventListeners();
  },
});
</script>
