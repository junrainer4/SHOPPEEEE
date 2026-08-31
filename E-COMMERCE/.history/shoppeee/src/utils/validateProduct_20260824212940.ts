import { ProductFormErrors, ProductFormValues } from "../types";

export function validateProduct(values: ProductFormValues): ProductFormErrors {
  const errors: ProductFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Product name is required.";
  } else if (values.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters.";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required.";
  } else if (values.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }

  if (!values.price.trim()) {
    errors.price = "Price is required.";
  } else if (Number.isNaN(Number(values.price)) || Number(values.price) <= 0) {
    errors.price = "Enter a valid price greater than 0.";
  }

  if (!values.category.trim()) {
    errors.category = "Category is required.";
  }

  if (!values.stock.trim()) {
    errors.stock = "Stock quantity is required.";
  } else if (
    Number.isNaN(Number(values.stock)) ||
    !Number.isInteger(Number(values.stock)) ||
    Number(values.stock) < 0
  ) {
    errors.stock = "Enter a valid whole number for stock.";
  }

  if (!values.image.trim()) {
    errors.image = "Please add a product photo.";
  }

  return errors;
}

export function isFormValid(errors: ProductFormErrors): boolean {
  return Object.keys(errors).length === 0;
}