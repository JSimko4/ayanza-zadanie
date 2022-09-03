<script lang="ts">
import { defineComponent } from "vue";
import StickyNote from "./StickyNote.vue";
import type Note from "@/contracts/Note";

export default defineComponent({
  props: {
    boardName: String,
  },
  data() {
    return {
      stickyNotes: [] as Note[],
      currentDragged: undefined as Note | undefined,
      currentId: 0,
    };
  },
  methods: {
    addStickyNote() {
      this.stickyNotes.push({
        id: this.currentId++,
        color: "brown",
        cursorInitialX: 0,
        cursorInitialY: 0,
        currentX: 200,
        currentY: 250,
      });
    },
    removeNote(id: number) {
      this.stickyNotes = this.stickyNotes.filter(function (e: Note) {
        return e.id !== id;
      });
    },

    // drag move note / emoji
    startDrag(event: any, id: number) {
      this.currentDragged = this.stickyNotes.find(
        (note: Note) => note.id === id
      );

      // get cursor initial positions
      if (this.currentDragged !== undefined) {
        this.currentDragged.cursorInitialX = event.clientX;
        this.currentDragged.cursorInitialY = event.clientY;
      }
    },
    onDrag(event: any) {
      if (this.currentDragged !== undefined) {
        console.log("mouse move");

        // update note / emoji current positions
        this.currentDragged.currentX =
          this.currentDragged.currentX -
          this.currentDragged.cursorInitialX +
          event.clientX;
        this.currentDragged.currentY =
          this.currentDragged.currentY -
          this.currentDragged.cursorInitialY +
          event.clientY;

        // update cursor initial positions
        this.currentDragged.cursorInitialX = event.clientX;
        this.currentDragged.cursorInitialY = event.clientY;
      }
    },
    stopDrag() {
      if (this.currentDragged !== undefined) {
        this.currentDragged = undefined;
      }
    },
  },
  components: { StickyNote },
});
</script>

<template>
  <header class="board-header">
    <p class="board-name">{{ boardName }}</p>
  </header>

  <section class="board" @mousemove.prevent="onDrag">
    <StickyNote
      v-for="note in stickyNotes"
      :key="note.id"
      :id="note.id"
      :color="note.color"
      :currentX="note.currentX"
      :currentY="note.currentY"
      v-on:remove-note="removeNote"
      v-on:start-drag="startDrag"
      v-on:stop-drag="stopDrag"
    />
  </section>

  <footer class="buttons-container">
    <i class="material-icons button">pan_tool</i>
    <i class="material-icons button" @click="addStickyNote">note_add</i>
  </footer>
</template>

<style>
.board-header {
  height: 5vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.board-name {
  margin: 0px 0px 0px 10px;
  font-weight: bold;
  font-size: large;
}

.board {
  height: 95vh;
}

.buttons-container {
  position: absolute;
  bottom: 15px;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.button {
  cursor: pointer;
}
</style>
