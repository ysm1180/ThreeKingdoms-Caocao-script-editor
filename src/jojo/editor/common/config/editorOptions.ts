export interface IConfigurationChangedEvent {
  readonly layoutInfo: boolean;
}

export interface EditorLayoutInfo {
  readonly contentLeft: number;
  readonly contentWidth: number;
  readonly contentHeight: number;
}

export class InternalEditorOptions {
  public layoutInfo: EditorLayoutInfo;

  constructor(source: { layoutInfo: EditorLayoutInfo }) {
    this.layoutInfo = source.layoutInfo;
  }

  public equals(other: InternalEditorOptions): boolean {
    return InternalEditorOptions._equalsLayoutInfo(this.layoutInfo, other.layoutInfo);
  }

  private static _equalsLayoutInfo(a: EditorLayoutInfo, b: EditorLayoutInfo) {
    return a.contentLeft === b.contentLeft && a.contentWidth === b.contentWidth && a.contentHeight === b.contentHeight;
  }

  public createChangeEvent(newOpts: InternalEditorOptions): IConfigurationChangedEvent {
    return {
      layoutInfo: !InternalEditorOptions._equalsLayoutInfo(this.layoutInfo, newOpts.layoutInfo),
    };
  }
}
