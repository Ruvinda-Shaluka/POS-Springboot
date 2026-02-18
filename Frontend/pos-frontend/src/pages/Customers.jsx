import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppCtx } from "../App";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Pencil, Search, Trash2, X, RefreshCw } from "lucide-react";
import { customerApi } from "../api/customerApi";

export default function Customers() {
    const { customers, setCustomers, showToast } = useContext(AppCtx);

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [search, setSearch] = useState("");

    const [editId, setEditId] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return customers;
        return customers.filter(
            (c) =>
                String(c.name || "")
                    .toLowerCase()
                    .includes(q) ||
                String(c.address || "")
                    .toLowerCase()
                    .includes(q),
        );
    }, [customers, search]);

    const resetForm = () => {
        setName("");
        setAddress("");
        setErrors({});
        setEditId(null);
    };

    const validate = () => {
        const e = {};
        if (!name.trim()) e.name = "Name is required";
        if (!address.trim()) e.address = "Address is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const loadCustomers = async () => {
        try {
            setLoading(true);
            const data = await customerApi.getAll();
            setCustomers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            showToast("Failed to load customers", "error");
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    const onSave = async () => {
        if (!validate()) return;
        const payloadBase = { name: name.trim(), address: address.trim() };
        try {
            setSaving(true);
            if (editId) {
                await customerApi.update({ id: editId, ...payloadBase });
                showToast("Customer updated", "success");
            } else {
                await customerApi.save(payloadBase);
                showToast("Customer saved", "success");
            }
            resetForm();
            await loadCustomers();
        } catch (err) {
            console.error(err);
            showToast("Operation failed. Check backend / CORS.", "error");
        } finally {
            setSaving(false);
        }
    };

    const onEdit = (c) => {
        setEditId(c.id);
        setName(c.name ?? "");
        setAddress(c.address ?? "");
        setErrors({});
    };

    const onDelete = async (id) => {
        try {
            setSaving(true);
            await customerApi.delete(id);
            showToast("Customer deleted", "success");
            if (editId === id) resetForm();
            await loadCustomers();
        } catch (err) {
            console.error(err);
            showToast("Delete failed", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Form Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {editId ? "Edit Customer" : "Add Customer"}
                    </h2>
                    {editId && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={resetForm}
                            disabled={saving}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel Edit
                        </Button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter customer name"
                        error={errors.name}
                    />
                    <Input
                        label="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter customer address"
                        error={errors.address}
                    />
                </div>
                <div className="mt-6 flex gap-3">
                    <Button onClick={onSave} disabled={saving}>
                        {saving ? "Saving..." : editId ? "Update Customer" : "Save Customer"}
                    </Button>
                    <Button variant="secondary" onClick={resetForm} disabled={saving}>
                        Clear
                    </Button>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
                <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-900">Customer List</h2>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search customers..."
                            className="w-full sm:w-64"
                            icon={<Search className="h-4 w-4 text-gray-400" />}
                        />
                        <Button onClick={loadCustomers} disabled={loading} variant="secondary">
                            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">#</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Address</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="text-center py-10 text-gray-500">
                                    Loading customers...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-10 text-gray-500">
                                    No customers found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((c, idx) => (
                                <tr
                                    key={c.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 text-gray-400">{idx + 1}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                                    <td className="px-6 py-4">{c.address}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => onEdit(c)}
                                                disabled={saving}
                                                className="h-8 w-8 p-0"
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4 text-blue-600" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => onDelete(c.id)}
                                                disabled={saving}
                                                className="h-8 w-8 p-0 hover:border-red-200 hover:bg-red-50"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl text-xs text-gray-500 text-center">
                    Showing {filtered.length} customers
                </div>
            </div>
        </div>
    );
}