import {
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { ToastContext } from './toast-context';

interface ToastMessage {
  id: number;
  message: string;
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setMessages((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setMessages((current) => current.filter((item) => item.id !== id));
    }, 3600);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {messages.map((item) => (
          <div className="toast" key={item.id}>
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
