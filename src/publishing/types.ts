export type PublishingPlatform='youtube'|'instagram'|'tiktok';
export type PublishingContentType='short'|'video';
export type PublishingStatus='draft'|'scheduled'|'published'|'failed';
export type ScheduleSlot={weekday:number;time:string};
export type PublishingSchedule={id:string;platform:PublishingPlatform;contentType:PublishingContentType;weekdays:number[];publicationTimes:string[];slots:ScheduleSlot[];timezone:string;createdAt:string;updatedAt:string};
export type PublishingQueueItem={id:string;scheduleId:string;videoId:string;platform:PublishingPlatform;contentType:PublishingContentType;position:number;scheduledAt:string;timezone:string;status:PublishingStatus;createdAt:string;updatedAt:string};
export const DEFAULT_TIMEZONE='America/Sao_Paulo';
export const PLATFORM_LABELS:Record<PublishingPlatform,string>={youtube:'YouTube',instagram:'Instagram',tiktok:'TikTok'};
