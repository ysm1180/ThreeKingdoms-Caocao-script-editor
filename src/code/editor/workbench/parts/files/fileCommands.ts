import { KeyCode, KeyMode } from '../../../../base/common/keyCodes';
import { ServicesAccessor } from '../../../../platform/instantiation/instantiation';
import { KeybindingsRegistry } from '../../../../platform/keybindings/keybindingsRegistry';
import { IMe5FileService } from '../../services/me5/me5FileService';
import { IFileHandleService } from '../../services/files/files';
import { IWorkbenchEditorService } from '../../services/editor/editorService';
import { editorInputActivatedContext } from '../../browser/parts/editor/editorPart';

export const SAVE_FILE_ID = 'SAVE_FILE';

function save(path: string, me5FileService: IFileHandleService) {
    me5FileService.save(path);
}

KeybindingsRegistry.registerKeybindingRule({
    id: SAVE_FILE_ID,
    primary: KeyMode.Ctrl | KeyCode.KEY_S,
    handler: (accessor: ServicesAccessor) => {
        const editorService = accessor.get(IWorkbenchEditorService);
        const me5FileService = accessor.get(IMe5FileService);

        const input = editorService.getActiveEditorInput();
        save(input.getId(), me5FileService);
    },
    when: editorInputActivatedContext,
});