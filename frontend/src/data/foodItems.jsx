
const foodItems = [
  {
    restaurantId: 1,
    restaurantName: "Kapelka Restaurant",
    categories: {
      Burger: [
        {
          id: 1,
          name: "Classic Burger",
          image: "/pancakes.png",
          description:
            "Juicy beef patty with lettuce, tomato, and our special sauce",
          price: 15.99,
          stock: 8,
          rating: 4.5,
          reviews: [
            {
              id: 1,
              name: "John Smith",
              role: "Food Critic",
              rating: 5,
              text: "Perfectly cooked patty with fresh ingredients.",
            },
          ],
        },
        {
          id: 2,
          name: "Cheese Burger",
          image: "/pancakes.png",
          description: "Classic burger topped with melted cheddar cheese",
          price: 14.99,
          stock: 15,
          rating: 4.7,
          reviews: [
            {
              id: 1,
              name: "Lisa Brown",
              role: "Customer",
              rating: 5,
              text: "My go-to burger. The cheese makes all the difference!",
            },
          ],
        },
      ],
      Pizza: [
        {
          id: 3,
          name: "Pepperoni Pizza",
          image: "/pancakes.png",
          description: "Loaded with pepperoni slices and extra cheese",
          price: 20.99,
          stock: 20,
          rating: 4.8,
          reviews: [
            {
              id: 1,
              name: "Tony Romano",
              role: "Pizza Lover",
              rating: 5,
              text: "Generous pepperoni and perfect crust.",
            },
          ],
        },
      ],
    },
  },

  {
    restaurantId: 2,
    restaurantName: "Sunset Diner",
    categories: {
      Sushi: [
        {
          id: 4,
          name: "California Roll",
          image: "/pancakes.png",
          description: "Crab, avocado, and cucumber wrapped in seaweed",
          price: 16.99,
          stock: 25,
          rating: 4.7,
          reviews: [
            {
              id: 1,
              name: "Yuki Tanaka",
              role: "Sushi Chef",
              rating: 5,
              text: "Fresh ingredients. Perfectly balanced roll.",
            },
          ],
        },
      ],
      Dessert: [
        {
          id: 5,
          name: "Chocolate Lava Cake",
          image: "/pancakes.png",
          description: "Warm chocolate cake with gooey center",
          price: 9.99,
          stock: 10,
          rating: 4.9,
          reviews: [
            {
              id: 1,
              name: "Sweet Tooth",
              role: "Customer",
              rating: 5,
              text: "Rich and decadent! My favorite.",
            },
          ],
        },
      ],
    },
  },
];


// ✅ Helper: get all products across all restaurants
export const getAllProducts = () => {
  return foodItems
    .map((restaurant) =>
      Object.entries(restaurant.categories).flatMap(([cat, items]) =>
        items.map((item) => ({
          ...item,
          restaurantId: restaurant.restaurantId,
          restaurantName: restaurant.restaurantName,
          category: cat,
        }))
      )
    )
    .flat();
};

// ✅ Helper: Get all products for specific restaurantId
export const getProductsByRestaurant = (restaurantId) => {
  const restaurant = foodItems.find(
    (r) => r.restaurantId === parseInt(restaurantId)
  );
  if (!restaurant) return [];
  return Object.entries(restaurant.categories).flatMap(([cat, items]) =>
    items.map((item) => ({
      ...item,
      restaurantId: restaurant.restaurantId,
      restaurantName: restaurant.restaurantName,
      category: cat,
    }))
  );
};

// ✅ Helper: Get single product by id (from all restaurants)
export const getProductById = (id) => {
  const all = getAllProducts();
  return all.find((item) => item.id === parseInt(id));
};

export default foodItems;