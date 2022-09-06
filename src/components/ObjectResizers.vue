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
      class="resizer resizer-vertical resizer-right"
      :class="{ 'active-resizer': activePosition === 'right' }"
      @mousedown.prevent="emitStartDragResize($event, 'right')"
      @mouseup="emitStopDragResize"
    ></div>

    <div
      class="resizer resizer-vertical resizer-left"
      :class="{ 'active-resizer': activePosition === 'left' }"
      @mousedown.prevent="emitStartDragResize($event, 'left')"
      @mouseup="emitStopDragResize"
    ></div>

    <div
      class="resizer resizer-horizontal resizer-bottom"
      :class="{ 'active-resizer': activePosition === 'bottom' }"
      @mousedown.prevent="emitStartDragResize($event, 'bottom')"
      @mouseup="emitStopDragResize"
    ></div>

    <div
      class="resizer resizer-horizontal resizer-top"
      :class="{ 'active-resizer': activePosition === 'top' }"
      @mousedown.prevent="emitStartDragResize($event, 'top')"
      @mouseup="emitStopDragResize"
    ></div>

    <div
      class="corner-resizer resizer-top-left"
      :class="{ 'active-resizer': activePosition === 'top-left' }"
      @mousedown.prevent="emitStartDragResize($event, 'top-left')"
      @mouseup="emitStopDragResize"
    ></div>

    <div
      class="corner-resizer resizer-bottom-left"
      :class="{ 'active-resizer': activePosition === 'bottom-left' }"
      @mousedown.prevent="emitStartDragResize($event, 'bottom-left')"
      @mouseup="emitStopDragResize"
    ></div>

    <div
      class="corner-resizer resizer-top-right"
      :class="{ 'active-resizer': activePosition === 'top-right' }"
      @mousedown.prevent="emitStartDragResize($event, 'top-right')"
      @mouseup="emitStopDragResize"
    ></div>

    <div
      class="corner-resizer resizer-bottom-right"
      :class="{ 'active-resizer': activePosition === 'bottom-right' }"
      @mousedown.prevent="emitStartDragResize($event, 'bottom-right')"
      @mouseup="emitStopDragResize"
    ></div>
  </section>
</template>

<style scoped>
.corner-resizer {
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

.resizer {
  position: absolute;
  z-index: 50;
  background: #6a9ef7;
}

.resizer-vertical {
  width: 3px;
  height: 100%;
  cursor: e-resize;
}

.resizer-horizontal {
  width: 100%;
  height: 3px;
  cursor: n-resize;
}

.resizer-right {
  right: 0px;
  top: 0px;
}

.resizer-left {
  left: 0px;
  top: 0px;
}

.resizer-top {
  right: 0px;
  top: 0px;
}

.resizer-bottom {
  right: 0px;
  bottom: 0px;
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
