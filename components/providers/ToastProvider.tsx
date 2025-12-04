
'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        success: {
          style: {
            background: '#10B981',
          },
        },
        error: {
          style: {
            background: '#EF4444',
          },
        },
        loading: {
          style: {
            background: '#8B5CF6',
          },
        },
      }}
    />
  );
}