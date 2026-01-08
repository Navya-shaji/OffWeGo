import Banner from "@/components/home/banner/Banner";
import Destinations from "@/components/home/destinations/Destinations";
import TravelStories from "@/components/home/TravelStories/TravelStories";
import Footer from "@/components/home/footer/Footer";
import Header from "@/components/home/navbar/Header";

function Home() {
  return (
    <div className="Homepage">
      <Header />
      <Banner />
      <TravelStories />
      <Destinations id="destinations" />
      <Footer />
    </div>
  );
}

export default Home;
