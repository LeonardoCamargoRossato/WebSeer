import {useI18n} from '../../i18n';
import {AUTHOR_NAME,PORTFOLIO_URL} from '../../config/author';
export default function Attribution(){
 const {locale}=useI18n();
 return <footer className="appAttribution"><span>{locale==='pt-BR'?'Esta aplicação foi feita por':'This application was created by'} <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">{AUTHOR_NAME}</a></span><span className="attributionDivider" aria-hidden="true">|</span><a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">{locale==='pt-BR'?'Portfólio LCR':'LCR Portfolio'} <span aria-hidden="true">↗</span></a></footer>;
}
