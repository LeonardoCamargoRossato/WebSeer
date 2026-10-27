import type {PublishingQueueItem} from './types';
/** Future server-side videos.update payload. OAuth tokens and secrets never belong here. */
export function youtubePublishAtPlan(item:PublishingQueueItem,videoId:string){return{videoId,prerequisite:'Upload as private before scheduling',request:{part:['status'],body:{id:videoId,status:{privacyStatus:'private',publishAt:item.scheduledAt}}}}}
