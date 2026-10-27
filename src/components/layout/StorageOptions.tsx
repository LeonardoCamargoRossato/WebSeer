import InfoButton from '../../info-buttons/InfoButton';
import {useI18n} from '../../i18n';
export default function StorageOptions(){
 const {t}=useI18n();
 return <details className="storageOptions"><summary>{t.storage.title}</summary><div className="storagePopover">
  <div className="storageOption"><label><input type="radio" name="storage" checked readOnly/>{t.storage.browser}</label><InfoButton group="common" topic="storage" label={t.storage.browserInfoLabel}/></div>
  <div className="storageOption"><label><input type="radio" name="storage" disabled/>{t.storage.supabase}</label><InfoButton group="common" topic="supabase" label={t.storage.supabaseInfoLabel}/></div>
 </div></details>;
}
