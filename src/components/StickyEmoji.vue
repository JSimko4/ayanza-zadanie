<script lang="ts">
import { defineComponent } from "vue";
import ObjectResizers from "./ObjectResizers.vue";

export default defineComponent({
  props: {
    id: Number,
    currentWidth: Number,
    currentHeight: Number,
    currentX: Number,
    currentY: Number,
    emoji: String,
    activeResizePosition: String,
  },
  data() {
    return {
      showTopBar: false,
      showResizers: false,
      zIndex: 0,
    };
  },
  computed: {
    emojiSize() {
      if (this.currentWidth !== undefined && this.currentHeight !== undefined) {
        const biggerDimension =
          this.currentHeight > this.currentWidth
            ? this.currentHeight
            : this.currentWidth;
        return biggerDimension / 1.5 + "px";
      }
      return "15px";
    },
  },
  methods: {
    emitRemoveEmoji() {
      this.$emit("remove-emoji", this.id);
    },
    // resize
    onClickResize() {
      this.showResizers = this.showResizers ? false : true;
    },
    emitStartDragResize(event: any, position: string) {
      this.$emit("start-drag-resize", event, this.id, position);
    },
    emitStopDragResize() {
      this.$emit("stop-drag-resize");
    },
    emitStartDrag(event: any) {
      this.$emit("start-drag", event, this.id);
      this.zIndex = 10;
    },
    emitStopDrag() {
      this.$emit("stop-drag");
    },
    focusEmoji() {
      this.showTopBar = true;
      this.zIndex = 10;
    },
    focusOutEmoji() {
      this.showTopBar = false;
      this.zIndex = 0;
    },
  },
  components: { ObjectResizers },
});
</script>

<template>
  <div
    class="emoji-container"
    @mouseover="focusEmoji"
    @mouseleave="focusOutEmoji"
    tabindex="0"
  >
    <section class="top-bar" v-show="showTopBar">
      <span class="material-icons top-bar-icon" @click="onClickResize">
        aspect_ratio
      </span>
      <span class="material-icons top-bar-icon" @click="emitRemoveEmoji">
        cancel
      </span>
    </section>
    <span
      @mousedown.prevent="emitStartDrag"
      @mouseup="emitStopDrag"
      class="emoji"
      tabindex="0"
      >{{ emoji }}</span
    >

    <ObjectResizers
      :showResizers="showResizers"
      :activePosition="activeResizePosition"
      v-on:start-drag-resize="emitStartDragResize"
      v-on:stop-drag-resize="emitStopDragResize"
    />
  </div>
</template>

<style scoped>
.emoji-container {
  position: absolute;
  left: v-bind(currentX + "px");
  top: v-bind(currentY + "px");
  width: v-bind(currentWidth + "px");
  height: v-bind(currentHeight + "px");
  z-index: v-bind(zIndex);
  background-color: transparent;
  padding: 10px;
  text-align: center;
}
.emoji {
  cursor: pointer;
  font-size: v-bind(emojiSize);
}

.top-bar {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
}

.top-bar-icon {
  font-size: 16px;
  cursor: pointer;
  color: black;
}
</style>
