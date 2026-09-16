"use client";

import { useState } from "react";
import { createProduct } from "@/components/products-api";

const CATEGORIES = ["Tecnología", "Accesorios", "Bebidas"];

export default function NewProductModal({ show, onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", price: "", category: CATEGORIES[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.price) {
      setError("Nombre y precio son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const created = await createProduct({
        name: form.name.trim(),
        price: form.price,
        stock: 10,
        category: form.category,
      });
      onCreated(created);
      setForm({ name: "", price: "", category: CATEGORIES[0] });
      onClose();
    } catch (err) {
      setError(err.message || "No se pudo crear el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>

      {/* Modal */}
      <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Nuevo Producto</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  disabled={loading}
                ></button>
              </div>

              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}

                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Precio</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    disabled={loading}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Categoría</label>
                  <select
                    className="form-select"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
