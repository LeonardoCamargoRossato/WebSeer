import type {Report} from '../storage/archive';
import {AUTHOR_BYLINE,EXPORT_ATTRIBUTION,PORTFOLIO_URL} from '../config/author.ts';

export type SocialPlatform='instagramReels'|'tiktok';
export type SocialPrivacy=''|'PUBLIC_TO_EVERYONE'|'MUTUAL_FOLLOW_FRIENDS'|'FOLLOWER_OF_CREATOR'|'SELF_ONLY';
/** These are editable local plans. Account-specific API permissions are not inferred. */
export type SocialDraft={
 platform:SocialPlatform;title:string;caption:string;hashtags:string;shareToFeed:boolean;
 coverTimestampMs:number;collaborators:string;locationId:string;privacyLevel:SocialPrivacy;
 allowComments:boolean;allowDuet:boolean;allowStitch:boolean;ownBrand:boolean;
 paidPartnership:boolean;aiGenerated:boolean;notes:string;
};
export const SOCIAL_CAPTION_LIMIT=2200;
export const SOCIAL_SOURCES={
 instagramReels:'https://developers.facebook.com/docs/instagram-platform/content-publishing/',
 instagramFields:'https://github.com/facebook/facebook-python-business-sdk/blob/main/facebook_business/adobjects/iguser.py',
 tiktok:'https://developers.tiktok.com/doc/content-posting-api-reference-direct-post',
 tiktokCreator:'https://developers.tiktok.com/doc/content-posting-api-reference-query-creator-info/',
 shorts:'https://support.google.com/youtube/answer/15424877',
 youtubeUpload:'https://developers.google.com/youtube/v3/docs/videos/insert'
} as const;
export function socialPlatformName(platform:SocialPlatform){return platform==='instagramReels'?'Instagram Reels':'TikTok'}
export function parseHashtags(value:string){return [...new Set(value.split(/[\s,;]+/).map(tag=>tag.trim().replace(/^#+/,'')).filter(Boolean).map(tag=>`#${tag}`))]}
export function socialCaption(value:Pick<SocialDraft,'caption'|'hashtags'>){const tags=parseHashtags(value.hashtags);return[value.caption.trim(),tags.join(' ')].filter(Boolean).join('\n\n')}
const count=(value:string)=>Array.from(value).length;
const truncate=(value:string,limit:number)=>count(value)>limit?Array.from(value).slice(0,limit-1).join('')+'…':value;
export function newSocialDraft(platform:SocialPlatform,report:Pick<Report,'inputs'|'data'>,documentName:string,en=false):SocialDraft{
 const data=report.data as {terms?:string[];rows?:{cumulative:number[]}[];totalPages?:number};
 const terms=data.terms??(Array.isArray(report.inputs.terms)?report.inputs.terms as string[]:[]),totals=data.rows?.length?data.rows[data.rows.length-1].cumulative:[];
 const name=documentName.replace(/\.[^.]+$/,'').replace(/_/g,' ').trim()||'WebSeer';
 const title=truncate(`${name}: ${en?'words in motion':'palavras em movimento'} | WebSeer`,150);
 const caption=en?`How do words appear across “${name}”?\n\n${terms.map((term,index)=>`${term}: ${totals[index]??'not provided'}`).join(' · ')}\nPages/sections: ${data.totalPages??data.rows?.length??'not provided'}.\n\nCumulative whole-word counts; case-insensitive, accents preserved. A descriptive visualization, without AI interpretation.\n\n${AUTHOR_BYLINE}\n${PORTFOLIO_URL}`:`Como as palavras aparecem ao longo de “${name}”?\n\n${terms.map((term,index)=>`${term}: ${totals[index]??'não informado'}`).join(' · ')}\nPáginas/seções: ${data.totalPages??data.rows?.length??'não informado'}.\n\nContagem acumulada de palavras inteiras, sem distinguir maiúsculas e preservando acentos. Visualização descritiva, sem interpretação por IA.\n\n${AUTHOR_BYLINE}\n${PORTFOLIO_URL}`;
 return{platform,title,caption:truncate(caption,1900),hashtags:en?'#WebSeer #TextAnalysis #DataVisualization':'#WebSeer #AnáliseDeTexto #VisualizaçãoDeDados',shareToFeed:true,coverTimestampMs:0,collaborators:'',locationId:'',privacyLevel:'',allowComments:false,allowDuet:false,allowStitch:false,ownBrand:false,paidPartnership:false,aiGenerated:false,notes:''};
}
export function validateSocialDraft(value:SocialDraft,en=false){
 const tr=(pt:string,eng:string)=>en?eng:pt,errors:string[]=[];
 if(!value.title.trim()||count(value.title)>150)errors.push(tr('Nome do projeto: preencha até 150 caracteres.','Project name: enter up to 150 characters.'));
 if(!value.caption.trim()||count(socialCaption(value))>SOCIAL_CAPTION_LIMIT)errors.push(tr('Legenda e hashtags: preencha até 2.200 caracteres no total.','Caption and hashtags: enter up to 2,200 characters in total.'));
 if(parseHashtags(value.hashtags).some(tag=>!/^#[\p{L}\p{N}_]+$/u.test(tag)))errors.push(tr('Hashtags: use letras, números e sublinhado; separe por espaços ou vírgulas.','Hashtags: use letters, numbers and underscores; separate with spaces or commas.'));
 if(!Number.isFinite(value.coverTimestampMs)||value.coverTimestampMs<0)errors.push(tr('Quadro da capa: informe um tempo igual ou maior que zero.','Cover frame: enter a time of zero or greater.'));
 if(value.platform==='instagramReels'&&value.locationId&&!/^\d+$/.test(value.locationId))errors.push(tr('Localização: informe um ID numérico do Instagram ou deixe em branco.','Location: enter a numeric Instagram ID or leave blank.'));
 if(value.platform==='instagramReels'&&value.collaborators.split(/[,\n]/).map(name=>name.trim()).filter(Boolean).some(name=>!/^@?[A-Za-z0-9._]+$/.test(name)))errors.push(tr('Colaboradores: use nomes de usuário separados por vírgulas.','Collaborators: use comma-separated usernames.'));
 if(value.platform==='tiktok'&&!value.privacyLevel)errors.push(tr('Escolha uma privacidade planejada para o TikTok; a conta deverá confirmá-la na integração futura.','Choose planned TikTok privacy; the account must confirm it during future integration.'));
 if(value.platform==='tiktok'&&value.paidPartnership&&value.privacyLevel==='SELF_ONLY')errors.push(tr('Parceria paga no TikTok não pode ser planejada como Somente eu.','TikTok paid partnership cannot be planned as Only me.'));
 return errors;
}
export function exportSocialMetadata(value:SocialDraft,report?:Pick<Report,'id'|'inputs'|'data'>){
 const data=report?.data as {totalPages?:number;rows?:unknown[]}|undefined;
 const fps=Number(report?.inputs.fps),frames=Number(report?.inputs.framesPerPage),pages=data?.totalPages??data?.rows?.length;
 return{
  formatVersion:1,platform:value.platform,mode:'local-planning-only',apiConnected:false,attribution:EXPORT_ATTRIBUTION,
  source:{reportId:report?.id,orientation:'vertical',aspectRatio:'9:16',...(pages&&fps>0&&frames>0?{pageAnimationSeconds:pages*frames/fps}:{})},
  localProjectTitle:value.title,
  metadata:value.platform==='instagramReels'?{caption:socialCaption(value),share_to_feed:value.shareToFeed,thumb_offset_ms:value.coverTimestampMs,collaborators:value.collaborators.split(/[,\n]/).map(name=>name.trim().replace(/^@/, '')).filter(Boolean),location_id:value.locationId||undefined,is_paid_partnership:value.paidPartnership,is_ai_generated:value.aiGenerated}:{title:socialCaption(value),privacy_level:value.privacyLevel||undefined,disable_comment:!value.allowComments,disable_duet:!value.allowDuet,disable_stitch:!value.allowStitch,video_cover_timestamp_ms:value.coverTimestampMs,brand_organic_toggle:value.ownBrand,brand_content_toggle:value.paidPartnership,is_aigc:value.aiGenerated},
  planningNotes:value.notes,
  requiredBeforePublishing:value.platform==='instagramReels'?['Connect an eligible Instagram account and authorize publishing.','Prepare/upload video and cover media; local attachment names are not public URLs.','Confirm current media specifications, account capabilities and publication settings.']:['Connect the creator and query creator_info for supported privacy, interactions and maximum video duration.','Require creator confirmation and applicable commercial-content declarations.','Initialize upload with supported media and current platform permissions.'],
  references:value.platform==='instagramReels'?[SOCIAL_SOURCES.instagramReels,SOCIAL_SOURCES.instagramFields]:[SOCIAL_SOURCES.tiktok,SOCIAL_SOURCES.tiktokCreator]
 };
}
