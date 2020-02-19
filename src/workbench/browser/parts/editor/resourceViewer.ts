import { $, DomBuilder } from '../../../../base/browser/domBuilder';
import { Audio } from '../../../../base/browser/ui/audio';
import { encodeToBase64 } from '../../../../base/common/encode';
import { AudioResource } from '../../../common/audioResource';
import { ImageResource } from '../../../common/imageResource';

export interface IResourceDescritor {
  resource: Buffer;
}

export class ResourceViewer {
  static show(descriptor: IResourceDescritor, container: DomBuilder) {
    $(container).addClass('resource-viewer');

    if (ResourceViewer.isImageResource(descriptor)) {
      ImageView.create(container, descriptor);
    } else if (ResourceViewer.isAudioResource(descriptor)) {
      AudioPlayer.create(container, descriptor);
    }
  }

  private static isImageResource(descriptor: IResourceDescritor): boolean {
    return ImageResource.getTypeFromBinary(descriptor.resource) !== null;
  }

  private static isAudioResource(descriptor: IResourceDescritor): boolean {
    return AudioResource.getTypeFromBinary(descriptor.resource) !== null;
  }
}

export class ImageView {
  static create(container: DomBuilder, descriptor: IResourceDescritor) {
    container.empty();

    const type = ImageResource.getTypeFromBinary(descriptor.resource);
    $(
      $(container).div({
        class: 'image-view',
      })
    ).img({
      src: `data:image/${type};base64,${encodeToBase64(descriptor.resource)}`,
    });
  }
}

export class AudioPlayer {
  static create(container: DomBuilder, descriptor: IResourceDescritor) {
    container.empty();

    const type = AudioResource.getTypeFromBinary(descriptor.resource);
    const audioContainer = $(container).div({
      class: 'audio-player',
    });
    const audio = new Audio(audioContainer.getHTMLElement());

    const base64 = encodeToBase64(descriptor.resource);
    audio.src = `data:audio/${type};base64,${base64}`;
  }
}
