<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type Point from "@/contracts/Point";

export default defineComponent({
  props: {
    startPoint: { type: Object as PropType<Point>, required: true },
    endPoint: { type: Object as PropType<Point>, required: true },
  },
  computed: {
    getPolyLinePoints() {
      const lineLength = 30;
      let pointsString = "";
      pointsString += `${this.startPoint.x} ${this.startPoint.y},`;
      pointsString += `${this.startPoint.x + lineLength} ${this.startPoint.y},`;
      pointsString += `${this.startPoint.x + lineLength} ${
        this.startPoint.y + lineLength
      },`;
      pointsString += `${this.startPoint.x} ${this.startPoint.y + lineLength}`;

      return pointsString;
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
  <polyline
    :points="getPolyLinePoints"
    style="stroke: black; stroke-width: 1.25"
    fill="none"
    marker-end="url(#arrow)"
  />
</template>
