<script lang="ts">
import { defineComponent, type PropType } from "vue";
import FloatingDialog from "./FloatingDialog.vue";

export default defineComponent({
  props: {
    showPickNotesDialog: { type: Boolean, required: true },
    showPickEmojisDialog: { type: Boolean, required: true },
    colorCodes: { type: Array as PropType<Array<string>>, required: true },
    emojiCodes: { type: Array as PropType<Array<string>>, required: true },
  },
  methods: {
    emitCloseDialogs() {
      this.$emit("close-dialogs");
    },
    emitAddNote(color: string) {
      this.$emit("add-note", color);
    },
    emitAddEmoji(emoji: string) {
      this.$emit("add-emoji", emoji);
    },
  },
  components: { FloatingDialog },
});
</script>

<template>
  <FloatingDialog :showDialog="showPickNotesDialog" @click="emitCloseDialogs">
    <template v-slot:header>
      <h3>Choose note color</h3>
    </template>
    <template v-slot:body>
      <div
        class="dialog-element dialog-note"
        v-for="color in colorCodes"
        :key="color"
        @click="emitAddNote(color)"
        :style="{ background: color }"
      ></div>
    </template>
  </FloatingDialog>

  <FloatingDialog :showDialog="showPickEmojisDialog" @click="emitCloseDialogs">
    <template v-slot:header>
      <h3>Choose new emoji</h3>
    </template>
    <template v-slot:body>
      <div
        class="dialog-element dialog-emoji"
        v-for="emoji in emojiCodes"
        :key="emoji"
        @click="emitAddEmoji(emoji)"
      >
        <span>{{ emoji }}</span>
      </div>
    </template>
  </FloatingDialog>
</template>

<style scoped>
.dialog-note {
  width: 50px;
  height: 50px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.33);
}

.dialog-emoji {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  padding: 5px;
}

.dialog-element {
  cursor: pointer;
  transition: all 0.25s ease;
}

.dialog-element:hover {
  transform: scale(1.3);
}
</style>
