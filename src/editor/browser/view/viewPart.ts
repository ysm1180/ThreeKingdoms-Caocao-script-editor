import { ViewContext } from '../../common/view/viewContext';
import { ViewEventHandler } from '../../common/view/viewEventHandler';

export abstract class ViewPart extends ViewEventHandler {
  protected context: ViewContext;

  constructor(context: ViewContext) {
    super();

    this.context = context;
    this.context.eventDispatcher.addEventHandler(this);
  }

  public dispose(): void {
    this.context.eventDispatcher.removeEventHandler(this);
    this.context = null;
    super.dispose();
  }

  public abstract render(): void;
}
