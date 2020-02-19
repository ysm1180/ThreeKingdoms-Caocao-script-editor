import { $, DomBuilder } from '../../../../../base/browser/domBuilder';

import { AudioPlayer } from '../../../../../base/browser/ui/audio';
import { AudioResource } from '../../../common/audioResource';
import { ImageResource } from '../../../common/imageResource';
import { encodeToBase64 } from '../../../../../base/common/encode';

export interface IBinaryResourceDescritor {
  resource: Buffer;
}

export class BinaryResourceViewer {
  static show(descriptor: IBinaryResourceDescritor, container: DomBuilder) {
    $(container).addClass('resource-viewer');

    if (BinaryResourceViewer.isImageResource(descriptor)) {
      BinaryImageView.create(container, descriptor);
    } else if (BinaryResourceViewer.isAudioResource(descriptor)) {
      BinaryAudioPlayer.create(container, descriptor);
    }
  }

  private static isImageResource(descriptor: IBinaryResourceDescritor): boolean {
    return ImageResource.getTypeFromBinary(descriptor.resource) !== null;
  }

  private static isAudioResource(descriptor: IBinaryResourceDescritor): boolean {
    return AudioResource.getTypeFromBinary(descriptor.resource) !== null;
  }
}

export class BinaryImageView {
  static create(container: DomBuilder, descriptor: IBinaryResourceDescritor) {
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

export class BinaryAudioPlayer {
  static create(container: DomBuilder, descriptor: IBinaryResourceDescritor) {
    container.empty();

    const type = AudioResource.getTypeFromBinary(descriptor.resource);
    const audioContainer = $(container).div({
      class: 'audio-player',
    });
    const audio = new AudioPlayer(audioContainer.getHTMLElement());

    const base64 = encodeToBase64(descriptor.resource);
    audio.src = `data:audio/${type};base64,${base64}`;
  }
}
