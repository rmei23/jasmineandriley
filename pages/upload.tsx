import { useState } from "react";
import { getSession } from "next-auth/react";
import Navbar from "../src/components/Navbar";
import { useRouter } from "next/router";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);

    const res = await fetch("/api/images/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);
    if (res.ok) {
      router.push("/gallery");
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center">Upload Photo</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Choose Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Caption (optional)</label>
            <input
              type="text"
              placeholder="Add a caption..."
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: "/auth/signin", permanent: false } };
  }
  return { props: {} };
}
