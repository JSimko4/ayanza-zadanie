import type Cursor from "./Cursor";
import type Note from "./Note";

export default interface Connection {
  id: number;
  obj1: Note;
  obj2: Note | Cursor;
}
