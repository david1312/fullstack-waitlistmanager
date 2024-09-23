const activeTimers = new Map<string, NodeJS.Timeout>();

// Start a timer for a specific session and duration (in seconds)
export const startTimer = (
  sessionId: string,
  duration: number,
  onComplete: () => void,
  clearTimerBefore: boolean = false,
  onTick: (timeLeft: number) => void = () => {}
) => {
  // Check if there's an active timer
  if (activeTimers.has(sessionId)) {
    if (!clearTimerBefore) {
      // If not clearing the timer, return and continue the existing timer
      console.log(
        `Timer already running for session: ${sessionId}, continuing existing timer...`
      );
      return;
    } else {
      // Clear the existing timer if clearTimerBefore is true
      clearInterval(activeTimers.get(sessionId));
      activeTimers.delete(sessionId);
      console.log(`Clearing previous timer for session: ${sessionId}`);
    }
  }

  // Initialize timeLeft with the duration for the new timer
  let timeLeft = duration;

  // Set the interval timer
  const timer = setInterval(() => {
    timeLeft -= 1;
    onTick(timeLeft); // Call the onTick callback with the remaining time

    if (timeLeft <= 0) {
      onComplete(); // Call the onComplete callback when the timer finishes
      clearInterval(timer); // Clear the interval when the timer is done
      activeTimers.delete(sessionId); // Remove the timer from activeTimers
    }
  }, 1000); // Fire every second

  // Store the new timer in the activeTimers map
  activeTimers.set(sessionId, timer);
  console.log(`Starting new timer for session: ${sessionId}`);
};

export const stopTimer = (sessionId: string) => {
  if (activeTimers.has(sessionId)) {
    clearTimeout(activeTimers.get(sessionId)!);
    activeTimers.delete(sessionId);
    console.log(`Clean up timer for session: ${sessionId}`);
  }
};
