import Hero from '@/components/layout/Hero'
import Navbar from '@/components/layout/Navbar'
import FeaturesSection from '@/components/sections/FeaturesSection'
import FAQSection from '@/components/sections/FAQSection'

function Home() {
  return (
    <>
      <Navbar />
      <div id="inicio">
        <Hero />
      </div>
      <FeaturesSection />
      <FAQSection />
    </>
  )
}

export default Home