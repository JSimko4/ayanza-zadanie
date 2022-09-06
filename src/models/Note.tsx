export default interface Note {
  id: number;
  color: string;

  cursorInitialX: number;
  cursorInitialY: number;
  currentX: number;
  currentY: number;
  currentWidth: number;
  currentHeight: number;

  activeResizePosition: string;
  activeConnector: boolean;
}
