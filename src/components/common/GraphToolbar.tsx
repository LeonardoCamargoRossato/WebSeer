import {useI18n} from '../../i18n';

type Props={zoom?:number;onZoomOut?:()=>void;onZoomIn?:()=>void;onFit?:()=>void;onExport?:()=>void};
export default function GraphToolbar({zoom=100,onZoomOut,onZoomIn,onFit,onExport}:Props){
  const {t}=useI18n();
  return <div className="graphToolbar" aria-label="Visualization controls">
    {onZoomOut&&<button aria-label={t.common.zoomOut} onClick={onZoomOut}>−</button>}
    {(onZoomOut||onZoomIn)&&<span>{Math.round(zoom)}%</span>}
    {onZoomIn&&<button aria-label={t.common.zoomIn} onClick={onZoomIn}>+</button>}
    {onFit&&<button onClick={onFit}>{t.common.fit}</button>}
    {onExport&&<button onClick={onExport}>{t.common.export}</button>}
  </div>
}
