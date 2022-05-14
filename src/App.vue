<template>
  <Header></Header>
  <Board></Board>
  <Footer></Footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Board from './components/Board.vue';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';

export default defineComponent({
  name: 'App',
  components: {
    Board,
    Footer,
    Header,
  },
});
</script>

<style lang="scss">
@use 'assets/scss/main.scss';
</style>
