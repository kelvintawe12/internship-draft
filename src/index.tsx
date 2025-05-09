import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import './index.css';
import store from './store';
import { AuthProvider } from './context/AuthContext';

if (process.env.NODE_ENV === 'development') {
  import('./mocks/browser').then(({ worker }) => {
    worker.start({
      onUnhandledRequest: (req) => {
        console.warn(`Unhandled ${req.method} request to ${req.url}`);
      },
    });
  });
}

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Provider store={store}>
            <App />
            <ToastContainer theme="light" position="top-right" autoClose={3000} />
          </Provider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);