import React, { useEffect, useState } from "react";
import { getAllRecipes } from "../utils/RecipeAPI";
import { addToCartProduct } from "../utils/addToCartProduct";

const Recipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getAllRecipes();
        console.log("Fetched recipes:", data); 
        setRecipes(data);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleAddIngredientsToCart = async (ingredients) => {
    for (const item of ingredients) {
      const productId = item?.productId?._id;
      const quantity = item?.quantity || 5;

      if (productId) {
        await addToCartProduct(productId, quantity);
      }
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Recipes</h1>

      {loading ? (
        <p className="text-center">Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <p className="text-center text-gray-500">
          No recipes available yet. 🧑‍🍳
        </p>
      ) : (
        recipes.map((recipe) => (
          <div key={recipe._id} className="border p-4 rounded-xl mb-6 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{recipe.name}</h2>
            <h3 className="font-medium mb-2">Ingredients:</h3>
            <ul className="mb-4 list-disc pl-5">
              {recipe.ingredients.map((item, index) => (
                <li key={index}>
                  {item?.productId?.name} - Qty: {item.quantity}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleAddIngredientsToCart(recipe.ingredients)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add All Ingredients to Cart
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Recipe;
