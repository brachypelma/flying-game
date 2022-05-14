<template>
  <div id="ship" class="ship" :style="setShipPosition"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '../store';

export default defineComponent({
  name: 'Ship',
  computed: {
    setShipPosition() {
      return `bottom: ${store.state.numberParams.position}%;`;
    },
  },
});
</script>
