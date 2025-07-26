import React, { useEffect, useState } from "react";
import AdminRecipeCard from "../components/admin/AdminRecipeCard"; // Import Admin Recipe Card component
import { toast } from "react-hot-toast"; // For notifications
import { useNavigate } from "react-router-dom"; // React Router v6
import { getAllRecipes } from "../utils/recipeAPI"; // Axios-based fetch function
import Axios from "../utils/Axios";

const AdminRecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); //

  useEffect(() => {
    // Fetch all recipes using Axios
    const fetchRecipes = async () => {
      try {
        const recipesData = await getAllRecipes(); // Axios call
        setRecipes(recipesData);
      } catch (error) {
        toast.error("Error fetching recipes");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Navigate to the recipe creation page
  const handleCreateRecipe = () => {
    navigate("/dashboard/admin-recipe/create");
  };

  // Navigate to the recipe edit page
  const handleEdit = (recipe) => {
    navigate(`/dashboard/admin-recipe/edit/${recipe._id}`);
  };

  // Delete a recipe
  const handleDelete = async (id) => {
    try {
      const response = await Axios.delete(`/api/recipes/delete/${id}`);
  
      if (response.data.success) {
        toast.success("Recipe deleted successfully");
        setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== id));
      } else {
        toast.error(response.data.message || "Failed to delete recipe");
      }
    } catch (error) {
      toast.error("Error deleting recipe");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Recipe List</h1>
        <button
          onClick={handleCreateRecipe}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create New Recipe
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <p className="text-center text-gray-500">No recipes available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <AdminRecipeCard
              key={recipe._id}
              recipe={recipe}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRecipeListPage;
