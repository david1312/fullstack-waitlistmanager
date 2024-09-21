const activeTimers = new Map<string, NodeJS.Timeout>();

// Start a timer for a specific session and duration (in seconds)
export const startTimer = (
  sessionId: string,
  duration: number,
  onComplete: () => void,
  onTick: (timeLeft: number) => void = () => {}
) => {
  // Check if a timer is already running for this session prevent reset time
  if (activeTimers.has(sessionId)) {
    console.log(
      `Timer already running for session: ${sessionId}, continuing existing timer...`
    );
    return;
  }

  let timeLeft = duration;

  // Set the interval timer
  const timer = setInterval(() => {
    timeLeft -= 1;
    onTick(timeLeft); // Call the onTick callback with the remaining time

    if (timeLeft <= 0) {
      onComplete();
      clearInterval(timer);
      activeTimers.delete(sessionId);
      // Call the onComplete callback when the timer finishes
    }
  }, 1000); // Fire every second

  activeTimers.set(sessionId, timer);
};

// Stop the timer for a specific session
export const stopTimer = (sessionId: string) => {
  if (activeTimers.has(sessionId)) {
    clearTimeout(activeTimers.get(sessionId)!);
    activeTimers.delete(sessionId);
  }
};
