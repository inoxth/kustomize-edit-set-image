import { Image } from './types';

function splitFirstPartsAndNewTag(directive: string): [string, string | undefined] {
  const lastIndexOfColon = directive.lastIndexOf(':');
  const lastIndexOfAt = directive.lastIndexOf('@');

  if (lastIndexOfColon < 0 && lastIndexOfAt < 0) {
    return [directive, undefined];
  }

  if (lastIndexOfAt > 0) {
    return [
      directive.substring(0, lastIndexOfAt),
      directive.substring(lastIndexOfAt + 1),
    ];
  }

  if (lastIndexOfColon > 0) {
    return [
      directive.substring(0, lastIndexOfColon),
      directive.substring(lastIndexOfColon + 1),
    ];
  }

  throw new Error('Invalid set image format. Unexpected image newTag');
}

function splitImageAndNewImage(directiveWithoutNewTag: string): [string, string | undefined] {
  const names = directiveWithoutNewTag.split('=');

  if (names.length === 1) {
    return [names[0], undefined];
  }

  if (names.length === 2) {
    return [names[0], names[1]];
  }

  throw new Error('Invalid set image format. Unexpected image name or newName.');
}

export function parseSetImageDirective(directive: string): Image {
  let name: string;
  let newName: string | undefined;
  let newTag: string | undefined;

  try {
    let firstParts: string;

    [firstParts, newTag] = splitFirstPartsAndNewTag(directive);
    [name, newName] = splitImageAndNewImage(firstParts);
  } catch (err) {
    // Rethrow the message with provided directive for better error message.
    throw new Error(`${err.message} [${directive}]`);
  }

  if (!newName && !newTag) {
    throw new Error('Invalid set image format. At least newName or newTag required.');
  }

  const image:Image = { name };
  if (newName) {
    image.newName = newName;
  }
  if (newTag) {
    image.newTag = newTag;
  }
  return image;
}

export default parseSetImageDirective;
