import {useI18n} from '../../i18n';
import InfoButton from '../../info-buttons/InfoButton';
import {formatBytes,type LibraryUsage} from '../../storage/storageMetrics';
export default function StorageCapacity({estimate,usage,error}:{estimate?:StorageEstimate;usage?:LibraryUsage;error?:boolean}){
 const {locale}=useI18n();const en=locale==='en-US',tr=(pt:string,eng:string)=>en?eng:pt;
 const known=typeof estimate?.quota==='number'&&estimate.quota>0&&typeof estimate.usage==='number';
 return <aside className="storageCapacity surface" aria-label={tr('Capacidade do armazenamento','Storage capacity')}><span>{tr('Armazenamento do navegador','Browser storage')} <InfoButton group="history" topic="capacity"/></span><strong className="storageCapacityValue">{known?`${formatBytes(estimate!.usage,locale)} / ${formatBytes(estimate!.quota,locale)}`:tr('Cota não informada','Quota not reported')}</strong><small>{tr('Uso da origem / cota estimada','Origin usage / estimated quota')}</small>{known&&<progress aria-label={tr('Uso da cota estimada','Estimated quota usage')} max={estimate!.quota} value={Math.min(estimate!.usage!,estimate!.quota!)}/>}<p>{tr('Conteúdo WebSeer estimado','Estimated WebSeer content')}: <b>{formatBytes(usage?.total,locale)}</b></p>{error&&<p>{tr('Não foi possível atualizar a estimativa.','Could not refresh estimate.')}</p>}</aside>;
}
