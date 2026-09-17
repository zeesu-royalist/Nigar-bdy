import { CSSProperties, ReactNode, ComponentType } from 'react';

export interface ScrollExpandProps {
  src?: string;
  mediaType?: 'image' | 'video';
  poster?: string;
  alt?: string;
  title?: string;
  scrollHint?: string;
  startWidth?: number;
  startHeight?: number;
  startRadius?: number;
  endRadius?: number;
  mediaZoom?: number;
  scrollDistance?: number;
  holdDistance?: number;
  smoothing?: number;
  overlayScrim?: number;
  useWindowScroll?: boolean;
  enabled?: boolean;
  objectFit?: 'cover' | 'contain';
  ambientBackdrop?: boolean;
  ambientBlur?: string;
  ambientOpacity?: string;
  children?: ReactNode;

  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}

export declare const ScrollExpand: ComponentType<ScrollExpandProps>;
export default ScrollExpand;
