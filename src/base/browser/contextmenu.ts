export interface IContextMenuDelegate {
  getAnchor(): { x: number; y: number };
  getItems();
}
