import { useCallback, useState } from "react";

import type { StatusState, StatusType } from "../types/status";

const DEFAULT_DURATION = 4000;

export const useStatus = () => {
  const [status, setStatus] = useState<StatusState>({
    open: false,
    text: "",
    type: "info",
    duration: DEFAULT_DURATION,
  });

  const showStatus = useCallback(
    (text: string, type: StatusType = "info", duration = DEFAULT_DURATION) => {
      setStatus({
        open: true,
        text,
        type,
        duration,
      });
    },
    [],
  );

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
