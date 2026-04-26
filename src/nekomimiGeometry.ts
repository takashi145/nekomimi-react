// 猫耳の横方向の配置基準を表す型
// 'left'=左寄せ / 'center'=中央 / 'right'=右寄せ / 'space-between'=両端
export type EarAlign = 'left' | 'center' | 'right' | 'space-between';

// SVG座標上の点を表す型
interface Point {
  x: number;
  y: number;
}

// getEarMetrics の返り値。耳の各部位の寸法・Y座標をまとめた構造体
interface EarMetrics {
  earHeight: number;      // 外耳の高さ（px）
  earWidth: number;       // 外耳の幅（px）
  earHalfWidth: number;   // 外耳の半幅（中心からの距離）
  hSvg: number;           // SVG要素の高さ（耳が収まるように余白込み）
  baseY: number;          // 外耳の付け根のY座標（SVG下端寄り）
  tipY: number;           // 外耳の先端のY座標（SVG上端寄り）
  shoulderY: number;      // 外耳の"肩"（左右の膨らみの頂点）のY座標
  innerHalfWidth: number; // 内耳の半幅
  innerBaseY: number;     // 内耳の付け根のY座標（外耳より少し上）
  innerTipY: number;      // 内耳の先端のY座標
  innerShoulderY: number; // 内耳の肩のY座標
}

// buildEarPaths の返り値。左右の外耳・内耳のSVGパス文字列と回転中心点
export interface EarPaths {
  earL: string;        // 左耳（外耳）のSVGパス文字列
  earR: string;        // 右耳（外耳）のSVGパス文字列
  innerL: string;      // 左耳（内耳）のSVGパス文字列
  innerR: string;      // 右耳（内耳）のSVGパス文字列
  leftCenter: Point;   // 左耳の回転中心点（tilt適用時に使用）
  rightCenter: Point;  // 右耳の回転中心点
}

// earScale に基づいて耳の全寸法を計算する。
// earScale = earSize / 12 で正規化されており、12px基準のデフォルト比率を維持しながらスケーリングする。
export function getEarMetrics(earScale: number): EarMetrics {
  // 外耳の高さ・幅（デフォルト比 12:14 を earScale で拡縮）
  const earHeight = 12 * earScale;
  const earWidth = 14 * earScale;
  const earHalfWidth = earWidth / 2;

  // SVG領域の高さ：耳がはみ出さないよう上下に余白（+4px）を確保
  const hSvg = Math.ceil(earHeight) + 4;

  // 付け根はSVG下端から2px上（要素の境界線に接する位置）
  const baseY = hSvg - 2;
  // 先端はbaseYから earHeight 分だけ上（最低1pxでSVG外にはみ出さない）
  const tipY = Math.max(1, baseY - earHeight);
  // 肩（左右の膨らみのピーク）は先端から46%下がった位置
  const shoulderY = tipY + earHeight * 0.46;

  // 内耳は外耳の55%の高さ、42%の幅
  const innerHeight = earHeight * 0.55;
  const innerWidth = earWidth * 0.42;
  const innerHalfWidth = innerWidth / 2;
  // 内耳付け根は外耳付け根より 22% 上（耳の中に浮いて見える）
  const innerBaseY = baseY - earHeight * 0.22;
  const innerTipY = innerBaseY - innerHeight;
  // 内耳の肩は内耳先端から50%下がった位置
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

// left/center/right アライン時に、2つの耳の中心点（midX）をSVG幅内に収まるよう計算する。
// space-between の場合はこの関数を使わず getEarPositions で直接計算する。
export function getEarMidX(
  width: number,
  earGap: number,
  earAlign: EarAlign,
  earOffsetX: number,
  earScale: number,
) {
  const { earHalfWidth } = getEarMetrics(earScale);
  // 2耳が確実に収まる最小・最大の中点
  const minMid = earHalfWidth * 2 + earGap / 2;
  const maxMid = width - minMid;
  // align に応じた基準の中点X
  const baseMid =
    earAlign === 'left' ? minMid : earAlign === 'right' ? maxMid : width / 2;

  // earOffsetX でずらしつつ、SVG幅内にクランプして返す
  return Math.min(maxMid, Math.max(minMid, baseMid + earOffsetX));
}

// 左耳・右耳それぞれの中心X座標を計算する。
// space-between の場合は両端に固定（earOffsetX で平行移動可能）。
// それ以外は getEarMidX で求めた中点を基準に earGap 分だけ左右に広げる。
export function getEarPositions(
  width: number,
  earGap: number,
  earAlign: EarAlign,
  earOffsetX: number,
  earScale: number,
): { leftX: number; rightX: number } {
  const { earHalfWidth } = getEarMetrics(earScale);
  const halfGap = earGap / 2;

  if (earAlign === 'space-between') {
    // 左耳：SVG左端から耳半幅+ギャップ半分だけ内側
    // 右耳：SVG右端から同じ距離だけ内側
    // どちらも earOffsetX で横にずらせる
    return {
      leftX: earHalfWidth + halfGap + earOffsetX,
      rightX: width - earHalfWidth - halfGap + earOffsetX,
    };
  }

  const mid = getEarMidX(width, earGap, earAlign, earOffsetX, earScale);
  return {
    leftX: mid - (earHalfWidth + halfGap),
    rightX: mid + (earHalfWidth + halfGap),
  };
}

// 左右の耳（外耳・内耳）のSVGパス文字列を生成する中心関数。
// すべての形状はSVGの二次ベジェ曲線（Q コマンド）で描画する。
export function buildEarPaths(leftX: number, rightX: number, earScale: number): EarPaths {
  const metrics = getEarMetrics(earScale);
  const {
    earHalfWidth,
    baseY,
    tipY,
    shoulderY,
    innerHalfWidth,
    innerBaseY,
    innerTipY,
    innerShoulderY,
  } = metrics;

  // 先端を中心からわずかに内側に引き込み、ギザつきを防ぐオフセット
  const tipInset = earHalfWidth * 0.2;
  // 先端を少し上に持ち上げ、丸みを出すための値
  const tipLift = earHalfWidth * 0.2;
  // 肩のX方向の引き込み率（0.78 で半幅の78%位置に肩を置く）
  const shoulderScale = 0.78;
  // 付け根をわずかに下に膨らませ、自然なカーブを出すための値
  const baseLift = (baseY - tipY) * 0.04;

  // 小数点3桁に丸めてSVGパス文字列を短縮する
  const px = (value: number) => +value.toFixed(3);
  const py = (value: number) => +value.toFixed(3);
  const svgPoint = (x: number, y: number): Point => ({ x: px(x), y: py(y) });

  // 外耳（アウターシェイプ）のSVGパスを生成する。
  // 描画順序：
  //   M → 付け根左端
  //   Q → 左肩（ベジェ）→ 先端左
  //   Q → 先端中央上（ベジェ）→ 先端右  ※先端の丸みを表現
  //   Q → 右肩（ベジェ）→ 付け根右端
  //   Q → 付け根中央下（ベジェ）→ 付け根左端に戻る ※底辺の軽い膨らみ
  //   Z → パスを閉じる
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

  // 内耳（インナーカラー）のSVGパスを生成する。
  // 外耳より小さく、先端・肩の比率もやや異なる（細身）。
  // 底辺の膨らみは省略し、直線的に閉じる（Z）。
  function innerPath(earX: number) {
    // 内耳先端の左右オフセット（外耳の tipInset に相当）
    const innerTipInset = innerHalfWidth * 0.22;

    return [
      `M ${px(earX - innerHalfWidth)} ${py(innerBaseY)}`,
      `Q ${px(earX - innerHalfWidth * 0.8)} ${py(innerShoulderY)} ${px(earX - innerTipInset)} ${py(innerTipY)}`,
      // 先端中央をごくわずか上に持ち上げてシャープな印象にする
      `Q ${px(earX)} ${py(innerTipY - innerHalfWidth * 0.2)} ${px(earX + innerTipInset)} ${py(innerTipY)}`,
      `Q ${px(earX + innerHalfWidth * 0.8)} ${py(innerShoulderY)} ${px(earX + innerHalfWidth)} ${py(innerBaseY)}`,
      'Z',
    ].join(' ');
  }

  // 耳の回転中心：付け根と先端の間の約45%上の位置（視覚的に自然な回転軸）
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

// 耳に適用するSVG transform 属性文字列を組み立てる。
// translate（位置ずらし）と rotate（傾き）を必要な場合のみ追加し、
// 両方とも不要なら空文字を返す。
export function buildEarTransform(offsetX: number, offsetY: number, tilt: number, center: Point) {
  return [
    // offsetX/Y が 0 でない場合のみ translate を追加
    offsetX !== 0 || offsetY !== 0 ? `translate(${offsetX} ${offsetY})` : '',
    // tilt が 0 でない場合のみ、耳の中心点を軸に rotate を追加
    tilt !== 0 ? `rotate(${tilt} ${center.x} ${center.y})` : '',
  ]
    .filter(Boolean)
    .join(' ');
}
