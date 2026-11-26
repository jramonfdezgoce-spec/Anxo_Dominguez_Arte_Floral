import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Christmas from "@/components/Christmas";
import Reviews from "@/components/Reviews";
import Course from "@/components/Course";
import Contact from "@/components/Contact";
import Collections from "@/components/Collections";
import Expansion from "@/components/Expansion";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Interactions from "@/components/Interactions";
import Flowers3D from "@/components/Flowers3D";
import Footer from "@/components/Footer";
import FlowerIntro from "@/components/FlowerIntro";
import ParallaxEffects from "@/components/ParallaxEffects";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Flowers3D />
      <FlowerIntro />
      <Nav />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Collections />
        <Expansion />
        <Christmas />
        <Reviews />
        <Course />
        <Contact />
      </main>
      <Footer />
      <ParallaxEffects />
      <Interactions />
    </>
  );
}
