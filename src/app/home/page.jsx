"use client";

import { useEffect, useMemo, useState } from "react";
import { getProducts } from "@/components/products-api";
import NewProductModal from "@/components/NewProductModal";

const CATEGORY_OPTIONS = [
  "Todas las categorías",
  "Tecnología",
  "Accesorios",
  "Bebidas",
];

const CATEGORY_BADGE = {
  "Tecnología": "bg-primary-subtle text-primary",
  "Accesorios": "bg-warning-subtle text-warning-emphasis",
  "Bebidas": "bg-success-subtle text-success-emphasis",
};

function CategoryBadge({ category }) {
  const classes = CATEGORY_BADGE[category] || "bg-secondary-subtle text-secondary-emphasis";
  return (
    <span className={`badge rounded-pill fw-medium px-3 py-2 ${classes}`}>
      {category || "Sin categoría"}
    </span>
  );
}

export default function Store() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = (product.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "Todas las categorías" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const totalProducts = products.length;

  const inventoryValue = products.reduce(
    (acc, item) => acc + (item.price || 0),
    0
  );

  const categoriesCount = useMemo(
    () => new Set(products.map((p) => p.category).filter(Boolean)).size,
    [products]
  );

  const handleClearFilters = () => {
    setSearch("");
    setCategory(CATEGORY_OPTIONS[0]);
  };

  const handleProductCreated = (createdProduct) => {
    if (createdProduct && createdProduct._id) {
      setProducts((prev) => [createdProduct, ...prev]);
    } else {
      loadProducts();
    }
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-4" style={{ maxWidth: 1280, margin: "0 auto" }}>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <span
              className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 text-primary"
              style={{ width: 42, height: 42 }}
            >
              <i className="bi bi-box-seam fs-5"></i>
            </span>
            Dashboard de Productos
          </h2>
          <p className="text-muted mb-0">Gestión de inventario y catálogo</p>
        </div>

        <button
          className="btn btn-primary shadow-sm px-3"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Nuevo Producto
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 text-primary flex-shrink-0"
                style={{ width: 48, height: 48 }}
              >
                <i className="bi bi-boxes fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted mb-1 small text-uppercase">Productos</h6>
                <h3 className="fw-bold mb-0">{totalProducts}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-10 text-success flex-shrink-0"
                style={{ width: 48, height: 48 }}
              >
                <i className="bi bi-cash-stack fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted mb-1 small text-uppercase">Valor Inventario</h6>
                <h3 className="fw-bold mb-0">${inventoryValue.toLocaleString("es-CO")}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-3 bg-warning bg-opacity-10 text-warning-emphasis flex-shrink-0"
                style={{ width: 48, height: 48 }}
              >
                <i className="bi bi-tags fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted mb-1 small text-uppercase">Categorías</h6>
                <h3 className="fw-bold mb-0">{categoriesCount}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Buscar producto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={handleClearFilters}
              >
                <i className="bi bi-x-circle me-2"></i>
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0 fw-semibold">Lista de Productos</h5>
          <span className="text-muted small">
            {filteredProducts.length} resultado{filteredProducts.length !== 1 && "s"}
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="text-muted small text-uppercase">ID</th>
                <th className="text-muted small text-uppercase">Producto</th>
                <th className="text-muted small text-uppercase">Categoría</th>
                <th className="text-muted small text-uppercase">Precio</th>
                <th className="text-muted small text-uppercase">Creado</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    Cargando productos...
                  </td>
                </tr>
              )}

              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-3 d-block mb-2"></i>
                    No hay productos para mostrar.
                  </td>
                </tr>
              )}

              {!loading &&
                filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="text-muted small font-monospace">
                      {String(product._id).slice(-6)}
                    </td>
                    <td>
                      <strong>{product.name}</strong>
                    </td>
                    <td>
                      <CategoryBadge category={product.category} />
                    </td>
                    <td className="fw-semibold">
                      ${(product.price || 0).toLocaleString("es-CO")}
                    </td>
                    <td className="text-muted">
                      {product.created
                        ? new Date(product.created).toLocaleDateString("es-CO")
                        : "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <NewProductModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handleProductCreated}
      />
    </div>
  );
}
