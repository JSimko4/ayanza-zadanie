<script lang="ts">
import { defineComponent } from "vue";
import StickyNote from "./StickyNote.vue";
import type Note from "@/models/Note";
import type Emoji from "@/models/Emoji";
import type Connection from "@/models/Connection";
import StickyEmoji from "./StickyEmoji.vue";
import ObjectConnection from "./ObjectConnection/ObjectConnection.vue";
import type Cursor from "@/models/Cursor";
import WhiteBoardDialogs from "./WhiteBoardDialogs.vue";

export default defineComponent({
  props: {
    boardName: String,
  },
  data() {
    return {
      currentId: 0,
      currentMaxZIndex: 0,
      cursor: {
        id: -1,
        currentX: 0,
        currentY: 0,
        currentWidth: 3,
        currentHeight: 3,
      } as Cursor,

      stickyNotes: [] as Note[],
      emojis: [] as Emoji[],
      connections: [] as Connection[],

      currentDragged: undefined as Note | Emoji | undefined,
      currentResized: undefined as Note | Emoji | undefined,
      currentStartOfConnection: undefined as Note | undefined,
      temporaryEndOfConnection: {} as Note | Cursor,

      emojiCodes: [
        "😍",
        "😄",
        "👍",
        "🙋",
        "🐢",
        "🐳",
        "🐼",
        "🐶",
        "🐱",
        "🙈",
        "🙉",
        "🙊",
      ],
      colorCodes: ["#fdddef", "#e3d7fb", "#cff4e8", "#fff7cf"],
      showPickNotesDialog: false,
      showPickEmojisDialog: false,
      activeConnectionRemoval: false,
    };
  },
  methods: {
    addStickyNote(color: string) {
      this.stickyNotes.push({
        id: this.currentId++,
        color: color,
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
    addEmoji(emoji: string) {
      this.emojis.push({
        id: this.currentId++,
        emoji: emoji,
        cursorInitialX: 0,
        cursorInitialY: 0,
        currentX: 50,
        currentY: 50,
        currentHeight: 55,
        currentWidth: 55,
        activeResizePosition: "",
      });
    },
    removeNote(id: number) {
      this.stickyNotes = this.stickyNotes.filter(function (e: Note) {
        return e.id !== id;
      });

      this.currentStartOfConnection = undefined;
      this.removeConnectionByObjectsId(id);
    },
    removeEmoji(id: number) {
      this.emojis = this.emojis.filter(function (e: Emoji) {
        return e.id !== id;
      });
    },
    removeConnection(id: number, checkActiveConnectionRemoval: boolean) {
      if (!checkActiveConnectionRemoval || this.activeConnectionRemoval) {
        this.connections = this.connections.filter(function (e: Connection) {
          return e.id !== id;
        });
      }
    },
    removeConnectionByObjectsId(id: number) {
      this.connections = this.connections.filter(function (e: Connection) {
        return e.obj1.id !== id && e.obj2.id !== id;
      });
    },

    onMouseMove(event: any) {
      // update cursor positions
      this.cursor.currentX = event.clientX;
      this.cursor.currentY = event.clientY;

      if (this.currentDragged !== undefined) {
        this.onDrag(event);
      } else if (this.currentResized !== undefined) {
        this.onDragResize(event);
      }
    },

    // connect board objects
    startConnection(id: number) {
      this.activeConnectionRemoval = false;
      this.currentStartOfConnection = this.stickyNotes.find(
        (element: Note) => element.id === id
      );

      if (this.currentStartOfConnection === undefined) return;
      this.currentStartOfConnection.activeConnector = true;

      // start connection from start object to cursor
      this.setTemporaryEndToCursor();
      this.connections.push({
        id: -1,
        obj1: this.currentStartOfConnection,
        obj2: this.temporaryEndOfConnection,
      });
    },
    setTemporaryEnd(id: number) {
      const tempConnection = this.connections.find(
        (element: Connection) => element.id === -1
      );

      const newEnd = this.stickyNotes.find(
        (element: Note) => element.id === id
      );

      if (tempConnection === undefined || newEnd === undefined) return;

      tempConnection.obj2 = newEnd;
    },
    setTemporaryEndToCursor() {
      const tempConnection = this.connections.find(
        (element: Connection) => element.id === -1
      );

      if (tempConnection === undefined) return;
      tempConnection.obj2 = this.cursor;
    },
    finishConnection(id: number) {
      const connectionEnd = this.stickyNotes.find(
        (element: Note) => element.id === id
      );

      if (
        this.currentStartOfConnection === undefined ||
        connectionEnd === undefined
      ) {
        return;
      }

      // add new connection
      this.connections.push({
        id: this.currentId++,
        obj1: this.currentStartOfConnection,
        obj2: connectionEnd,
      });

      this.cancelConnectionCreation();
    },
    cancelConnectionCreation() {
      if (this.currentStartOfConnection === undefined) return;

      // reset start connection and active connector effect
      this.currentStartOfConnection.activeConnector = false;
      this.currentStartOfConnection = undefined;

      // remove object to cursor connection (animation)
      this.removeConnection(-1, false);
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
      newX: number,
      newY: number
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

        // stop resize if surpassed min dimensions
        if (newWidth < minWidth || newHeight < minHeight) {
          this.stopDragResize();
        } else {
          // update coordinates
          this.currentResized.currentX = newX;
          this.currentResized.currentY = newY;
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
    getNewDimensionPositions(
      position: string,
      x: number,
      y: number,
      width: number,
      height: number,
      cursorInitialX: number,
      cursorInitialY: number,
      cursorX: number,
      cursorY: number
    ) {
      let newX = x;
      let newY = y;
      let [right, bottom] = [0, 0];

      if (position.includes("right")) {
        right = 1;
      } else if (position.includes("left")) {
        // position changes only if resizing from left or top
        newX = x + (cursorX - cursorInitialX);
        right = -1;
      }
      if (position.includes("bottom")) {
        bottom = 1;
      } else if (position.includes("top")) {
        // position changes only if resizing from left or top
        newY = y + (cursorY - cursorInitialY);
        bottom = -1;
      }

      // calc new dimensions
      const newWidth = width + right * (cursorX - cursorInitialX);
      const newHeight = height + bottom * (cursorY - cursorInitialY);

      return { newWidth, newHeight, newX, newY };
    },
    onDragResize(event: any) {
      if (this.currentResized !== undefined) {
        // get new dimensions (width, height) and positions (x,y)
        const newDimensionsPositions = this.getNewDimensionPositions(
          this.currentResized.activeResizePosition,
          this.currentResized.currentX,
          this.currentResized.currentY,
          this.currentResized.currentWidth,
          this.currentResized.currentHeight,
          this.currentResized.cursorInitialX,
          this.currentResized.cursorInitialY,
          event.clientX,
          event.clientY
        );

        // update cursor initial positions
        this.currentResized.cursorInitialX = event.clientX;
        this.currentResized.cursorInitialY = event.clientY;

        // set min dimensions (emoji/note)
        const minWidth = "emoji" in this.currentResized ? 45 : 60;
        const minHeight = "emoji" in this.currentResized ? 45 : 60;

        // update object dimensions
        this.updateResizedObject(
          minWidth,
          minHeight,
          newDimensionsPositions.newWidth,
          newDimensionsPositions.newHeight,
          newDimensionsPositions.newX,
          newDimensionsPositions.newY
        );
      }
    },
    stopDragResize() {
      if (this.currentResized !== undefined) {
        this.currentResized.activeResizePosition = ""; // disable active effect for resizer
        this.currentResized = undefined;
      }
    },

    // closes currently opened dialog
    closeDialogs() {
      this.showPickNotesDialog = false;
      this.showPickEmojisDialog = false;
    },
  },
  components: { StickyNote, StickyEmoji, ObjectConnection, WhiteBoardDialogs },
});
</script>

<template>
  <header class="board-header">
    <p class="board-name">{{ boardName }}</p>
  </header>

  <section
    class="board"
    @mouseup="stopDragResize"
    @mousemove.prevent="onMouseMove"
    @keydown.esc="cancelConnectionCreation"
  >
    <StickyNote
      v-for="note in stickyNotes"
      :key="note.id"
      :note="note"
      :currentMaxZIndex="currentMaxZIndex"
      v-on:remove-note="removeNote"
      v-on:start-drag="startDrag"
      v-on:stop-drag="stopDrag"
      v-on:start-drag-resize="startDragResize"
      v-on:start-connection="startConnection"
      v-on:finish-connection="finishConnection"
      v-on:cancel-connection="cancelConnectionCreation"
      v-on:mouse-over="setTemporaryEnd"
      v-on:mouse-leave="setTemporaryEndToCursor"
      v-on:increment-z-index="currentMaxZIndex++"
    />

    <StickyEmoji
      v-for="emoji in emojis"
      :key="emoji.id"
      :emoji="emoji"
      :currentMaxZIndex="currentMaxZIndex"
      v-on:remove-emoji="removeEmoji"
      v-on:start-drag="startDrag"
      v-on:stop-drag="stopDrag"
      v-on:start-drag-resize="startDragResize"
      v-on:increment-z-index="currentMaxZIndex++"
    />

    <svg width="100%" height="100%">
      <ObjectConnection
        v-for="connection in connections"
        :key="connection.id"
        :obj1="connection.obj1"
        :obj2="connection.obj2"
        v-on:remove-connection="removeConnection(connection.id, true)"
      />
    </svg>
  </section>

  <WhiteBoardDialogs
    :showPickNotesDialog="showPickNotesDialog"
    :showPickEmojisDialog="showPickEmojisDialog"
    :colorCodes="colorCodes"
    :emojiCodes="emojiCodes"
    v-on:close-dialogs="closeDialogs"
    v-on:add-note="addStickyNote"
    v-on:add-emoji="addEmoji"
  />

  <footer class="buttons-container">
    <span
      class="material-icons button-right-divider button"
      @click="showPickNotesDialog = true"
    >
      note_add
    </span>
    <span
      class="button button-right-divider"
      style="width: 41px; height: 24px; box-sizing: border-box"
      @click="showPickEmojisDialog = true"
    >
      {{ emojiCodes[0] }}
    </span>
    <span
      class="material-icons button"
      :class="{ 'active-removal': activeConnectionRemoval }"
      @click="
        activeConnectionRemoval = !activeConnectionRemoval;
        cancelConnectionCreation();
      "
    >
      link_off
    </span>
  </footer>
</template>

<style>
.board-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 30px;
}

.board-name {
  margin: 0px 0px 0px 10px;
  font-weight: bold;
  font-family: "Inter", sans-serif;
}

.board {
  height: calc(100vh - 30px);
  background-image: url("/src/assets/background.png");
}

.buttons-container {
  position: absolute;
  bottom: 15px;
  width: 85;
  left: calc(50% - 42.5px);

  display: flex;
  align-items: center;
  justify-content: center;

  background: white;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  padding: 5px;
  border-radius: 10px;
  z-index: 2147483646;
}

.button {
  padding: 0px 7.5px;
  cursor: pointer;
}

.button-right-divider {
  border-right: 2px solid rgba(128, 128, 128, 0.3);
}

.active-removal {
  color: #3376e8;
}
</style>
