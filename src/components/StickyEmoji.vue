<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    id: Number,
    currentX: Number,
    currentY: Number,
    emoji: String,
  },
  data() {
    return {
      showTopBar: false,
      zIndex: 0,
    };
  },

  methods: {
    emitRemoveEmoji() {
      this.$emit("remove-emoji", this.id);
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
});
</script>

<template>
  <div
    class="emoji-container"
    @mousedown.prevent="emitStartDrag"
    @mouseup="emitStopDrag"
    @mouseover="focusEmoji"
    @mouseleave="focusOutEmoji"
    tabindex="0"
  >
    <section class="top-bar" v-show="showTopBar">
      <i class="material-icons top-bar-icon" @click="emitRemoveEmoji">
        cancel
      </i>
    </section>
    <span class="emoji">{{ emoji }}</span>
  </div>
</template>

<style scoped>
.emoji-container {
  position: absolute;
  left: v-bind(currentX + "px");
  top: v-bind(currentY + "px");
  z-index: v-bind(zIndex);
  background-color: transparent;
  padding: 5px;

  /* edit to resizable later on*/
  font-size: 50px;
}
.emoji {
  cursor: pointer;

  /* edit to resizable later on*/
  padding: 3px;
  font-size: 50px;
}

.top-bar {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.top-bar-icon {
  font-size: 15px;
  cursor: pointer;
  color: black;
}
</style>
