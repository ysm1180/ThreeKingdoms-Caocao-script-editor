import { KeyCode, KeyMode } from 'jojo/base/common/keyCodes';
import { ServicesAccessor } from 'jojo/platform/instantiation/common/instantiation';
import { KeybindingsRegistry } from 'jojo/platform/keybindings/keybindingsRegistry';
import { editorInputActivatedContext } from 'jojo/workbench/browser/parts/editor/editorPart';
import { IBinaryFileService } from 'jojo/workbench/services/binaryfile/binaryFiles';
import { IWorkbenchEditorService } from 'jojo/workbench/services/editor/editorService';

export const SAVE_FILE_ID = 'SAVE_FILE';

function save(path: string, me5FileService: IBinaryFileService) {
  me5FileService.save(path);
}

KeybindingsRegistry.registerKeybindingRule({
  id: SAVE_FILE_ID,
  primary: KeyMode.Ctrl | KeyCode.KEY_S,
  handler: (accessor: ServicesAccessor) => {
    const editorService = accessor.get(IWorkbenchEditorService);
    const me5FileService = accessor.get(IBinaryFileService);

    const input = editorService.getActiveEditorInput();
    save(input.getResource(), me5FileService);
  },
  when: editorInputActivatedContext,
});
