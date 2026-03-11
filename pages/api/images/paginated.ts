import { getServerSession } from "next-auth";
import { prisma } from "../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Not authenticated" });

  const { cursor, limit = 20 } = req.query;
  const take = parseInt(limit as string);

  try {
    const images = await prisma.image.findMany({
      take: take + 1,
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor as string,
        },
      }),
      orderBy: {
        createdAt: 'desc',
      },
    });

    let nextCursor: string | undefined = undefined;
    if (images.length > take) {
      const nextItem = images.pop();
      nextCursor = nextItem!.id;
    }

    res.status(200).json({
      images,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: "Error fetching images" });
  }
}
