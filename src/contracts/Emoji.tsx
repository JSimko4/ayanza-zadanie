export default interface Emoji {
  id: number;
  emoji: string;

  cursorInitialX: number;
  cursorInitialY: number;
  currentX: number;
  currentY: number;
  currentWidth: number;
  currentHeight: number;

  resizePosition: string;
}
