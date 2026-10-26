import {useI18n} from '../../i18n';
export default function StorageOptions(){
 const {t}=useI18n();
 return <details className="storageOptions"><summary>{t.storage.title}</summary><div className="storagePopover">
  <div className="storageOption"><label><input type="radio" name="storage" checked readOnly/>{t.storage.browser}</label><details><summary aria-label={t.storage.browserInfoLabel}>ⓘ</summary><p>{t.storage.browserInfo}</p></details></div>
  <div className="storageOption"><label><input type="radio" name="storage" disabled/>{t.storage.supabase}</label><details><summary aria-label={t.storage.supabaseInfoLabel}>ⓘ</summary><p>{t.storage.supabaseInfo}</p></details></div>
 </div></details>;
}
