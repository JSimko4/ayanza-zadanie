<script lang="ts">
import { defineComponent } from "vue";
import type Note from "@/contracts/Note";
import type Cursor from "@/contracts/Cursor";

interface Point {
  x: number;
  y: number;
}

export default defineComponent({
  props: {
    obj1: Object as () => Note,
    obj2: Object as () => Note | Cursor,
  },
  computed: {
    getShortestDistancePoints() {
      const shortestDistancePoints: Point[] = [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ];

      if (this.obj1 === undefined || this.obj2 === undefined) {
        return shortestDistancePoints;
      }

      // get 2 points with shortest distance
      const points1: Point[] = this.getPoints(this.obj1, 30);
      const points2: Point[] = this.getPoints(this.obj2, 30);
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
  <line
    :x1="getShortestDistancePoints[0].x"
    :y1="getShortestDistancePoints[0].y"
    :x2="getShortestDistancePoints[1].x"
    :y2="getShortestDistancePoints[1].y"
    style="stroke: black; stroke-width: 1.25"
    marker-end="url(#arrow)"
  />
</template>

<style scoped></style>
