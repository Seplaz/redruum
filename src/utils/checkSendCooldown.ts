export const checkSendCooldown = (
  storageKey: string,
  minIntervalMs: number,
): number => {
  const lastSendAt = Number(localStorage.getItem(storageKey) || "0");
  const now = Date.now();
  const elapsed = now - lastSendAt;

  if (elapsed >= minIntervalMs) {
    return 0;
  }

  return Math.ceil((minIntervalMs - elapsed) / 1000);
};

export const markSent = (storageKey: string) => {
  localStorage.setItem(storageKey, String(Date.now()));
};
