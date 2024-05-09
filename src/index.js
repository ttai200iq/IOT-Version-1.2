import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { LanguageProvider } from './component/Context/LanguageProvider'
import { AlertContextProvider } from './component/Context/AlertContext'

import "../node_modules/react-bootstrap/dist/react-bootstrap"
import "../node_modules/bootstrap/dist/css/bootstrap.css"
import { SettingContextProvider } from './component/Context/SettingContext';
import { ToolContextProvider } from './component/Context/ToolContext';
import { OverviewContextProvider } from './component/Context/OverviewContext';
import { Provider } from 'react-redux';
import rootstore from './component/Redux/rootStore';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={rootstore}>
        <SettingContextProvider>
          <OverviewContextProvider>
              <ToolContextProvider>
                <LanguageProvider>
                  <AlertContextProvider>
                    <App />
                  </AlertContextProvider>
                </LanguageProvider>
              </ToolContextProvider>
          </OverviewContextProvider>
        </SettingContextProvider>
    </Provider>
  </React.StrictMode>
);


