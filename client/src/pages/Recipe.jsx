import React, { useEffect, useState } from "react";
import { getAllRecipes } from "../utils/recipeAPI";
import { addToCartProduct } from "../utils/addToCartProduct";
import { useGlobalContext } from "../provider/GlobalProvider";
import toast from "react-hot-toast";

const Recipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servingMultipliers, setServingMultipliers] = useState({});
  const [selectedIngredients, setSelectedIngredients] = useState({});

  const { fetchCartItem } = useGlobalContext();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getAllRecipes();
        setRecipes(data);

        const multipliers = {};
        const ingredientSelections = {};

        data.forEach((recipe) => {
          multipliers[recipe._id] = 1;
          ingredientSelections[recipe._id] = new Set(recipe.ingredients.map((_, i) => i)); // all selected by default
        });

        setServingMultipliers(multipliers);
        setSelectedIngredients(ingredientSelections);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleMultiplierChange = (recipeId, newMultiplier) => {
    if (newMultiplier < 1) return;
    setServingMultipliers((prev) => ({
      ...prev,
      [recipeId]: newMultiplier,
    }));
  };

  const handleCheckboxToggle = (recipeId, index) => {
    setSelectedIngredients((prev) => {
      const updated = new Set(prev[recipeId]);
      if (updated.has(index)) {
        updated.delete(index);
      } else {
        updated.add(index);
      }
      return {
        ...prev,
        [recipeId]: updated,
      };
    });
  };

  const handleAddIngredientsToCart = async (recipe) => {
    const multiplier = servingMultipliers[recipe._id] || 1;
    const selected = selectedIngredients[recipe._id] || new Set();
    let addedAny = false;

    for (let i = 0; i < recipe.ingredients.length; i++) {
      if (!selected.has(i)) continue;

      const item = recipe.ingredients[i];
      const productId = item?.productId?._id;
      const quantity = item?.quantity * multiplier;

      if (productId) {
        await addToCartProduct(productId, quantity);
        addedAny = true;
      }
    }

    if (addedAny && fetchCartItem) fetchCartItem();

    toast.success(
      `Selected ingredients for ${multiplier * recipe.servings} servings added to cart`
    );
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
        recipes.map((recipe) => {
          const multiplier = servingMultipliers[recipe._id] || 1;
          const selected = selectedIngredients[recipe._id] || new Set();
          const totalServings = recipe.servings * multiplier;

          return (
            <div key={recipe._id} className="border p-4 rounded-xl mb-6 shadow-md">
              <h2 className="text-xl font-semibold mb-2">{recipe.name}</h2>
              <p className="text-gray-600 mb-2">{recipe.description}</p>

              <div className="mb-3 flex items-center gap-2">
                <span className="font-medium">Servings:</span>
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => handleMultiplierChange(recipe._id, multiplier - 1)}
                >
                  -
                </button>
                <span className="font-semibold">{totalServings}</span>
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => handleMultiplierChange(recipe._id, multiplier + 1)}
                >
                  +
                </button>
                <span className="text-sm text-gray-500">(base: {recipe.servings})</span>
              </div>

              <h3 className="font-medium mb-2">Ingredients:</h3>
              <ul className="mb-4 list-disc pl-5 space-y-1">
                {recipe.ingredients.map((item, index) => {
                  const totalQty = item.quantity * multiplier;

                  return (
                    <li key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selected.has(index)}
                        onChange={() => handleCheckboxToggle(recipe._id, index)}
                      />
                      <span>
                        {item?.productId?.name} - Qty: {totalQty}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <button
                onClick={() => handleAddIngredientsToCart(recipe)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Selected Ingredients for {totalServings} Serving
                {totalServings > 1 ? "s" : ""}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Recipe;
