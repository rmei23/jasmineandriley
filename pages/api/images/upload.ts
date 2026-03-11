import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = { api: { bodyParser: false } };

const prisma = new PrismaClient();

type SessionUserWithId = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session || !session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Type cast user to include id
  const user = session.user as SessionUserWithId;
  if (!user.id) return res.status(401).json({ message: "Not authenticated" });

  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const form = formidable({
    uploadDir: path.join(process.cwd(), "/public/uploads"),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: "Upload error" });

    const uploadedFile = files?.file;
    let file: formidable.File;

    if (Array.isArray(uploadedFile)) file = uploadedFile[0];
    else if (uploadedFile) file = uploadedFile as formidable.File;
    else return res.status(400).json({ message: "No file uploaded" });

    const captionField = fields.caption;
    let caption: string | null = null;
    if (Array.isArray(captionField)) caption = captionField[0];
    else if (typeof captionField === "string") caption = captionField;

    try {
      const image = await prisma.image.create({
        data: {
          filePath: `/uploads/${path.basename(file.filepath)}`,
          caption: caption,
          userId: user.id,
        },
      });

      res.status(200).json({ image });
    } catch (dbError) {
      console.error("Database Error:", dbError);
      res.status(500).json({ message: "Database error" });
    }
  });
}
