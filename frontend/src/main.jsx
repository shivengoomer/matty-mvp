import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux';
import {store, persistor} from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import {RouterProvider} from "react-router-dom";
import { ThemeProvider } from './Components/providers/ThemeProvider.jsx'
import { ToastProvider } from './Components/feedback/ToastProvider.jsx'
import { ModalProvider } from './Components/providers/ModalProvider.jsx';
import AppErrorBoundary from './Components/system/AppErrorBoundary.jsx';
import { router } from './app/router.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor} >
        <ThemeProvider>
          <ToastProvider>
            <ModalProvider>
              <AppErrorBoundary>
                <RouterProvider router={router} />
              </AppErrorBoundary>
            </ModalProvider>
          </ToastProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
