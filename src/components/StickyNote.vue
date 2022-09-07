<script lang="ts">
import { defineComponent, type PropType } from "vue";
import ObjectResizers from "./ObjectResizers.vue";
import type Note from "@/models/Note";

export default defineComponent({
  props: {
    note: { type: Object as PropType<Note>, required: true },
    currentMaxZIndex: { type: Number, required: true },
  },
  data() {
    return {
      text: "",
      showTopBar: false,
      zIndex: this.currentMaxZIndex,
      lastZIndex: 0,
    };
  },
  computed: {
    noteXPx() {
      return this.note.currentX + "px";
    },
    noteYPx() {
      return this.note.currentY + "px";
    },
    noteWidthPx() {
      return this.note.currentWidth + "px";
    },
    noteHeightPx() {
      return this.note.currentHeight + "px";
    },
    noteColor() {
      return this.note.color;
    },
  },
  methods: {
    emitRemoveNote() {
      this.$emit("remove-note", this.note.id);
    },

    // resize functions
    emitStartDragResize(event: any, position: string) {
      this.$emit("start-drag-resize", event, this.note.id, position);
    },

    // connection functions
    emitStartConnection() {
      if (!this.note.activeConnector) {
        this.$emit("start-connection", this.note.id);
      } else {
        this.$emit("cancel-connection");
      }
    },
    emitFinishConnection() {
      this.$emit("finish-connection", this.note.id);
    },
    emitMouseOver() {
      this.$emit("mouse-over", this.note.id);
    },
    emitMouseLeave() {
      this.$emit("mouse-leave", this.note.id);
    },

    // drag-move functions
    emitStartDrag(event: any) {
      this.zIndex = this.currentMaxZIndex + 1;
      this.lastZIndex = this.zIndex;

      this.$emit("increment-z-index");
      this.$emit("start-drag", event, this.note.id);
    },
    emitStopDrag() {
      this.$emit("stop-drag");
    },

    // show top bar functions
    focusNote() {
      this.lastZIndex = this.zIndex;
      this.zIndex = this.currentMaxZIndex + 1;
      this.showTopBar = true;
    },
    focuOutNote() {
      this.zIndex = this.lastZIndex;
      this.showTopBar = false;
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
        :class="{ 'active-top-bar-icon': note.activeConnector }"
        @click.stop="emitStartConnection"
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
      spellcheck="false"
      @focus="focusNote"
      @focusout="focuOutNote"
      @click="emitFinishConnection"
    ></textarea>

    <ObjectResizers
      :showResizers="showTopBar"
      :activePosition="note.activeResizePosition"
      v-on:start-drag-resize="emitStartDragResize"
    />
  </div>
</template>

<style scoped>
.note {
  position: absolute;
  left: v-bind(noteXPx);
  top: v-bind(noteYPx);
  width: v-bind(noteWidthPx);
  height: v-bind(noteHeightPx);
  background-color: v-bind(noteColor);
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  z-index: v-bind(zIndex);
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
  color: #3376e8;
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
