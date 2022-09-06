<script lang="ts">
import type Emoji from "@/models/Emoji";
import { defineComponent, type PropType } from "vue";
import ObjectResizers from "./ObjectResizers.vue";

export default defineComponent({
  props: {
    emoji: { type: Object as PropType<Emoji>, required: true },
    currentMaxZIndex: { type: Number, required: true },
  },
  data() {
    return {
      showTopBar: false,
      showResizers: false,
      zIndex: this.currentMaxZIndex,
    };
  },
  computed: {
    emojiXPx() {
      return this.emoji.currentX + "px";
    },
    emojiYPx() {
      return this.emoji.currentY + "px";
    },
    emojiWidthPx() {
      return this.emoji.currentWidth + "px";
    },
    emojiHeightPx() {
      return this.emoji.currentHeight + "px";
    },
    emojiSize() {
      if (
        this.emoji.currentWidth !== undefined &&
        this.emoji.currentHeight !== undefined
      ) {
        const smallerDimension =
          this.emoji.currentHeight > this.emoji.currentWidth
            ? this.emoji.currentWidth
            : this.emoji.currentHeight;
        return smallerDimension / 1.25 + "px";
      }
      return "15px";
    },
  },
  methods: {
    emitRemoveEmoji() {
      this.$emit("remove-emoji", this.emoji.id);
    },

    // resize functions
    onClickResize() {
      this.showResizers = this.showResizers ? false : true;
    },
    emitStartDragResize(event: any, position: string) {
      this.$emit("start-drag-resize", event, this.emoji.id, position);
    },

    // drag-move functions
    emitStartDrag(event: any) {
      this.zIndex = this.currentMaxZIndex + 1;
      this.$emit("increment-z-index");
      this.$emit("start-drag", event, this.emoji.id);
    },
    emitStopDrag() {
      this.$emit("stop-drag");
    },

    // show top bar functions
    focusEmoji() {
      this.showTopBar = true;
    },
    focusOutEmoji() {
      this.showTopBar = false;
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
      <span
        class="material-icons top-bar-icon"
        :class="{ 'active-top-bar-icon': showResizers }"
        @click="onClickResize"
      >
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
      >{{ emoji.emoji }}</span
    >

    <ObjectResizers
      :showResizers="showResizers"
      :activePosition="emoji.activeResizePosition"
      v-on:start-drag-resize="emitStartDragResize"
    />
  </div>
</template>

<style scoped>
.emoji-container {
  position: absolute;
  left: v-bind(emojiXPx);
  top: v-bind(emojiYPx);
  width: v-bind(emojiWidthPx);
  height: v-bind(emojiHeightPx);
  z-index: v-bind(zIndex);
  background-color: transparent;
  padding: 15px 8px 8px 8px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.emoji {
  cursor: pointer;
  font-size: v-bind(emojiSize);
}

.top-bar {
  position: absolute;
  top: 5px;
  right: 7px;
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

.active-top-bar-icon {
  color: #6a9ef7;
}
</style>
