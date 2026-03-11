import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import Navbar from "../src/components/Navbar";

interface Image {
  id: string;
  filePath: string;
  caption: string | null;
}

export default function Gallery() {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    fetch("/api/images/random")
      .then(res => res.json())
      .then(setImages);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Gallery</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group"
            >
              <img
                src={img.filePath}
                alt={img.caption || "Gallery image"}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
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
