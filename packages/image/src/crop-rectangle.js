import { isObject } from '@cms-apis/utils';

export class CropRectangle {
  constructor({
    x,
    y,
    width,
    height,
  } = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  isCropped() {
    return !this.notCropped();
  }

  notCropped() {
    return this.x === 0 && this.y === 0;
  }

  toString() {
    return ['x', 'y', 'width', 'height'].map((key) => this[key]).join(',');
  }
}

/**
 * Generates a crop rectangle for the given image width, height
 * and crop dimensions.
 *
 * Uses the same scaling logic as Base Platform to properly calculate
 * the crop area.
 */
export default ({ width, height, cropDimensions }) => {
  if (!isObject(cropDimensions)) {
    return new CropRectangle({
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  const coords = ['x1', 'x2', 'y1', 'y2'];
  // ensure all coordinates are present
  if (coords.every((coord) => cropDimensions[coord] == null)) {
    return new CropRectangle({
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  // @see Cygnus\ApplicationBundle\Apps\Management\Controller::cropImageAction
  const scale = width / 640;
  const {
    x1,
    x2,
    y1,
    y2,
  } = coords.reduce((o, key) => {
    const v = Math.round(cropDimensions[key] * scale);
    return { ...o, [key]: v };
  }, {});

  return new CropRectangle({
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
  });
};
