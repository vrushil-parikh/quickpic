import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { FaPlus, FaTrash } from "react-icons/fa";

const AdminRecipeForm = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructions: "",
    servings: "",
    ingredients: [],
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEditMode = !!recipeId;

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await Axios(SummaryApi.getAllProducts);
      setProducts(response.data.data || []);
    } catch (err) {
      AxiosToastError(err);
    }
  };

  // Fetch recipe data in edit mode
  const fetchRecipeData = async () => {
    try {
      const response = await Axios({
        method: SummaryApi.getSingleRecipe.method,
        url: SummaryApi.getSingleRecipe.url(recipeId),
      });
      const recipe = response.data.data;

      setFormData({
        name: recipe.name || "",
        description: recipe.description || "",
        instructions: recipe.instructions || "",
        servings: recipe.servings || "",
        ingredients:
          recipe.ingredients.map((ingredient) => ({
            productId: ingredient.productId || "",
            quantity: ingredient.quantity || "",
          })) || [],
      });
    } catch (err) {
      AxiosToastError(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (isEditMode) fetchRecipeData();
  }, [isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      ingredients: updatedIngredients,
    }));
  };

  const addIngredientField = () =>
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { productId: "", quantity: "" }],
    }));

  const removeIngredientField = (index) => {
    const updated = [...formData.ingredients];
    updated.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      ingredients: updated,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...formData };

    try {
      if (isEditMode) {
        await Axios({
          method: "PUT",
          url: SummaryApi.updateRecipe.url(recipeId),
          data: payload,
        });
        toast.success("Recipe updated successfully");
      } else {
        await Axios({
          ...SummaryApi.createRecipe,
          data: payload,
        });
        toast.success("Recipe created successfully");
      }
      navigate("/dashboard/admin-recipe");
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">
        {isEditMode ? "Edit Recipe" : "Create New Recipe"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipe Name */}
        <input
          type="text"
          name="name"
          placeholder="Recipe Name"
          value={formData.name}
          onChange={handleChange}
          className="border rounded w-full p-2"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Short Description"
          value={formData.description}
          onChange={handleChange}
          className="border rounded w-full p-2"
          rows={3}
        />

        {/* Instructions */}
        <textarea
          name="instructions"
          placeholder="Instructions"
          value={formData.instructions}
          onChange={handleChange}
          className="border rounded w-full p-2"
          rows={5}
        />

        {/* Servings */}
        <input
          type="number"
          name="servings"
          placeholder="Servings (e.g., 2, 4, 6)"
          value={formData.servings}
          onChange={handleChange}
          className="border rounded w-full p-2"
          min={1}
        />

        {/* Ingredients */}
        <div>
          <label className="block font-medium mb-1">Ingredients</label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select
                value={
                  typeof ingredient.productId === "object"
                    ? ingredient.productId._id
                    : ingredient.productId
                }
                onChange={(e) =>
                  handleIngredientChange(index, "productId", e.target.value)
                }
                className="border rounded p-2 flex-1"
              >
                <option value="">Select product</option>
                {products.map((prod) => (
                  <option key={prod._id} value={prod._id}>
                    {prod.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Quantity (e.g., 200g, 2 cups)"
                value={ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
                className="border rounded p-2 w-40"
              />

              <button
                type="button"
                onClick={() => removeIngredientField(index)}
                className="text-red-600"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredientField}
            className="text-blue-600 flex items-center gap-1 mt-2"
          >
            <FaPlus /> Add Ingredient
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : isEditMode ? "Update Recipe" : "Create Recipe"}
        </button>
      </form>
    </div>
  );
};

export default AdminRecipeForm;
