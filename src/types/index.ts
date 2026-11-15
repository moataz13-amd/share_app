export type Platform='YouTube'|'Instagram'|'TikTok'|'Facebook'|'X'|'Reddit'|'Vimeo'|'Other';
export type Video={id:string;user_id:string;original_url:string;normalized_url:string;platform:Platform;title:string;description:string|null;thumbnail_url:string|null;author_name:string|null;created_at:string;updated_at:string};
export type Collection={id:string;user_id:string;name:string;description:string|null;icon:string;created_at:string;updated_at:string};
