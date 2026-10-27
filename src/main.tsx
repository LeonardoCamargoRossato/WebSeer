import {YouTubeProvider} from './youtube/YouTubeContext';
import {AuthProvider} from './auth/AuthContext';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import {I18nProvider} from './i18n';
import {CorpusProvider} from './context/CorpusContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <AuthProvider><YouTubeProvider><CorpusProvider><App/></CorpusProvider></YouTubeProvider></AuthProvider>
    </I18nProvider>
  </React.StrictMode>
);
