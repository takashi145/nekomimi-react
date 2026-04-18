export type EarAlign = 'left' | 'center' | 'right';

interface Point {
  x: number;
  y: number;
}

interface EarMetrics {
  earHeight: number;
  earWidth: number;
  earHalfWidth: number;
  hSvg: number;
  baseY: number;
  tipY: number;
  shoulderY: number;
  innerHalfWidth: number;
  innerBaseY: number;
  innerTipY: number;
  innerShoulderY: number;
}

export interface EarPaths {
  earL: string;
  earR: string;
  innerL: string;
  innerR: string;
  leftCenter: Point;
  rightCenter: Point;
}

export function getEarMetrics(earScale: number): EarMetrics {
  const earHeight = 12 * earScale;
  const earWidth = 14 * earScale;
  const earHalfWidth = earWidth / 2;
  const hSvg = Math.ceil(earHeight) + 4;
  const baseY = hSvg - 2;
  const tipY = Math.max(1, baseY - earHeight);
  const shoulderY = tipY + earHeight * 0.46;
  const innerHeight = earHeight * 0.58;
  const innerWidth = earWidth * 0.42;
  const innerHalfWidth = innerWidth / 2;
  const innerBaseY = baseY - earHeight * 0.18;
  const innerTipY = innerBaseY - innerHeight;
  const innerShoulderY = innerTipY + innerHeight * 0.5;

  return {
    earHeight,
    earWidth,
    earHalfWidth,
    hSvg,
    baseY,
    tipY,
    shoulderY,
    innerHalfWidth,
    innerBaseY,
    innerTipY,
    innerShoulderY,
  };
}

export function getEarMidX(
  width: number,
  earGap: number,
  earAlign: EarAlign,
  earOffsetX: number,
  earScale: number,
) {
  const { earHalfWidth } = getEarMetrics(earScale);
  const minMid = earHalfWidth * 2 + earGap / 2;
  const maxMid = width - minMid;
  const baseMid =
    earAlign === 'left' ? minMid : earAlign === 'right' ? maxMid : width / 2;

  return Math.min(maxMid, Math.max(minMid, baseMid + earOffsetX));
}

export function buildEarPaths(earGap: number, mid: number, earScale: number): EarPaths {
  const metrics = getEarMetrics(earScale);
  const {
    hSvg,
    earHalfWidth,
    baseY,
    tipY,
    shoulderY,
    innerHalfWidth,
    innerBaseY,
    innerTipY,
    innerShoulderY,
  } = metrics;
  const tipInset = earHalfWidth * 0.2;
  const tipLift = earHalfWidth * 0.12;
  const shoulderScale = 0.78;
  const baseLift = (baseY - tipY) * 0.04;
  const leftX = mid - (earHalfWidth + earGap / 2);
  const rightX = mid + (earHalfWidth + earGap / 2);

  const px = (value: number) => +(value + 1).toFixed(3);
  const py = (value: number) => +value.toFixed(3);
  const svgPoint = (x: number, y: number): Point => ({ x: px(x), y: py(y) });

  function earPath(earX: number) {
    return [
      `M ${px(earX - earHalfWidth)} ${py(baseY)}`,
      `Q ${px(earX - earHalfWidth * shoulderScale)} ${py(shoulderY)} ${px(earX - tipInset)} ${py(tipY)}`,
      `Q ${px(earX)} ${py(tipY - tipLift)} ${px(earX + tipInset)} ${py(tipY)}`,
      `Q ${px(earX + earHalfWidth * shoulderScale)} ${py(shoulderY)} ${px(earX + earHalfWidth)} ${py(baseY)}`,
      `Q ${px(earX)} ${py(baseY + baseLift)} ${px(earX - earHalfWidth)} ${py(baseY)}`,
      'Z',
    ].join(' ');
  }

  function innerPath(earX: number) {
    const innerTipInset = innerHalfWidth * 0.22;

    return [
      `M ${px(earX - innerHalfWidth)} ${py(innerBaseY)}`,
      `Q ${px(earX - innerHalfWidth * 0.72)} ${py(innerShoulderY)} ${px(earX - innerTipInset)} ${py(innerTipY)}`,
      `Q ${px(earX)} ${py(innerTipY - innerHalfWidth * 0.03)} ${px(earX + innerTipInset)} ${py(innerTipY)}`,
      `Q ${px(earX + innerHalfWidth * 0.72)} ${py(innerShoulderY)} ${px(earX + innerHalfWidth)} ${py(innerBaseY)}`,
      'Z',
    ].join(' ');
  }

  const centerY = baseY - (baseY - tipY) * 0.45;

  return {
    earL: earPath(leftX),
    earR: earPath(rightX),
    innerL: innerPath(leftX),
    innerR: innerPath(rightX),
    leftCenter: svgPoint(leftX, centerY),
    rightCenter: svgPoint(rightX, centerY),
  };
}

export function buildEarTransform(offsetX: number, offsetY: number, tilt: number, center: Point) {
  return [
    offsetX !== 0 || offsetY !== 0 ? `translate(${offsetX} ${offsetY})` : '',
    tilt !== 0 ? `rotate(${tilt} ${center.x} ${center.y})` : '',
  ]
    .filter(Boolean)
    .join(' ');
}
