import { Request, Response, NextFunction } from "express";

// Enhanced request logger middleware
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = new Date();

  // Listener to log the response status after it has been sent
  res.on("finish", () => {
    const endTime = new Date();
    const responseTime = endTime.getTime() - startTime.getTime();

    console.log(
      JSON.stringify({
        level: "info",
        timestamp: startTime.toISOString(),
        method: req.method,
        url: req.url,
        status: res.statusCode,
        responseTime: `${responseTime}ms`,
      })
    );
  });

  next(); // Continue to the next middleware or route handler
};

export default requestLogger;
