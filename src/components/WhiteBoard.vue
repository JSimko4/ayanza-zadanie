<script lang="ts">
import { defineComponent } from "vue";
import StickyNote from "./StickyNote.vue";
import type Note from "@/contracts/Note";
import type Emoji from "@/contracts/Emoji";
import StickyEmoji from "./StickyEmoji.vue";

export default defineComponent({
  props: {
    boardName: String,
  },
  data() {
    return {
      stickyNotes: [] as Note[],
      emojis: [] as Emoji[],
      currentDragged: undefined as Note | Emoji | undefined,

      emojiCodes: ["😍", "👍", "👎", "😭", "😕", "😐", "😊"],
      colorCodes: ["#fdddef", "#e3d7fb", "#cff4e8", "#fff7cf"],
      currentId: 0,
    };
  },
  methods: {
    addStickyNote() {
      this.stickyNotes.push({
        id: this.currentId++,
        color:
          this.colorCodes[Math.floor(Math.random() * this.colorCodes.length)],
        cursorInitialX: 0,
        cursorInitialY: 0,
        currentX: 50,
        currentY: 50,
      });
    },
    addEmoji() {
      this.emojis.push({
        id: this.currentId++,
        emoji:
          this.emojiCodes[Math.floor(Math.random() * this.colorCodes.length)],
        cursorInitialX: 0,
        cursorInitialY: 0,
        currentX: 50,
        currentY: 50,
      });
    },
    removeNote(id: number) {
      this.stickyNotes = this.stickyNotes.filter(function (e: Note) {
        return e.id !== id;
      });
    },
    removeEmoji(id: number) {
      this.emojis = this.emojis.filter(function (e: Emoji) {
        return e.id !== id;
      });
    },

    // drag-move board objects
    startDrag(event: any, id: number) {
      // concat object arrays
      const combinedArr: (Note | Emoji)[] = [
        ...this.stickyNotes,
        ...this.emojis,
      ];

      // find specific board object by id
      this.currentDragged = combinedArr.find(
        (element: Note | Emoji) => element.id === id
      );

      // get cursor initial positions
      if (this.currentDragged !== undefined) {
        this.currentDragged.cursorInitialX = event.clientX;
        this.currentDragged.cursorInitialY = event.clientY;
      }
    },
    onDrag(event: any) {
      if (this.currentDragged !== undefined) {
        const cursorOffsetX =
          this.currentDragged.currentX - this.currentDragged.cursorInitialX;
        const cursorOffsetY =
          this.currentDragged.currentY - this.currentDragged.cursorInitialY;

        // update dragged board object positions
        this.currentDragged.currentX = cursorOffsetX + event.clientX;
        this.currentDragged.currentY = cursorOffsetY + event.clientY;

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
  components: { StickyNote, StickyEmoji },
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

    <StickyEmoji
      v-for="emoji in emojis"
      :key="emoji.id"
      :id="emoji.id"
      :emoji="emoji.emoji"
      :currentX="emoji.currentX"
      :currentY="emoji.currentY"
      v-on:remove-note="removeNote"
      v-on:start-drag="startDrag"
      v-on:stop-drag="stopDrag"
    />
  </section>

  <footer class="buttons-container">
    <span class="material-icons button" @click="addStickyNote">note_add</span>
    <span class="button" @click="addEmoji">{{ emojiCodes[0] }}</span>
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
