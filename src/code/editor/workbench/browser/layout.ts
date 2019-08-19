import { DomBuilder, Size } from '../../../base/browser/domBuilder';
import { ISashLayoutProvider, Sash } from '../../../base/browser/ui/sash';
import { Disposable } from '../../../base/common/lifecycle';
import { IPartService } from '../services/part/partService';
import { EditorPart, IEditorGroupService } from './parts/editor/editorPart';
import { SidebarPart } from './parts/sidebarPart';
import { StatusbarPart } from './parts/statusbarPart';
import { TitlePart } from './parts/titlePart';

const TITLE_HEIGHT = 35;
const SIDEBAR_HEIGHT = 22;

export class WorkbenchLayout extends Disposable implements ISashLayoutProvider {
    private parent: DomBuilder;
    private workbench: DomBuilder;

    private workbenchSize: Size;

    private title: TitlePart;
    private titleHeight: number;

    private sidebar: SidebarPart;
    private sidebarWidth: number;
    private sidebarHeight: number;

    private editor: EditorPart;

    private statusbar: StatusbarPart;
    private statusbarHeight: number;

    private sashX: Sash;

    constructor(
        parent: DomBuilder,
        workbench: DomBuilder,
        parts: {
            title: TitlePart;
            sidebar: SidebarPart;
            editor: EditorPart;
            statusbar: StatusbarPart;
        },
        @IPartService private partService: IPartService,
        @IEditorGroupService private editorService: EditorPart
    ) {
        super();

        this.parent = parent;
        this.workbench = workbench;
        this.title = parts.title;
        this.sidebar = parts.sidebar;
        this.editor = parts.editor;
        this.statusbar = parts.statusbar;

        this.sidebarWidth = -1;

        this.sashX = new Sash(this.workbench.getHTMLElement(), this);
        this.sashX.onDidChange.add(e => {
            this.sidebarWidth = e.mouseX;
            this.layout();
        }, this);
    }

    public layout() {
        this.workbenchSize = this.parent.getClientArea();

        const isSidebarVisible = this.partService.isSidebarVisible();

        this.workbench
            .position(0, 0, 0, 0, 'relative')
            .size(this.workbenchSize.width, this.workbenchSize.height);

        this.titleHeight = TITLE_HEIGHT;
        this.statusbarHeight = SIDEBAR_HEIGHT;

        if (this.sidebarWidth === -1) {
            this.sidebarWidth = this.workbenchSize.width / 4;
        }
        this.sidebarHeight =
            this.workbenchSize.height - this.titleHeight - this.statusbarHeight;
        const sidebarSize = new Size(this.sidebarWidth, this.sidebarHeight);

        if (!isSidebarVisible) {
            sidebarSize.width = 0;
        }
        const titleWidth = this.workbenchSize.width;
        this.title
            .getContainer()
            .position(0, 0)
            .size(titleWidth, this.titleHeight);
        this.title.layout(new Size(titleWidth, this.titleHeight));

        this.sidebar.getContainer().position(this.titleHeight);
        this.sidebar.getContainer().size(this.sidebarWidth, this.sidebarHeight);
        this.sidebar.layout(new Size(this.sidebarWidth, this.sidebarHeight));

        const editorSize = new Size(
            this.workbenchSize.width - sidebarSize.width,
            this.sidebarHeight
        );
        this.editor
            .getContainer()
            .position(this.titleHeight, sidebarSize.width);
        this.editor.getContainer().size(editorSize.width, editorSize.height);
        this.editor.layout(new Size(editorSize.width, editorSize.height));

        this.statusbar
            .getContainer()
            .position(this.titleHeight + this.sidebarHeight, 0);
        this.statusbar.layout(
            new Size(this.workbenchSize.width, this.statusbarHeight)
        );

        if (isSidebarVisible) {
            this.sashX.show();
            this.sashX.layout();
        } else {
            this.sashX.hide();
        }
    }

    public getVerticalSashLeft(): number {
        return this.sidebarWidth;
    }

    public getVerticalSashTop(): number {
        return this.titleHeight;
    }

    public getVerticalSashHeight(): number {
        return this.sidebarHeight;
    }
}
