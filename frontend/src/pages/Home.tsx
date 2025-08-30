import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from '../lib/api'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await api.get("/posts");
      setPosts(data.items);
    })();
  }, []);
  return (
    <div className="space-y-12 section">
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Selamat Datang di SDN Petir 3
          </h1>
          <p className="text-gray-600 mt-4">
            Sekolah Dasar Negeri dengan lingkungan belajar yang aman, nyaman,
            dan menyenangkan di Kota Tangerang.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/about" className="btn btn-primary">
              Kenal Lebih Dekat
            </Link>
            <Link to="/kegiatan" className="btn">
              Lihat Kegiatan
            </Link>
          </div>
        </div>
        <img
          className="w-full h-72 object-cover rounded-2xl shadow-sm border"
          src="https://picsum.photos/seed/sdnpetir3/900/500"
          alt="SDN Petir 3"
        />
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Guru Berkompeten",
            desc: "Tenaga pendidik profesional dan berpengalaman.",
          },
          {
            title: "Fasilitas Lengkap",
            desc: "Ruang belajar nyaman, perpustakaan, dan lapangan.",
          },
          {
            title: "Program Unggulan",
            desc: "Literasi, numerasi, dan kegiatan ekstrakurikuler.",
          },
        ].map((c, i) => (
          <div key={i} className="card p-6">
            <div className="text-xl font-semibold">{c.title}</div>
            <p className="text-gray-600 mt-2">{c.desc}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Berita Terbaru</h2>
      </section>
    </div>
  );
}
