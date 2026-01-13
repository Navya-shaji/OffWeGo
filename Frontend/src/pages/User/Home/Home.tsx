import Banner from "@/components/home/banner/Banner";
import Destinations from "@/components/home/destinations/Destinations";
import Footer from "@/components/home/footer/Footer";
import Header from "@/components/home/navbar/Header";
import ScrollProgress from "@/components/common/ScrollProgress";
import BackToTop from "@/components/common/BackToTop";

function Home() {
  return (
    <div className="Homepage">
      <ScrollProgress />
      <BackToTop />
      <Header />
      <Banner />
      <Destinations />
      <Footer />
    </div>
  );
}

export default Home;
