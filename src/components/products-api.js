// lib/products-api.js
//
// Cliente para la API de productos.
// Colócalo en tu proyecto Next.js, por ejemplo en: lib/products-api.js
//
// Usa la variable de entorno NEXT_PUBLIC_API_URL si existe (recomendado),
// y si no, cae a http://localhost:3000 como indicaste.
 
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
 
/**
 * Trae todos los productos desde el backend.
 * GET /get-products
 */
export async function getProducts() {
    
  let list = []
  await fetch(`${API_URL}/get-products`, {
            method: "GET",
        })
        .then((res) => res.json())
        .then((data) => {
            list = data
            return list;
        })
  return list;
}
 
/**
 * Trae productos filtrados por categoría.
 * El endpoint actual no tiene una ruta dedicada para filtrar por categoría,
 * así que traemos todos y filtramos en el cliente.
 * Si más adelante agregas algo como GET /get-products?category=xxx en el
 * backend, solo hay que cambiar esta función para usarlo.
 */
export async function getProductsByCategory(category) {
  const products = await getProducts();
 
  if (!category || category === "Todas las categorías") {
    return products;
  }
 
  return products.filter(
    (product) =>
      (product.category || "").toLowerCase() === category.toLowerCase()
  );
}
 
/**
 * Crea un nuevo producto.
 * POST /create-products
 * body: { name, price, category }
 */
export async function createProduct({ name, price, category, stock }) {
  const res = await fetch(`${API_URL}/create-products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      price: Number(price),
      category,
      stock
    }),
  });
 
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Error al crear el producto (status ${res.status})`
    );
  }
 
  return res.json();
}