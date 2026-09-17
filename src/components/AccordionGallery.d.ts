import { CSSProperties, MouseEvent, KeyboardEvent } from 'react';

export interface AccordionGalleryItem {
  id?: number | string;
  video?: string;
  image?: string;
  poster?: string;
  label?: string;
  subtitle?: string;
  tag?: string;
  link?: string;
  alt?: string;
}

export interface AccordionGalleryProps {
  items?: AccordionGalleryItem[];
  defaultIndex?: number;
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: 'horizontal' | 'vertical';
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: 'hover' | 'click';
  showLabels?: boolean;
  grayscale?: boolean;
  className?: string;
  isAudioOn?: boolean;
  onToggleAudio?: () => void;
  onOpenLightbox?: (item: AccordionGalleryItem, index: number) => void;
}

declare const AccordionGallery: React.FC<AccordionGalleryProps>;
export default AccordionGallery;
