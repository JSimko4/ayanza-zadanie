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
      text: "",
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
    },
    emitStopDrag() {
      this.$emit("stop-drag");
    },
    focusNote() {
      this.showTopBar = true;
      this.zIndex = 10;
    },
    focuOutNote() {
      this.showTopBar = false;
      this.zIndex = 0;
    },
  },
});
</script>

<template>
  <div @focus="focusNote" @focusout="focuOutNote" tabindex="0" class="note">
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
      @focus="focusNote"
      @focusout="focuOutNote"
    ></textarea>
  </div>
</template>

<style scoped>
.note {
  position: absolute;
  left: v-bind(currentX + "px");
  top: v-bind(currentY + "px");
  z-index: v-bind(zIndex);

  background-color: v-bind(color);
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

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

.note-input {
  background: transparent;
  outline: none;
  border: none;
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
