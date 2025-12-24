import Header from "../Components/header";
import PopularDishesSection from "./popularDishSection";
import SpecialOffersSection from "./specialOffersSection";
import DeliverySection from "./deliverySection";
import RestaurantsSection from "./restaurantsSection";


export default function Home() {
  return (
    <>
      <Header />
      <RestaurantsSection></RestaurantsSection>
      <PopularDishesSection></PopularDishesSection>
      <SpecialOffersSection/>
      <DeliverySection></DeliverySection>
    </>

  )
}
