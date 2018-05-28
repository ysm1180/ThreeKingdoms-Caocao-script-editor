import { IDisposable } from 'code/base/common/lifecycle';

export interface IView extends IDisposable {
    create(container: HTMLElement);

    dispose();
}