import { useRef } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import {
  buildEarPaths,
  buildEarTransform,
  getEarMetrics,
  getEarPositions,
} from './nekomimiGeometry';
import type { EarAlign } from './nekomimiGeometry';
import { useElementWidth } from './useElementWidth';

const INNER_EAR_COLOR = 'rgba(190,90,130,0.5)';
const CONTENT_STYLE = { display: 'inline-block' } as const;

export interface NekomimiProps {
  children: ReactNode;
  earGap?: number;
  earColor?: string;
  earAlign?: EarAlign;
  earOffsetX?: number;
  leftEarOffsetX?: number;
  rightEarOffsetX?: number;
  leftEarOffsetY?: number;
  rightEarOffsetY?: number;
  earScale?: number;
  earTilt?: number;
  leftEarTilt?: number;
  rightEarTilt?: number;
  earInset?: number;
  showEars?: boolean;
  style?: CSSProperties;
  className?: string;
  earsStyle?: CSSProperties;
  earsClassName?: string;
}

export function Nekomimi({
  children,
  earGap = 10,
  earColor = '#ffffff',
  earAlign = 'center',
  earOffsetX = 0,
  leftEarOffsetX = 0,
  rightEarOffsetX = 0,
  leftEarOffsetY = 0,
  rightEarOffsetY = 0,
  earScale = 1,
  earTilt = 0,
  leftEarTilt,
  rightEarTilt,
  earInset = 0,
  showEars = true,
  style,
  className,
  earsStyle,
  earsClassName,
}: NekomimiProps) {
  const ref = useRef<HTMLDivElement>(null);
  const width = useElementWidth(ref);

  const { hSvg } = getEarMetrics(earScale);
  const overlap = Math.max(0, earInset + 2);
  const shouldRenderEars = showEars && width > 0;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: 'fit-content',
        maxWidth: '100%',
        justifySelf: 'start',
        ...style,
      }}
    >
      {shouldRenderEars && (() => {
        const { leftX, rightX } = getEarPositions(width, earGap, earAlign, earOffsetX, earScale);
        const { earL, earR, innerL, innerR, leftCenter, rightCenter } = buildEarPaths(
          leftX,
          rightX,
          earScale,
        );
        const resolvedLeftTilt = leftEarTilt ?? earTilt;
        const resolvedRightTilt = rightEarTilt ?? earTilt;
        const leftTransform = buildEarTransform(
          leftEarOffsetX,
          leftEarOffsetY,
          resolvedLeftTilt,
          leftCenter,
        );
        const rightTransform = buildEarTransform(
          rightEarOffsetX,
          rightEarOffsetY,
          resolvedRightTilt,
          rightCenter,
        );
        return (
          <svg
            className={earsClassName}
            style={{ position: 'absolute', left: 0, bottom: `calc(100% - ${overlap}px)`, pointerEvents: 'none', overflow: 'visible', ...earsStyle }}
            width={width}
            height={hSvg}
            aria-hidden
          >
            <path
              d={earL}
              fill={earColor}
              transform={leftTransform || undefined}
            />
            <path
              d={earR}
              fill={earColor}
              transform={rightTransform || undefined}
            />
            <path
              d={innerL}
              fill={INNER_EAR_COLOR}
              transform={leftTransform || undefined}
            />
            <path
              d={innerR}
              fill={INNER_EAR_COLOR}
              transform={rightTransform || undefined}
            />
          </svg>
        );
      })()}
      <div style={CONTENT_STYLE}>{children}</div>
    </div>
  );
}
