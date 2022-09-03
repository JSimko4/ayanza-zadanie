<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    id: Number,
    currentX: Number,
    currentY: Number,
    color: String,
  },
  data() {
    return {
      text: "test",
      showTopBar: false,
      isDragging: false,
    };
  },

  methods: {
    emitRemoveNote() {
      this.$emit("remove-note", this.id);
    },
    emitStartDrag(event: any) {
      this.$emit("start-drag", event, this.id);
    },
    emitStopDrag() {
      this.$emit("stop-drag");
    },
  },
  watch: {},
});
</script>

<template>
  <div
    @focus="showTopBar = true"
    @focusout="showTopBar = false"
    tabindex="0"
    class="note"
  >
    <section
      v-show="showTopBar"
      class="top-bar"
      @mousedown.prevent="emitStartDrag"
      @mouseup="emitStopDrag"
    >
      <i class="material-icons top-bar-icon" @click="emitRemoveNote">
        cancel
      </i>
    </section>

    <textarea
      v-model="text"
      class="note-input"
      @focus="showTopBar = true"
      @focusout="showTopBar = false"
    ></textarea>
  </div>
</template>

<style scoped>
.note {
  position: absolute;
  left: v-bind(currentX + "px");
  top: v-bind(currentY + "px");
  z-index: 9;

  background-color: v-bind(color);
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border: 1px solid rgba(0, 0, 0, 0.2);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* edit to resizable later on*/
  width: 200px;
  height: 200px;
}

.top-bar {
  width: 100%;
  height: 30px;
  padding: 5px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  cursor: move;
}

.top-bar-icon {
  font-size: 20px;
  cursor: pointer;
  color: white;
}

.note-input {
  background: transparent;
  outline: none;
  border: none;
  color: white;
  width: calc(100% - 20px);
  height: 100%;
  resize: none;
  margin: 8px;
}

/* text-area scroll styling */
textarea::-webkit-scrollbar {
  width: 2px;
}

textarea::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

textarea::-webkit-scrollbar-thumb {
  background-color: black;
}
</style>