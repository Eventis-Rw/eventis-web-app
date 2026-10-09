import EventDiscovery from "../components/event-discovery";
import EventSearchBar from "../components/event-search-bar";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-[#02021f]">
      <Navbar />
      <EventSearchBar />
      <EventDiscovery />
      <Footer />
    </main>
  );
}