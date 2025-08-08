/**
 * TypeScript definitions for Violet Room Overlays
 * Generated for violetRoomOverlays.json
 */

export interface OverlayMetadata {
  /** Emotional/atmospheric quality of the overlay */
  tone: 'mystical' | 'ethereal' | 'atmospheric' | 'philosophical' | 'poetic' | 'reverent' | 'contemplative' | 'transformative';
  
  /** Suggested UI placement context */
  placement: string;
  
  /** Recommended display duration */
  duration: 'short' | 'medium' | 'long';
}

export interface VioletOverlay {
  /** Unique, descriptive identifier (snake_case) */
  id: string;
  
  /** Functional category for grouping and filtering */
  category: 'entrance' | 'communication' | 'navigation' | 'access' | 'interaction' | 'storage' | 'reflection' | 'transition';
  
  /** The actual overlay content */
  text: string;
  
  /** Additional properties for implementation */
  metadata: OverlayMetadata;
}

export interface VioletOverlaysData {
  /** Meta information about the overlay content */
  _meta: {
    /** Purpose and context of the overlay content */
    description: string;
    
    /** Semantic version for tracking changes */
    version: string;
    
    /** Date of last content update */
    lastUpdated: string;
    
    /** Detailed usage context and purpose */
    usage: string;
  };
  
  /** Array of overlay objects */
  overlays: VioletOverlay[];
}

// Re-export for convenience
export type OverlayCategory = VioletOverlay['category'];
export type OverlayTone = OverlayMetadata['tone'];
export type OverlayDuration = OverlayMetadata['duration'];