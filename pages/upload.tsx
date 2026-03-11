import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);

    const res = await fetch("/api/images/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) alert("Uploaded!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <input placeholder="Caption" value={caption} onChange={e => setCaption(e.target.value)} />
      <button type="submit">Upload</button>
    </form>
  );
}
