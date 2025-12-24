import React, { useEffect, useState } from "react";
import FoodCard from "../Components/foodCard";
import { getPopularDishes } from "../services/popularDishesApi"; // ✅ Import from service

export default function PopularDishesSection() {
  const [popularDishes, setPopularDishes] = useState([]);

  useEffect(() => {
    const fetchDishes = async () => {
      const data = await getPopularDishes();
      console.log(data)
      setPopularDishes(data);
    };

    fetchDishes();
  }, []);

  return (
    <section className="popular-dishes py-1">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Our Popular Dishes</h2>
          <p className="text-muted">
            Start Discovering A Lot Of Food Categories
          </p>
        </div>

        <div className="d-flex flex-nowrap overflow-auto py-5 gap-4">
          {popularDishes.map((dish) => (
            <FoodCard
              key={dish.id}
              id={dish.id}
              restaurantId={dish.restaurantId}
              restaurantName={dish.restaurantName}
              image={dish.image}
              name={dish.name}
              price={dish.price}
              rating={dish.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
}