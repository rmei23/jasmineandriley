import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

export default function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("/api/images/random")
      .then(res => res.json())
      .then(setImages);
  }, []);

  return (
    <div>
      <h1>Our Gallery</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {images.map((img: any) => (
          <img
            key={img.id}
            src={img.filePath}
            alt={img.caption || ""}
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />
        ))}
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
