<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type Point from "@/models/Point";

export default defineComponent({
  emits: ["remove-connection"],
  props: {
    startPoint: { type: Object as PropType<Point>, required: true },
    endPoint: { type: Object as PropType<Point>, required: true },
  },
  methods: {
    emitRemove() {
      this.$emit("remove-connection");
    },
  },
});
</script>

<template>
  <defs>
    <marker
      id="arrow"
      markerWidth="10"
      markerHeight="10"
      refX="8"
      refY="3"
      orient="auto"
      markerUnits="strokeWidth"
    >
      <path d="M0,0 L0,6 L9,3 z" />
    </marker>
  </defs>

  <!-- invisible large line so user can easily click to delete -->
  <line
    @click="emitRemove"
    :x1="startPoint.x"
    :y1="startPoint.y"
    :x2="endPoint.x"
    :y2="endPoint.y"
    style="stroke: black; stroke-width: 10; stroke-opacity: 0; cursor: pointer"
  />

  <line
    :x1="startPoint.x"
    :y1="startPoint.y"
    :x2="endPoint.x"
    :y2="endPoint.y"
    style="stroke: black; stroke-width: 1.5"
    marker-end="url(#arrow)"
  />
</template>
