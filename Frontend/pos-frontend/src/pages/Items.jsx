import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppCtx } from "../App";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import {
    Pencil,
    Search,
    Trash2,
    RefreshCw,
    X,
    Package
} from "lucide-react";
import { itemApi } from "../api/itemApi";

const sorters = {
    none: { label: "Sort: Default" },
    priceAsc: { label: "Price (Low to High)" },
    priceDesc: { label: "Price (High to Low)" },
    qtyAsc: { label: "Stock (Low to High)" },
    qtyDesc: { label: "Stock (High to Low)" },
};

export default function Items() {
    const { items, setItems, showToast } = useContext(AppCtx);
    // ... (keeping all state logic exactly the same)
    const [description, setDescription] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
    const [qtyOnHand, setQtyOnHand] = useState("");
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState("none");
    const [editId, setEditId] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // ... (keeping functions: resetForm, validate, loadItems, onSave, onEdit, onDelete)
    const resetForm = () => {
        setDescription("");
        setUnitPrice("");
        setQtyOnHand("");
        setEditId(null);
        setErrors({});
    };

    const validate = () => {
        const e = {};
        if (!description.trim()) e.description = "Description is required";
        const p = Number(unitPrice);
        const q = Number(qtyOnHand);
        if (unitPrice === "" || Number.isNaN(p) || p <= 0) e.unitPrice = "Unit Price > 0";
        if (qtyOnHand === "" || Number.isNaN(q) || q < 0) e.qtyOnHand = "Qty >= 0";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const loadItems = async () => {
        try {
            setLoading(true);
            const data = await itemApi.getAll();
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            showToast("Failed to load items", "error");
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadItems(); }, []);

    const onSave = async () => {
        if (!validate()) return;
        const payloadBase = { description: description.trim(), unitPrice: Number(unitPrice), qtyOnHand: Number(qtyOnHand) };
        try {
            setSaving(true);
            if (editId) {
                await itemApi.update({ id: editId, ...payloadBase });
                showToast("Item updated", "success");
            } else {
                await itemApi.save(payloadBase);
                showToast("Item saved", "success");
            }
            resetForm();
            await loadItems();
        } catch (err) {
            console.error(err);
            showToast("Operation failed.", "error");
        } finally {
            setSaving(false);
        }
    };

    const onEdit = (it) => {
        setEditId(it.id);
        setDescription(it.description ?? "");
        setUnitPrice(String(it.unitPrice ?? ""));
        setQtyOnHand(String(it.qtyOnHand ?? ""));
        setErrors({});
    };

    const onDelete = async (id) => {
        try {
            setSaving(true);
            await itemApi.delete(id);
            showToast("Item deleted", "success");
            if (editId === id) resetForm();
            await loadItems();
        } catch (err) {
            console.error(err);
            showToast("Delete failed", "error");
        } finally {
            setSaving(false);
        }
    };

    const viewItems = useMemo(() => {
        const q = search.trim().toLowerCase();
        let arr = q
            ? items.filter((it) => String(it.description || "").toLowerCase().includes(q))
            : [...items];
        const byNum = (a, b, key, dir) => dir === "asc" ? a[key] - b[key] : b[key] - a[key];
        if (sortKey === "priceAsc") arr.sort((a, b) => byNum(a, b, "unitPrice", "asc"));
        if (sortKey === "priceDesc") arr.sort((a, b) => byNum(a, b, "unitPrice", "desc"));
        if (sortKey === "qtyAsc") arr.sort((a, b) => byNum(a, b, "qtyOnHand", "asc"));
        if (sortKey === "qtyDesc") arr.sort((a, b) => byNum(a, b, "qtyOnHand", "desc"));
        return arr;
    }, [items, search, sortKey]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {editId ? "Edit Item" : "Add New Item"}
                    </h2>
                    {editId && (
                        <Button variant="secondary" size="sm" onClick={resetForm} disabled={saving}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel Edit
                        </Button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g., Chocolate Biscuit"
                        error={errors.description}
                    />
                    <Input
                        label="Unit Price"
                        type="number"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        placeholder="0.00"
                        error={errors.unitPrice}
                    />
                    <Input
                        label="Qty On Hand"
                        type="number"
                        value={qtyOnHand}
                        onChange={(e) => setQtyOnHand(e.target.value)}
                        placeholder="0"
                        error={errors.qtyOnHand}
                    />
                </div>
                <div className="mt-6 flex gap-3">
                    <Button onClick={onSave} disabled={saving}>
                        {saving ? "Saving..." : editId ? "Update Item" : "Save Item"}
                    </Button>
                    <Button variant="secondary" onClick={resetForm} disabled={saving}>
                        Clear
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
                <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-900">Inventory</h2>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full md:w-56"
                            icon={<Search className="h-4 w-4 text-gray-400" />}
                        />
                        <Select
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value)}
                            className="w-full md:w-48"
                        >
                            {Object.entries(sorters).map(([k, v]) => (
                                <option key={k} value={k}>{v.label}</option>
                            ))}
                        </Select>
                        <Button onClick={loadItems} disabled={loading} variant="secondary">
                            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        </Button>
                    </div>
                </div>

                <div className="p-6 bg-gray-50/50 min-h-[300px]">
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Loading items...</div>
                    ) : viewItems.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">No items found.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {viewItems.map((it) => {
                                const low = Number(it.qtyOnHand) < 5;
                                return (
                                    <div
                                        key={it.id}
                                        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col relative overflow-hidden"
                                    >
                                        <div className={`absolute top-0 left-0 w-1 h-full ${low ? 'bg-red-500' : 'bg-blue-500'}`}></div>

                                        <div className="flex justify-between items-start mb-2">
                                            <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                                                <Package className="h-5 w-5" />
                                            </div>
                                            <span
                                                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                                    low ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                                }`}
                                            >
                        {low ? "Low Stock" : "In Stock"}
                      </span>
                                        </div>

                                        <h3 className="text-base font-bold text-gray-900 truncate mb-1" title={it.description}>
                                            {it.description}
                                        </h3>

                                        <div className="flex justify-between items-end mt-4">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-semibold">Price</p>
                                                <p className="text-lg font-bold text-gray-900">Rs {Number(it.unitPrice).toFixed(2)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 uppercase font-semibold">Qty</p>
                                                <p className={`text-lg font-bold ${low ? "text-red-600" : "text-gray-900"}`}>
                                                    {it.qtyOnHand}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end gap-2">
                                            <Button size="sm" variant="secondary" onClick={() => onEdit(it)} disabled={saving} className="h-8 w-8 p-0">
                                                <Pencil className="h-4 w-4 text-gray-600" />
                                            </Button>
                                            <Button size="sm" variant="secondary" onClick={() => onDelete(it.id)} disabled={saving} className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200 hover:text-red-600">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}