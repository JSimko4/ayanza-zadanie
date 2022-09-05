<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    showResizers: Boolean,
    activePosition: String,
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
      :class="{ 'active-resizer': activePosition === 'top-left' }"
      @mousedown.prevent="emitStartDragResize($event, 'top-left')"
      @mouseup="emitStopDragResize"
    ></div>
    <div
      class="resizer resizer-bottom-left"
      :class="{ 'active-resizer': activePosition === 'bottom-left' }"
      @mousedown.prevent="emitStartDragResize($event, 'bottom-left')"
      @mouseup="emitStopDragResize"
    ></div>

    <div
      class="resizer resizer resizer-top-right"
      :class="{ 'active-resizer': activePosition === 'top-right' }"
      @mousedown.prevent="emitStartDragResize($event, 'top-right')"
      @mouseup="emitStopDragResize"
    ></div>
    <div
      class="resizer resizer-bottom-right"
      :class="{ 'active-resizer': activePosition === 'bottom-right' }"
      @mousedown.prevent="emitStartDragResize($event, 'bottom-right')"
      @mouseup="emitStopDragResize"
    ></div>
  </section>
</template>

<style scoped>
.resizer {
  position: absolute;
  width: 8px;
  height: 8px;
  z-index: 50;
  border: 2px solid #6a9ef7;
  border-radius: 50%;
  background: white;
}

.disabled-resizer {
  background: white;
}

.active-resizer {
  background: #6a9ef7;
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
