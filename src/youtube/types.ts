export type YouTubeChannel={id:string;title:string;thumbnail?:string};
export type YouTubePlaylist={id:string;title:string;channelId:string};
export type YouTubeTarget={channelId:string;channelTitle:string;playlistId?:string;playlistTitle?:string};
export type YouTubePublication={videoId:string;url:string;channelId:string;channelTitle:string;title:string;createdAt:string;requestedPrivacy:string;privacyStatus?:string;processingStatus?:string;playlistId?:string;playlistAdded?:boolean;thumbnailAdded?:boolean;warnings:string[]};
export type YouTubeAttempt={id:string;startedAt:string;state:'uploading'|'uncertain'|'failed';message?:string};
export const YOUTUBE_SCOPE='https://www.googleapis.com/auth/youtube.force-ssl';
