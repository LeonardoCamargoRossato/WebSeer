export type VideoOrientation='horizontal'|'vertical';
export type PublicationPlatform='youtube'|'youtubeShorts'|'instagramReels'|'tiktok';

export function videoDimensions(orientation:VideoOrientation='horizontal'){
 return orientation==='vertical'?{width:540,height:960}:{width:960,height:540};
}
export function platformOrientation(platform:PublicationPlatform):VideoOrientation{
 return platform==='youtube'?'horizontal':'vertical';
}
