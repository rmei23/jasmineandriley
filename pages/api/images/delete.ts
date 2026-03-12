import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Image ID is required" });
  }

  try {
    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    if (image.userId !== (session.user as any).id) {
      return res.status(403).json({ message: "Not authorized to delete this image" });
    }

    const filePath = path.join(process.cwd(), "public", image.filePath);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.image.delete({
      where: { id },
    });

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Failed to delete image" });
  }
}
