import express from 'express';
import RecipeModel from '../models/recipe.model.js';

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { name, description, image, ingredients, servings } = req.body;

    if (!name || !ingredients || !servings) {
      return res.status(400).json({
        message: 'Name, ingredients, and servings are required fields.',
        error: true,
        success: false,
      });
    }

    const newRecipe = new RecipeModel({ name, description, image, ingredients, servings });
    const savedRecipe = await newRecipe.save();

    return res.status(201).json({
      data: savedRecipe,
      message: 'Recipe created successfully.',
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const recipes = await RecipeModel.find({}).populate('ingredients.productId');

    return res.status(200).json({
      data: recipes,
      message: 'All recipes fetched successfully.',
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.params.id).populate('ingredients.productId');

    if (!recipe) {
      return res.status(404).json({
        message: 'Recipe not found.',
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      data: recipe,
      message: 'Recipe fetched successfully.',
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
});


router.put('/update/:id', async (req, res) => {
  try {
    const { name, description, ingredients, servings } = req.body;

    if (!name || !ingredients || !servings) {
      return res.status(400).json({
        message: 'Name, ingredients, and servings are required fields.',
        error: true,
        success: false,
      });
    }

    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      req.params.id, 
      { name, description, ingredients, servings },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({
        message: 'Recipe not found.',
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: 'Recipe updated successfully.',
      success: true,
      data: updatedRecipe,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error updating recipe.',
      error: true,
      success: false,
    });
  }
});


router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedRecipe = await RecipeModel.findByIdAndDelete(req.params.id);

    if (!deletedRecipe) {
      return res.status(404).json({
        message: 'Recipe not found.',
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: 'Recipe deleted successfully.',
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
});

export default router;
