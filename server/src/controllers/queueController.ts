import { Request, Response } from "express";
import Queue from "../models/Queue";

export const getQueue = async (req: Request, res: Response) => {
  try {
    const queue = await Queue.find();
    res.json(queue);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const addToQueue = async (req: Request, res: Response) => {
  const { partyName, partySize } = req.body;
  try {
    const newQueue = new Queue({
      partyName,
      partySize,
      position: (await Queue.countDocuments()) + 1,
    });
    await newQueue.save();
    res.status(201).json(newQueue);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
