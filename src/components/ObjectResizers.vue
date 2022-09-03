<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    showResizers: Boolean,
  },

  methods: {
    emitStartDragResize(event: any, position: string) {
      this.$emit("start-drag-resize", event, position);
    },
    emitStopDragResize() {
      this.$emit("stop-drag-resize");
    },
  },
});
</script>

<template>
  <section v-if="showResizers">
    <div
      class="resizer resizer-top-left"
      @mousedown.prevent="emitStartDragResize($event, 'top-left')"
      @mouseup="emitStopDragResize"
    ></div>
    <div
      class="resizer resizer-bottom-left"
      @mousedown.prevent="emitStartDragResize($event, 'bottom-left')"
      @mouseup="emitStopDragResize"
    ></div>

    <div
      class="resizer resizer-top-right"
      @mousedown.prevent="emitStartDragResize($event, 'top-right')"
      @mouseup="emitStopDragResize"
    ></div>
    <div
      class="resizer resizer-bottom-right"
      @mousedown.prevent="emitStartDragResize($event, 'bottom-right')"
      @mouseup="emitStopDragResize"
    ></div>
  </section>
</template>

<style scoped>
.resizer {
  width: 10px;
  height: 10px;
  background: red;
  position: absolute;
  border-radius: 50%;
  z-index: 50;
}

.resizer-top-left {
  left: -5px;
  top: -5px;
  cursor: se-resize;
}

.resizer-top-right {
  right: -5px;
  top: -5px;
  cursor: ne-resize;
}

.resizer-bottom-left {
  bottom: -5px;
  left: -5px;
  cursor: ne-resize;
}
.resizer-bottom-right {
  bottom: -5px;
  right: -5px;
  cursor: se-resize;
}
</style>
