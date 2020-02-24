import { $, DomBuilder } from 'jojo/base/browser/domBuilder';
import { Disposable } from 'jojo/base/common/lifecycle';
import { IDimension } from 'jojo/editor/common/editorCommon';

export class Part extends Disposable {
  private parent: DomBuilder;
  private content: DomBuilder;

  constructor() {
    super();
  }

  public getContainer(): DomBuilder {
    return this.parent;
  }

  public getContentArea(): DomBuilder {
    return this.content;
  }

  public create(parent: DomBuilder) {
    this.parent = parent;
    this.content = this.createContent(parent);
  }

  protected createContent(parent: DomBuilder) {
    return $(parent).div({
      class: 'content',
    });
  }

  public layout(size: IDimension) {
    if (this.content) {
      this.content.size(size.width, size.height);
    }
  }
}
