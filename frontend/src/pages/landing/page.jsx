import HeroSection from "./sections/hero-section";
import ServicesSection from "./sections/services-section";
import ProductSection from "./sections/product-section";

const LandingPage = () => {
  return (
    <div className="container lg:px-4 w-full">
      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Produk Section */}
      <ProductSection />
    </div>
  );
};

export default LandingPage;
