<script lang="ts">
import { defineComponent } from "vue";
import StickyNote from "./StickyNote.vue";
import type Note from "@/contracts/Note";
import type Emoji from "@/contracts/Emoji";
import type Connection from "@/contracts/Connection";
import StickyEmoji from "./StickyEmoji.vue";
import ObjectConnection from "./ObjectConnection.vue";

export default defineComponent({
  props: {
    boardName: String,
  },
  data() {
    return {
      stickyNotes: [] as Note[],
      emojis: [] as Emoji[],
      connections: [] as Connection[],

      currentDragged: undefined as Note | Emoji | undefined,
      currentResized: undefined as Note | Emoji | undefined,
      currentConnected: undefined as Note | undefined,

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
        activeResizePosition: "",
        activeConnector: false,
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
        currentHeight: 40,
        currentWidth: 40,
        activeResizePosition: "",
      });
    },
    removeNote(id: number) {
      this.stickyNotes = this.stickyNotes.filter(function (e: Note) {
        return e.id !== id;
      });

      this.removeConnectionByObjectsId(id);
    },
    removeEmoji(id: number) {
      this.emojis = this.emojis.filter(function (e: Emoji) {
        return e.id !== id;
      });
    },
    removeConnectionByConnectionId(id: number) {
      this.connections = this.connections.filter(function (e: Connection) {
        return e.id !== id;
      });
    },
    removeConnectionByObjectsId(id: number) {
      this.connections = this.connections.filter(function (e: Connection) {
        return e.obj1.id !== id && e.obj2.id !== id;
      });
    },

    onMouseMove(event: any) {
      if (this.currentDragged !== undefined) {
        this.onDrag(event);
      } else if (this.currentResized !== undefined) {
        this.onDragResize(event);
      }
    },

    // connect board objects
    startConnection(id: number) {
      this.currentConnected = this.stickyNotes.find(
        (element: Note) => element.id === id
      );

      if (this.currentConnected === undefined) return;

      this.currentConnected.activeConnector = true;

      /*
      TO DO.. board object -> cursor animation
      const cursor = {
        id: 0,
        color: "",
        cursorInitialX: 0,
        cursorInitialY: 0,
        currentX: 50,
        currentY: 50,
        currentHeight: 200,
        currentWidth: 200,
        activeResizePosition: "",
      };

      // start connection from start object to cursor position
      this.connections.push({
        id: -1,
        obj1: this.currentConnected,
        obj2: cursor,
      });
      */
    },
    finishConnection(id: number) {
      const connectionEnd = this.stickyNotes.find(
        (element: Note) => element.id === id
      );

      if (this.currentConnected === undefined || connectionEnd === undefined) {
        return;
      }

      // cant connect to itself
      if (this.currentConnected.id === connectionEnd.id) {
        return;
      }

      this.connections.push({
        id: this.currentId++,
        obj1: this.currentConnected,
        obj2: connectionEnd,
      });

      // reset start connection and active connector effect
      this.currentConnected.activeConnector = false;
      this.currentConnected = undefined;

      // remove object to cursor connection (animation)
      this.removeConnectionByConnectionId(-1);
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
    updateResizedObject(
      minWidth: number,
      minHeight: number,
      newWidth: number,
      newHeight: number,
      newX: number | undefined,
      newY: number | undefined
    ) {
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
        this.currentResized.activeResizePosition = position;
        this.currentResized.cursorInitialX = event.clientX;
        this.currentResized.cursorInitialY = event.clientY;
      }
    },
    onDragResize(event: any) {
      if (this.currentResized !== undefined) {
        let newWidth = 0;
        let newHeight = 0;
        let newX = undefined;
        let newY = undefined;

        // calculate new dimensions
        if (this.currentResized.activeResizePosition === "bottom-right") {
          newWidth =
            this.currentResized.currentWidth +
            event.clientX -
            this.currentResized.cursorInitialX;
          newHeight =
            this.currentResized.currentHeight +
            event.clientY -
            this.currentResized.cursorInitialY;
        } else if (this.currentResized.activeResizePosition === "bottom-left") {
          newWidth =
            this.currentResized.currentWidth -
            (event.clientX - this.currentResized.cursorInitialX);
          newHeight =
            this.currentResized.currentHeight +
            (event.clientY - this.currentResized.cursorInitialY);
          newX =
            this.currentResized.currentX +
            (event.clientX - this.currentResized.cursorInitialX);
        } else if (this.currentResized.activeResizePosition === "top-right") {
          newWidth =
            this.currentResized.currentWidth +
            (event.clientX - this.currentResized.cursorInitialX);
          newHeight =
            this.currentResized.currentHeight -
            (event.clientY - this.currentResized.cursorInitialY);
          newY =
            this.currentResized.currentY +
            (event.clientY - this.currentResized.cursorInitialY);
        } else if (this.currentResized.activeResizePosition === "top-left") {
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

        // set min dimensions (note)
        let minWidth = 60;
        let minHeight = 60;

        // set min dimensions (emoji)
        if ("emoji" in this.currentResized) {
          minHeight = 35;
          minWidth = 35;
        }

        // update object dimensions
        this.updateResizedObject(
          minWidth,
          minHeight,
          newWidth,
          newHeight,
          newX,
          newY
        );
      }
    },
    stopDragResize() {
      if (this.currentResized !== undefined) {
        this.currentResized.activeResizePosition = ""; // disable active effect for resizer
        this.currentResized = undefined;
      }
    },
  },
  components: { StickyNote, StickyEmoji, ObjectConnection },
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
      :activeResizePosition="note.activeResizePosition"
      :activeConnector="note.activeConnector"
      v-on:remove-note="removeNote"
      v-on:start-drag="startDrag"
      v-on:stop-drag="stopDrag"
      v-on:start-drag-resize="startDragResize"
      v-on:stop-drag-resize="stopDragResize"
      v-on:start-connection="startConnection"
      v-on:finish-connection="finishConnection"
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
      :activeResizePosition="emoji.activeResizePosition"
      v-on:remove-emoji="removeEmoji"
      v-on:start-drag="startDrag"
      v-on:stop-drag="stopDrag"
      v-on:start-drag-resize="startDragResize"
      v-on:stop-drag-resize="stopDragResize"
    />

    <svg width="100%" height="100%" style="z-index: -1">
      <ObjectConnection
        v-for="connection in connections"
        :key="connection.id"
        :obj1="connection.obj1"
        :obj2="connection.obj2"
      />
    </svg>
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
