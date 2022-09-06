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
  },
});
</script>

<template>
  <section v-if="showResizers">
    <div
      class="resizer resizer-vertical resizer-right"
      :class="{ 'active-resizer2': activePosition === 'right' }"
      @mousedown.prevent="emitStartDragResize($event, 'right')"
    ></div>

    <div
      class="resizer resizer-vertical resizer-left"
      :class="{ 'active-resizer2': activePosition === 'left' }"
      @mousedown.prevent="emitStartDragResize($event, 'left')"
    ></div>

    <div
      class="resizer resizer-horizontal resizer-bottom"
      :class="{ 'active-resizer2': activePosition === 'bottom' }"
      @mousedown.prevent="emitStartDragResize($event, 'bottom')"
    ></div>

    <div
      class="resizer resizer-horizontal resizer-top"
      :class="{ 'active-resizer2': activePosition === 'top' }"
      @mousedown.prevent="emitStartDragResize($event, 'top')"
    ></div>

    <div
      class="corner-resizer resizer-top-left"
      :class="{ 'active-resizer': activePosition === 'top-left' }"
      @mousedown.prevent="emitStartDragResize($event, 'top-left')"
    ></div>

    <div
      class="corner-resizer resizer-bottom-left"
      :class="{ 'active-resizer': activePosition === 'bottom-left' }"
      @mousedown.prevent="emitStartDragResize($event, 'bottom-left')"
    ></div>

    <div
      class="corner-resizer resizer-top-right"
      :class="{ 'active-resizer': activePosition === 'top-right' }"
      @mousedown.prevent="emitStartDragResize($event, 'top-right')"
    ></div>

    <div
      class="corner-resizer resizer-bottom-right"
      :class="{ 'active-resizer': activePosition === 'bottom-right' }"
      @mousedown.prevent="emitStartDragResize($event, 'bottom-right')"
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

.resizer {
  position: absolute;
  z-index: 50;
  background: #6a9ef7;
}

.active-resizer {
  background: #6a9ef7;
}

.active-resizer2 {
  background: #3376e8;
}

.resizer-vertical {
  top: 0px;
  width: 3.5px;
  height: 100%;
  cursor: e-resize;
}

.resizer-horizontal {
  right: 0px;
  width: 100%;
  height: 3.5px;
  cursor: n-resize;
}

.resizer-right {
  right: 0px;
}

.resizer-left {
  left: 0px;
}

.resizer-top {
  top: 0px;
}

.resizer-bottom {
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
