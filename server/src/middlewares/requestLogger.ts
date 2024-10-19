import { Request, Response, NextFunction } from "express";

// Enhanced request logger middleware
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = new Date();

  // Listener to log the response status after it has been sent
  res.on("finish", () => {
    const endTime = new Date();
    const responseTime = endTime.getTime() - startTime.getTime();
    const logLevel = res.statusCode >= 400 ? "error" : "info";
    const logMessage = JSON.stringify({
      level: logLevel,
      timestamp: startTime.toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
    });

    // Log error to the console if status is 400 or greater
    if (res.statusCode >= 400) {
      console.error(logMessage);
    } else {
      console.log(logMessage);
    }
  });

  next(); // Continue to the next middleware or route handler
};

export default requestLogger;
