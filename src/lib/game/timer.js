//  Usage example
//   const [time, setTime] = useState(0);
//   const [isRunning, setIsRunning] = useState(false);
//   const intervalRef = useRef(null);

const now = () =>
  typeof performance !== "undefined" ? performance.now() : Date.now();

const getIntervalId = (intervalRef) => {
  const current = intervalRef.current;

  if (current && typeof current === "object" && "id" in current) {
    return current.id;
  }

  return current;
};

export const clearTimer = (intervalRef) => {
  const intervalId = getIntervalId(intervalRef);
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalRef.current = null;
};

export const handleStart = (isRunning, setIsRunning, intervalRef, setTime) => {
  if (isRunning || getIntervalId(intervalRef)) return;

  const startedAt = now();
  const tick = () => {
    setTime(Math.max(0, Math.round(now() - startedAt)));
  };

  setIsRunning(true);
  tick();
  intervalRef.current = {
    id: setInterval(tick, 50),
    startedAt,
  };
};

export const handleStop = (isRunning, setIsRunning, intervalRef) => {
  if (!isRunning) return;
  setIsRunning(false);
  clearTimer(intervalRef);
};

export const handleReset = (setIsRunning, intervalRef, setTime) => {
  setIsRunning(false);
  clearTimer(intervalRef);
  setTime(0);
};

export const handleSplit = (isRunning, time) => {
  if (!isRunning) return;
  return `${formatTime(time)}`;
};

const formatTime = (ms) => {
  const totalSeconds = String(Math.floor(ms / 1000)).padStart(2, "0");
  const centiseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
  return `${totalSeconds}.${centiseconds}`;
};
