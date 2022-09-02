<script lang="ts">
import { defineComponent } from "vue";
import StickyNote from "./StickyNote.vue";

interface Note {
  id: number;
  text: string;
  top: number;
  left: number;
}

export default defineComponent({
  props: {
    boardName: String,
  },
  data() {
    return {
      stickyNotes: [] as Note[],
    };
  },
  mounted() {
    this.boardName;
    this.stickyNotes = [];
  },
  methods: {
    addStickyNote() {
      this.stickyNotes.push({ id: 1, text: "test", top: 200, left: 250 });
      console.log(this.stickyNotes);
    },
  },
  components: { StickyNote },
});
</script>

<template>
  <header class="board-header">
    <p class="board-name">{{ boardName }}</p>
  </header>

  <section class="board">
    <StickyNote
      v-for="note in stickyNotes"
      :key="note.id"
      :id="note.id"
      :text="note.text"
      :top="note.top"
      :left="note.left"
    />
  </section>

  <footer class="buttons-container">
    <button class="button">Move on board</button>
    <button @click="addStickyNote">Create new sticky note</button>
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
  margin: 0;
  font-weight: bold;
  font-size: large;
}

.board {
  height: 95vh;
  background-color: aqua;
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
</style>
