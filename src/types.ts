export interface BrandAsset {
  medium: 'Billboard' | 'Newspaper' | 'Social Post';
  tagline: string;
  imagePrompt: string;
  imageUrl?: string;
  loading?: boolean;
}

export interface BrandProfile {
  productName: string;
  description: string;
  visualIdentity: string;
  targetAudience: string;
  brandVoice: string;
  assets: BrandAsset[];
}
