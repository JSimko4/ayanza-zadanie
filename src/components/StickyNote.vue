<script lang="ts">
import { defineComponent, type PropType } from "vue";
import ObjectResizers from "./ObjectResizers.vue";
import type Note from "@/contracts/Note";

export default defineComponent({
  props: {
    // note: Object as PropType<Note>, later --> refactor
    id: Number,
    currentWidth: Number,
    currentHeight: Number,
    currentX: Number,
    currentY: Number,
    color: String,
    activeResizePosition: String,
    activeConnector: Boolean,
  },
  data() {
    return {
      text: "",
      showTopBar: false,
      zIndex: 0,
    };
  },
  methods: {
    emitRemoveNote() {
      this.$emit("remove-note", this.id);
    },

    // resize functions
    emitStartDragResize(event: any, position: string) {
      this.$emit("start-drag-resize", event, this.id, position);
    },
    emitStopDragResize() {
      this.$emit("stop-drag-resize");
    },

    // connection functions
    emitStartConnection() {
      if (!this.activeConnector) {
        this.$emit("start-connection", this.id);
      } else {
        this.$emit("cancel-connection");
      }
    },
    emitFinishConnection() {
      this.$emit("finish-connection", this.id);
    },
    emitMouseOver() {
      this.$emit("mouse-over", this.id);
    },
    emitMouseLeave() {
      this.$emit("mouse-leave", this.id);
    },

    // drag-move functions
    emitStartDrag(event: any) {
      this.$emit("start-drag", event, this.id);
    },
    emitStopDrag() {
      this.$emit("stop-drag");
    },

    // show top bar functions
    focusNote() {
      this.showTopBar = true;
      this.zIndex = 10;
    },
    focuOutNote() {
      this.showTopBar = false;
      this.zIndex = 0;
    },
  },
  components: { ObjectResizers },
});
</script>

<template>
  <div
    @click="emitFinishConnection"
    @focus="focusNote"
    @focusout="focuOutNote"
    @mouseover="emitMouseOver"
    @mouseleave="emitMouseLeave"
    tabindex="0"
    class="note"
  >
    <section
      v-show="showTopBar"
      class="top-bar"
      @mousedown.prevent="emitStartDrag"
      @mouseup="emitStopDrag"
    >
      <span
        class="material-icons top-bar-icon"
        :class="{ 'active-top-bar-icon': activeConnector }"
        @click="emitStartConnection"
      >
        route
      </span>
      <span class="material-icons top-bar-icon" @click="emitRemoveNote">
        cancel
      </span>
    </section>

    <textarea
      v-model="text"
      class="note-input"
      @focus="focusNote"
      @focusout="focuOutNote"
      @click="emitFinishConnection"
    ></textarea>

    <ObjectResizers
      :showResizers="showTopBar"
      :activePosition="activeResizePosition"
      v-on:start-drag-resize="emitStartDragResize"
      v-on:stop-drag-resize="emitStopDragResize"
    />
  </div>
</template>

<style scoped>
.note {
  position: absolute;
  left: v-bind(currentX + "px");
  top: v-bind(currentY + "px");
  width: v-bind(currentWidth + "px");
  height: v-bind(currentHeight + "px");
  z-index: v-bind(zIndex);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: v-bind(color);
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
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
  gap: 8px;

  cursor: move;
}

.top-bar-icon {
  font-size: 20px;
  cursor: pointer;
  color: black;
}

.active-top-bar-icon {
  color: #6a9ef7;
}

.note-input {
  background: transparent;
  outline: none;
  border: none;
  width: calc(100% - 20px);
  height: 100%;
  resize: none;
  padding: 8px;
}

/* text-area scroll styling */
textarea::-webkit-scrollbar {
  width: 2px;
}

textarea::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

textarea::-webkit-scrollbar-thumb {
  background-color: black;
}
</style>
