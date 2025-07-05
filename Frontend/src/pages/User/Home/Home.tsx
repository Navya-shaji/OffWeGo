import Banner from "@/components/home/banner/Banner"
import Destinations from "@/components/home/destinations/Destinations"
import Footer from "@/components/home/footer/Footer"
import Insights from "@/components/home/Insights/Insights"
import Header from "@/components/home/navbar/Header"

function Home() {
  return (
    <div className="Homepage">
      <Header/>
      <Banner/>
      <Destinations/>
      <Insights/>
      <Footer/>
    </div>
  )
}

export default Home
