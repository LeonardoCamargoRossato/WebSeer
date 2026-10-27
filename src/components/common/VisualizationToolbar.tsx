import InfoButton from '../../info-buttons/InfoButton';
import type {RefObject} from 'react';
import {useI18n} from '../../i18n';

type Props={
  zoom?:number;
  onZoomOut?:()=>void;
  onZoomIn?:()=>void;
  onFit?:()=>void;
  onExport?:()=>void;
  targetRef?:RefObject<HTMLElement | null>;
};

export default function VisualizationToolbar({zoom=100,onZoomOut,onZoomIn,onFit,onExport,targetRef}:Props){
  const {t}=useI18n();
  const toggleFullscreen=async()=>{
    const target=targetRef?.current;
    if(!target)return;
    try{
      if(document.fullscreenElement) await document.exitFullscreen();
      else if(target.requestFullscreen) await target.requestFullscreen();
      else target.classList.toggle('fullscreenFallback');
    }catch{
      target.classList.toggle('fullscreenFallback');
    }
  };
  return <div className="graphToolbar" aria-label={t.common.visualizationControls}>
    <InfoButton group="common" topic="visualization"/>{onZoomOut&&<button aria-label={t.common.zoomOut} title={t.common.zoomOut} onClick={onZoomOut}>−</button>}
    {(onZoomOut||onZoomIn)&&<span>{Math.round(zoom)}%</span>}
    {onZoomIn&&<button aria-label={t.common.zoomIn} title={t.common.zoomIn} onClick={onZoomIn}>+</button>}
    {onFit&&<button onClick={onFit}>{t.common.fit}</button>}
    {targetRef&&<button onClick={toggleFullscreen}>{t.common.fullscreen}</button>}
    {onExport&&<button onClick={onExport}>{t.common.export}</button>}
  </div>
}
