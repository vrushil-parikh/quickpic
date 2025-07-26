import React from 'react';

const AdminRecipeCard = ({ recipe, onEdit, onDelete }) => {
  return (
    <div className="border rounded-xl shadow-md p-4 mb-4 bg-white hover:shadow-lg transition">
      <div className="flex gap-4">
        {/* Recipe Image */}

        <div className="flex flex-col justify-between flex-1">
          {/* Recipe Info */}
          <div>
            <h2 className="text-xl font-bold">{recipe.name}</h2>
            <p className="text-gray-600">{recipe.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              Servings: <span className="font-medium">{recipe.servings}</span>
            </p>

            {/* Ingredients */}
            <div className="mt-2">
              <p className="font-semibold">Ingredients:</p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {recipe.ingredients?.map((ing, idx) => (
                  <li key={idx}>
                    {ing?.productId?.name || 'Unknown'} - {ing.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => onEdit(recipe)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(recipe._id)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRecipeCard;
