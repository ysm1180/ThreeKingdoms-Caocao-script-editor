import { ipcRenderer } from 'electron';
import * as array from 'jojo/base/common/array';
import { ICommandService } from 'jojo/platform/commands/common/commands';
import { IResourceInput } from 'jojo/platform/editor/common/editor';
import { IInstantiationService } from 'jojo/platform/instantiation/common/instantiation';
import { IKeybindingService, KeybindingService } from 'jojo/platform/keybindings/keybindingService';
import { IOpenFileRequest } from 'jojo/platform/windows/common/windows';
import { IWorkbenchEditorService, WorkbenchEditorService } from 'jojo/workbench/services/editor/editorService';

export class ElectronWindow {
  constructor(
    @IWorkbenchEditorService private editorService: WorkbenchEditorService,
    @ICommandService private commandService: ICommandService,
    @IKeybindingService private keybindingService: KeybindingService,
    @IInstantiationService private instantiationService: IInstantiationService
  ) {
    this.registerListeners();
  }

  public registerListeners() {
    ipcRenderer.on('app:runCommand', (e, id: string) => {
      this.commandService.run(id);
    });

    ipcRenderer.on('app:resolveKeybindings', (e, rawActionIds: string) => {
      let actionIds: string[] = [];
      try {
        actionIds = JSON.parse(rawActionIds);
      } catch (error) {
        // should not happen
      }

      this.resolveKeybindings(actionIds).then((keybindings) => {
        if (keybindings.length) {
          ipcRenderer.send('app:keybindingsResolved', JSON.stringify(keybindings));
        }
      });
    });

    ipcRenderer.on('editor:openFiles', (e, data: IOpenFileRequest) => this.onOpenFiles(data));
  }

  private onOpenFiles(data: IOpenFileRequest): void {
    if (!data.files) {
      return;
    }

    const inputs: IResourceInput[] = [];
    inputs.push(...this.toInputs(data.files));
    if (inputs.length) {
      this.openResources(inputs);
    }
  }

  private toInputs(paths: string[]) {
    return paths.map((path) => {
      let input: IResourceInput = {
        resource: path,
      };

      return input;
    });
  }

  private openResources(resources: IResourceInput[]) {
    if (resources.length === 1) {
      return this.editorService.openEditor(resources[0]);
    }

    return this.editorService.openEditors(resources);
  }

  private resolveKeybindings(actionIds: string[]): Promise<{ id: string; label: string; isNative: boolean }[]> {
    return Promise.resolve().then(() => {
      return array.coalesce(
        actionIds.map((id) => {
          const binding = this.keybindingService.lookupKeybinding(id);
          if (!binding) {
            return null;
          }

          const electronAccelerator = binding.electronShortKey();
          if (electronAccelerator) {
            return {
              id,
              label: electronAccelerator,
              isNative: true,
            };
          }

          return null;
        })
      );
    });
  }
}
