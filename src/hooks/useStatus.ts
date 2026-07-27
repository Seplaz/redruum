import { useCallback, useState } from 'react';

type StatusState = {
  open: boolean;
  text: string;
};

export const useStatus = () => {
  const [status, setStatus] = useState<StatusState>({
    open: false,
    text: '',
  });

  const showStatus = useCallback((text: string) => {
    setStatus({
      open: true,
      text,
    });
  }, []);

  const hideStatus = useCallback(() => {
    setStatus((previous) => ({
      ...previous,
      open: false,
    }));
  }, []);

  return {
    status,
    showStatus,
    hideStatus,
  };
};
