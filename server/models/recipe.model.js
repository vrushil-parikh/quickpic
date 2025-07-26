import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  
  ingredients: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  servings: { // New field to track number of servings
    type: Number,
    required: true,
    min: 1, // at least one person
  },
}, {
  timestamps: true,
});

const RecipeModel = mongoose.model('recipe', recipeSchema);
export default RecipeModel;
