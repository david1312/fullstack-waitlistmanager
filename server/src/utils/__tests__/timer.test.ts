import { startTimer, stopTimer } from "../timer";

jest.useFakeTimers();

describe("Timer Utility", () => {
  let onComplete: jest.Mock;
  let onTick: jest.Mock;

  beforeEach(() => {
    // Create mock functions for onComplete and onTick callbacks
    onComplete = jest.fn();
    onTick = jest.fn();
  });

  afterEach(() => {
    jest.clearAllTimers(); // Clears all timers between tests
  });

  it("should start a timer and call onTick for each second and call onComplete when it finished", () => {
    startTimer("test-session", 5, onComplete, false, onTick);
    jest.advanceTimersByTime(3000);
    expect(onTick).toHaveBeenCalledTimes(3);

    // // Ensure the time left is passed correctly to onTick (5, 4, 3...)
    expect(onTick).toHaveBeenNthCalledWith(1, 4); // First tick: 4 seconds left
    expect(onTick).toHaveBeenNthCalledWith(2, 3); // Second tick: 3 seconds left
    expect(onTick).toHaveBeenNthCalledWith(3, 2); // Third tick: 2 seconds left

    jest.advanceTimersByTime(2000);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("should reset the timer if clearTimerBefore is true", () => {
    startTimer("test-session", 5, onComplete, false, onTick);
    jest.advanceTimersByTime(4000);
    // Override the timer with another 5 seconds timer after 4 seconds
    startTimer("test-session", 5, onComplete, true, onTick);

    jest.advanceTimersByTime(3000);
    expect(onComplete).toHaveBeenCalledTimes(0);

    // final time total should be 9 secs and finally after 9 secs onComplete called
    jest.advanceTimersByTime(2000);
    expect(onTick).toHaveBeenCalledTimes(9);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("should continue the timer if clearTimerBefore is false", () => {
    startTimer("test-session", 5, onComplete, false, onTick);
    jest.advanceTimersByTime(4000);
    // Override the timer with another 5 seconds timer after 4 seconds with a false clearTimerBefore
    startTimer("test-session", 5, onComplete, false, onTick);

    // onComplete should have been called
    jest.advanceTimersByTime(1000);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("should stop the timer immediately when stopTimer is called", () => {
    startTimer("test-session", 5, onComplete, false, onTick);
    jest.advanceTimersByTime(1000);
    // Override the timer with another 5 seconds timer after 4 seconds with a false clearTimerBefore
    stopTimer("test-session");

    // onComplete should have been called
    jest.advanceTimersByTime(4000);
    expect(onTick).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledTimes(0);
  });
});
