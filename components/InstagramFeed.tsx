"use client";

import { useEffect, useState } from "react";

interface InstagramPost {
  id: number;
  postUrl: string;
  caption: string | null;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/instagram-posts");
        const json = await res.json();
        if (cancelled) return;
        const items = json.data || [];
        setPosts(items);

        if (items.length === 0) {
          setLoaded(true);
          return;
        }

        const id = "instagram-embed-script";
        if (!document.getElementById(id)) {
          const script = document.createElement("script");
          script.id = id;
          script.src = "//www.instagram.com/embed.js";
          script.async = true;
          script.onload = () => {
            if (window.instgrm) window.instgrm.Embeds.process();
            setLoaded(true);
          };
          document.body.appendChild(script);
        } else {
          if (window.instgrm) window.instgrm.Embeds.process();
          setLoaded(true);
        }
      } catch {
        setLoaded(true);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  if (!loaded || posts.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-3">
            Follow Us on Instagram
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Tag us in your photos for a chance to be featured.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {posts.map((post) => (
            <div key={post.id} className="flex justify-center">
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={post.postUrl}
                data-instgrm-version="14"
                style={{
                  background: "#FFF",
                  border: 0,
                  borderRadius: "12px",
                  boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                  margin: "1px",
                  width: "100%",
                  minWidth: "280px",
                  maxWidth: "350px",
                  padding: 0,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
