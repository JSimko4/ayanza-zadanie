<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type Note from "@/contracts/Note";
import type Cursor from "@/contracts/Cursor";
import type Point from "@/contracts/Point";
import LineToItself from "./ConnectionTypes/LineToItself.vue";
import LineToOther from "./ConnectionTypes/LineToOther.vue";

export default defineComponent({
  props: {
    obj1: { type: Object as PropType<Note>, required: true },
    obj2: { type: Object as PropType<Note | Cursor>, required: true },
  },
  computed: {
    getLineType() {
      if (this.obj1.id === this.obj2.id) {
        return "LineToItself";
      }
      return "LineToOther";
    },
    getShortestDistancePoints() {
      const shortestDistancePoints: Point[] = [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ];

      // get all 4 points positions for specific board object
      const points1: Point[] = this.getPoints(this.obj1, 30);
      const points2: Point[] = this.getPoints(this.obj2, 30);

      // connection is between note itself
      if (this.obj1.id === this.obj2.id) {
        shortestDistancePoints[0] = points1[1]; // right point
        shortestDistancePoints[1] = points1[3]; // bottom point

        // set offset for points to differ from other line connections
        const diffOffset = 20;
        shortestDistancePoints[0].y += diffOffset;
        shortestDistancePoints[1].x += diffOffset;
      } else {
        // get 2 points with shortest distance
        let shortestDistance = Infinity;
        for (let i = 0; i < 4; i++) {
          const point1 = points1[i];
          for (let j = 0; j < 4; j++) {
            const point2 = points2[j];
            const distance = this.getDistance(
              point1.x,
              point2.x,
              point1.y,
              point2.y
            );
            if (distance < shortestDistance) {
              shortestDistance = distance;
              shortestDistancePoints[0] = point1;
              shortestDistancePoints[1] = point2;
            }
          }
        }
      }

      return shortestDistancePoints;
    },
  },
  methods: {
    getPoints(boardObject: Note | Cursor, topBarOffset: number) {
      const points: Point[] = [];
      const pointOffset = 5;
      // top point
      points[0] = {
        x: boardObject.currentX + boardObject.currentWidth / 2,
        y: boardObject.currentY - topBarOffset - pointOffset,
      };
      // right point
      points[1] = {
        x: boardObject.currentX + boardObject.currentWidth + pointOffset,
        y: boardObject.currentY - topBarOffset + boardObject.currentHeight / 2,
      };
      // left point
      points[2] = {
        x: boardObject.currentX - pointOffset,
        y: boardObject.currentY - topBarOffset + boardObject.currentHeight / 2,
      };
      // bottom point
      points[3] = {
        x: boardObject.currentX + boardObject.currentWidth / 2,
        y:
          boardObject.currentY +
          boardObject.currentHeight -
          topBarOffset +
          pointOffset,
      };
      return points;
    },
    getDistance(x1: number, x2: number, y1: number, y2: number) {
      const a = x1 - x2;
      const b = y1 - y2;
      return Math.sqrt(a * a + b * b);
    },
  },
  components: { LineToItself, LineToOther },
});
</script>

<template>
  <!-- line to itself or to another board object -->
  <component
    :is="getLineType"
    :startPoint="getShortestDistancePoints[0]"
    :endPoint="getShortestDistancePoints[1]"
  />
</template>

<style scoped></style>
