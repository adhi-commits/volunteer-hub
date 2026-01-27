import React from 'react';
import type { ToastState } from '../hooks/useToast';

interface Props {
  toast: ToastState | null;
}

const Toast: React.FC<Props> = ({ toast }) => {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const bg = isSuccess ? 'bg-green-500' : 'bg-red-500';

  return (
    <div
      className={`${bg} fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white transform transition-all duration-300`}
    >
      {toast.message}
    </div>
  );
};

export default Toast;
