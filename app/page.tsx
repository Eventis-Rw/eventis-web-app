import InstagramFeed from "./components/instagram-feed";
import Navbar from "./components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070814]">
      <Navbar />
      <InstagramFeed />
    </main>
  );
}
