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
    emitRemoveNote() {
      this.$emit("remove-note", this.id);
    },
    emitStartDrag(event: any) {
      this.$emit("start-drag", event, this.id);
      this.zIndex = 10;
    },
    emitStopDrag() {
      this.$emit("stop-drag");
      this.zIndex = 0;
    },
  },
});
</script>

<template>
  <span
    class="emoji"
    @mousedown.prevent="emitStartDrag"
    @mouseup="emitStopDrag"
    >{{ emoji }}</span
  >
</template>

<style scoped>
.emoji {
  position: absolute;
  left: v-bind(currentX + "px");
  top: v-bind(currentY + "px");
  z-index: v-bind(zIndex);
  cursor: pointer;

  background-color: tranasparent;

  /* edit to resizable later on*/
  font-size: 50px;
}

.top-bar {
  width: 100%;
  height: 30px;
  padding: 5px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.1);

  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  cursor: move;
}

.top-bar-icon {
  font-size: 20px;
  cursor: pointer;
  color: black;
}
</style>
