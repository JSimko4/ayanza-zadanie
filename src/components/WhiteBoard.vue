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
      currentResized: undefined as Note | Emoji | undefined,

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
        currentHeight: 200,
        currentWidth: 200,
        resizePosition: "",
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
        currentHeight: 100,
        currentWidth: 100,
        resizePosition: "",
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

    onMouseMove(event: any) {
      if (this.currentDragged !== undefined) {
        this.onDrag(event);
      } else if (this.currentResized !== undefined) {
        this.onDragResize(event);
      }
    },

    // drag-move board objects
    startDrag(event: any, id: number) {
      this.currentResized = undefined; // stop resizing

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

    // drag-resize board objects
    startDragResize(event: any, id: number, position: string) {
      // concat object arrays
      const combinedArr: (Note | Emoji)[] = [
        ...this.stickyNotes,
        ...this.emojis,
      ];

      // find specific board object by id
      this.currentResized = combinedArr.find(
        (element: Note | Emoji) => element.id === id
      );

      if (this.currentResized !== undefined) {
        this.currentResized.resizePosition = position;
        this.currentResized.cursorInitialX = event.clientX;
        this.currentResized.cursorInitialY = event.clientY;
      }
    },
    updateResizedObject(
      newWidth: number,
      newHeight: number,
      newX: number | undefined,
      newY: number | undefined
    ) {
      const minWidth = 60;
      const minHeight = 80;

      if (this.currentResized !== undefined) {
        // check & update width
        if (newWidth > minWidth) {
          this.currentResized.currentWidth = newWidth;
        }

        // check & update height
        if (newHeight > minHeight) {
          this.currentResized.currentHeight = newHeight;
        }

        // update x coordinate
        if (newX !== undefined) {
          this.currentResized.currentX = newX;
        }

        // update y coordinate
        if (newY !== undefined) {
          this.currentResized.currentY = newY;
        }

        // stop resize
        if (newWidth < minWidth || newHeight < minHeight) {
          this.stopDragResize();
        }
      }
    },
    onDragResize(event: any) {
      if (this.currentResized !== undefined) {
        let newWidth = 0;
        let newHeight = 0;
        let newX = undefined;
        let newY = undefined;

        // calculate new dimensions
        if (this.currentResized.resizePosition === "bottom-right") {
          newWidth =
            this.currentResized.currentWidth +
            event.clientX -
            this.currentResized.cursorInitialX;
          newHeight =
            this.currentResized.currentHeight +
            event.clientY -
            this.currentResized.cursorInitialY;
        } else if (this.currentResized.resizePosition === "bottom-left") {
          newWidth =
            this.currentResized.currentWidth -
            (event.clientX - this.currentResized.cursorInitialX);
          newHeight =
            this.currentResized.currentHeight +
            (event.clientY - this.currentResized.cursorInitialY);
          newX =
            this.currentResized.currentX +
            (event.clientX - this.currentResized.cursorInitialX);
        } else if (this.currentResized.resizePosition === "top-right") {
          newWidth =
            this.currentResized.currentWidth +
            (event.clientX - this.currentResized.cursorInitialX);
          newHeight =
            this.currentResized.currentHeight -
            (event.clientY - this.currentResized.cursorInitialY);
          newY =
            this.currentResized.currentY +
            (event.clientY - this.currentResized.cursorInitialY);
        } else if (this.currentResized.resizePosition === "top-left") {
          newWidth =
            this.currentResized.currentWidth -
            (event.clientX - this.currentResized.cursorInitialX);
          newHeight =
            this.currentResized.currentHeight -
            (event.clientY - this.currentResized.cursorInitialY);
          newX =
            this.currentResized.currentX +
            (event.clientX - this.currentResized.cursorInitialX);
          newY =
            this.currentResized.currentY +
            (event.clientY - this.currentResized.cursorInitialY);
        }

        // update cursor initial positions
        this.currentResized.cursorInitialX = event.clientX;
        this.currentResized.cursorInitialY = event.clientY;

        // update object dimensions
        this.updateResizedObject(newWidth, newHeight, newX, newY);
      }
    },
    stopDragResize() {
      if (this.currentResized !== undefined) {
        this.currentResized.resizePosition = "";
        this.currentResized = undefined;
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

  <section class="board" @mousemove.prevent="onMouseMove">
    <StickyNote
      v-for="note in stickyNotes"
      :key="note.id"
      :id="note.id"
      :color="note.color"
      :currentHeight="note.currentHeight"
      :currentWidth="note.currentWidth"
      :currentX="note.currentX"
      :currentY="note.currentY"
      :activeResizePosition="note.resizePosition"
      v-on:remove-note="removeNote"
      v-on:start-drag="startDrag"
      v-on:stop-drag="stopDrag"
      v-on:start-drag-resize="startDragResize"
      v-on:stop-drag-resize="stopDragResize"
    />

    <StickyEmoji
      v-for="emoji in emojis"
      :key="emoji.id"
      :id="emoji.id"
      :emoji="emoji.emoji"
      :currentWidth="emoji.currentWidth"
      :currentHeight="emoji.currentHeight"
      :currentX="emoji.currentX"
      :currentY="emoji.currentY"
      :activeResizePosition="emoji.resizePosition"
      v-on:remove-emoji="removeEmoji"
      v-on:start-drag="startDrag"
      v-on:stop-drag="stopDrag"
      v-on:start-drag-resize="startDragResize"
      v-on:stop-drag-resize="stopDragResize"
    />
  </section>

  <footer class="buttons-container">
    <span class="material-icons button" @click="addStickyNote">note_add</span>
    <span class="button" @click="addEmoji">{{ emojiCodes[0] }}</span>
  </footer>
</template>

<style>
.board-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 5px 0px;
}

.board-name {
  margin: 0px 0px 0px 10px;
  font-weight: bold;
  font-family: "Inter", sans-serif;
}

.board {
  height: 95vh;
  background-image: url("/src/assets/background.png");
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
