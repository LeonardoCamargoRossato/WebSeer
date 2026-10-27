import assert from 'node:assert/strict';
import {SOCIAL_CAPTION_LIMIT,newSocialDraft,parseHashtags,socialCaption,validateSocialDraft,exportSocialMetadata} from '../src/video/socialPlatforms.ts';
import {platformOrientation,videoDimensions} from '../src/features/animatedHistogram/videoFormats.ts';

const report={id:'vertical-report',inputs:{terms:['Deus','disse','Eva'],orientation:'vertical',fps:24,framesPerPage:6},data:{terms:['Deus','disse','Eva'],totalPages:3,rows:[{cumulative:[2,1,0]},{cumulative:[2,4,2]},{cumulative:[3,4,3]}]}};
assert.deepEqual(videoDimensions('horizontal'),{width:960,height:540});
assert.deepEqual(videoDimensions('vertical'),{width:540,height:960});
for(const platform of ['youtubeShorts','instagramReels','tiktok'])assert.equal(platformOrientation(platform),'vertical');
assert.equal(platformOrientation('youtube'),'horizontal');

const reels=newSocialDraft('instagramReels',report,'Gênesis_PT_BR.pdf');
assert.equal(reels.platform,'instagramReels');
assert.match(reels.title,/Gênesis PT BR/);
assert.match(reels.caption,/Deus: 3 · disse: 4 · Eva: 3/);
assert.match(reels.caption,/By Leonardo Camargo Rossato/);
assert.equal(reels.shareToFeed,true);
assert.deepEqual(validateSocialDraft(reels),[]);
assert.deepEqual(parseHashtags('##WebSeer, #WebSeer; AnáliseDeTexto #Dados'),['#WebSeer','#AnáliseDeTexto','#Dados']);
assert.equal(socialCaption({...reels,caption:'  Palavras em movimento.  ',hashtags:'Dados, WebSeer'}),'Palavras em movimento.\n\n#Dados #WebSeer');

const reelsPlan=exportSocialMetadata({...reels,collaborators:'@ana, bruno',locationId:'12345',coverTimestampMs:1500},report);
assert.equal(reelsPlan.mode,'local-planning-only');
assert.equal(reelsPlan.apiConnected,false);
assert.equal(reelsPlan.attribution.by,'By Leonardo Camargo Rossato');
assert.equal(reelsPlan.source.reportId,report.id);
assert.equal(reelsPlan.source.aspectRatio,'9:16');
assert.equal(reelsPlan.source.pageAnimationSeconds,.75);
assert.deepEqual(reelsPlan.metadata.collaborators,['ana','bruno']);
assert.equal(reelsPlan.metadata.location_id,'12345');
assert.equal(reelsPlan.metadata.share_to_feed,true);
assert.equal(reelsPlan.metadata.thumb_offset_ms,1500);
assert.equal('title'in reelsPlan.metadata,false,'A local project title must not be presented as an Instagram title field');
assert.ok(reelsPlan.requiredBeforePublishing.length>0);
assert.ok(reelsPlan.references.every(url=>/^https:\/\//.test(url)));

const tiktok=newSocialDraft('tiktok',report,'Timeline.pdf',true);
assert.equal(tiktok.privacyLevel,'','Do not assume account-specific privacy without creator authorization');
assert.ok(validateSocialDraft(tiktok,true).some(error=>error.includes('privacy')));
const privateTikTok={...tiktok,privacyLevel:'SELF_ONLY'};
assert.deepEqual(validateSocialDraft(privateTikTok,true),[]);
assert.equal(privateTikTok.allowComments,false);
assert.equal(privateTikTok.allowDuet,false);
assert.equal(privateTikTok.allowStitch,false);
const tiktokPlan=exportSocialMetadata({...privateTikTok,coverTimestampMs:2000,allowComments:true,allowDuet:false,allowStitch:true,ownBrand:true,aiGenerated:true},report);
assert.equal(tiktokPlan.mode,'local-planning-only');
assert.equal(tiktokPlan.apiConnected,false);
assert.equal(tiktokPlan.metadata.title,socialCaption(privateTikTok));
assert.equal(tiktokPlan.metadata.privacy_level,'SELF_ONLY');
assert.equal(tiktokPlan.metadata.disable_comment,false);
assert.equal(tiktokPlan.metadata.disable_duet,true);
assert.equal(tiktokPlan.metadata.disable_stitch,false);
assert.equal(tiktokPlan.metadata.video_cover_timestamp_ms,2000);
assert.equal(tiktokPlan.metadata.brand_organic_toggle,true);
assert.equal(tiktokPlan.metadata.is_aigc,true);
assert.ok(tiktokPlan.requiredBeforePublishing.some(item=>item.includes('creator_info')));
assert.ok(validateSocialDraft({...privateTikTok,paidPartnership:true},true).some(error=>error.includes('Only me')));

assert.equal(SOCIAL_CAPTION_LIMIT,2200);
for(const invalid of [
 {...reels,title:''},
 {...reels,title:'a'.repeat(151)},
 {...reels,caption:''},
 {...reels,caption:'a'.repeat(2201),hashtags:''},
 {...reels,hashtags:'#bad-tag'},
 {...reels,coverTimestampMs:-1},
 {...reels,coverTimestampMs:NaN},
 {...reels,locationId:'not-an-id'},
 {...reels,collaborators:'@name with spaces'}
])assert.ok(validateSocialDraft(invalid).length>0,'Invalid metadata must show a validation message');
assert.deepEqual(validateSocialDraft({...reels,caption:'😀'.repeat(2200),hashtags:''}),[],'Caption limits count Unicode characters rather than UTF-16 units');
assert.ok(validateSocialDraft({...reels,caption:'x'.repeat(2197),hashtags:'#dados'}).length>0,'Hashtags share the caption character budget');
console.log('PASS: real orientation dimensions, platform-specific local presets and metadata, caption/hashtag limits, creator-dependent TikTok privacy, interaction mapping, disclosures, validation and export attribution.');
