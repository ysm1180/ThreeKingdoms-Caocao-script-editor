import { KeyCode, KeyMode } from '../../../base/common/keyCodes';

import { IResourceFileService } from '../../services/resourceFile/resourcefiles';
import { IWorkbenchEditorService } from '../../services/editor/editorService';
import { KeybindingsRegistry } from '../../../platform/keybindings/keybindingsRegistry';
import { ResourceFileService } from '../../services/resourceFile/resourceFileService';
import { ServicesAccessor } from '../../../platform/instantiation/instantiation';
import { editorInputActivatedContext } from '../../browser/parts/editor/editorPart';

export const SAVE_FILE_ID = 'SAVE_FILE';

function save(path: string, me5FileService: ResourceFileService) {
  me5FileService.save(path);
}

KeybindingsRegistry.registerKeybindingRule({
  id: SAVE_FILE_ID,
  primary: KeyMode.Ctrl | KeyCode.KEY_S,
  handler: (accessor: ServicesAccessor) => {
    const editorService = accessor.get(IWorkbenchEditorService);
    const me5FileService = accessor.get(IResourceFileService);

    const input = editorService.getActiveEditorInput();
    save(input.getResource(), me5FileService);
  },
  when: editorInputActivatedContext,
});
