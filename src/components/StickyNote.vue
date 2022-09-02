<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    text: String,
    top: Number,
    left: Number,
  },
  mounted() {
    this.text;
    this.top;
    this.left;
  },
  computed: {
    topPosition() {
      return this.top + "px";
    },
    leftPosition() {
      return this.left + "px";
    },
  },
  methods: {
    // move()
  },
});
</script>

<template>
  <article class="note"></article>
</template>

<style scoped>
.note {
  position: absolute;
  top: v-bind(topPosition);
  left: v-bind(leftPosition);
  background-color: brown;
  width: 100px;
  height: 100px;
}
</style>
