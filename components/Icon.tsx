import React from 'react';
import {
  Type,
  AlignLeft,
  ArrowDownAZ,
  ArrowUpAZ,
  Hash,
  ArrowRightFromLine,
  Minimize2,
  XSquare,
  Wand2,
  Lock,
  Copy,
  Download,
  Trash2,
  Eraser,
  RefreshCw,
  Sparkles,
  Bold,
  Italic,
  Underline,
  Share2
} from 'lucide-react';

export const IconMap: Record<string, React.FC<any>> = {
  'minimize': Minimize2,
  'x-square': XSquare,
  'type': Type,
  'align-left': AlignLeft,
  'sort-az': ArrowDownAZ,
  'sort-za': ArrowUpAZ,
  'hash': Hash,
  'tabs': ArrowRightFromLine,
  'wand': Wand2,
  'lock': Lock,
  'copy': Copy,
  'download': Download,
  'trash': Trash2,
  'eraser': Eraser,
  'refresh': RefreshCw,
  'sparkles': Sparkles,
  'bold': Bold,
  'italic': Italic,
  'underline': Underline,
  'share': Share2
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 18, className }) => {
  const IconComponent = IconMap[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
};