import React, { useContext, useMemo, useState } from "react";
import { AppCtx } from "../App";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Modal from "../components/ui/Modal";
import { orderApi } from "../api/orderApi";
import { itemApi } from "../api/itemApi";
import {
    Calendar,
    Minus,
    Plus,
    ReceiptText,
    Trash2,
    ShoppingCart
} from "lucide-react";

const pad4 = (n) => String(n).padStart(4, "0");
const makeOrderDisplayId = (seq) => `ORD-${pad4(seq)}`;
const todayISO = () => new Date().toISOString().slice(0, 10);

export default function Orders() {
    const {
        customers,
        items,
        setItems,
        orders,
        setOrders,
        orderSeq,
        setOrderSeq,
        showToast,
    } = useContext(AppCtx);

    // ... (Keep all state and logic exactly the same)
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [selectedItemId, setSelectedItemId] = useState("");
    const [orderQty, setOrderQty] = useState("");
    const [cart, setCart] = useState([]);
    const [errorInline, setErrorInline] = useState("");
    const [discountMode, setDiscountMode] = useState("percent");
    const [discountValue, setDiscountValue] = useState("");
    const [taxEnabled, setTaxEnabled] = useState(false);
    const TAX_RATE = 0.08;
    const [successOpen, setSuccessOpen] = useState(false);
    const [placing, setPlacing] = useState(false);

    const orderDisplayId = useMemo(() => makeOrderDisplayId(orderSeq), [orderSeq]);
    const orderDate = useMemo(() => todayISO(), []);

    const selectedCustomer = useMemo(
        () => customers.find((c) => String(c.id) === String(selectedCustomerId)) || null,
        [customers, selectedCustomerId],
    );

    const selectedItem = useMemo(
        () => items.find((it) => String(it.id) === String(selectedItemId)) || null,
        [items, selectedItemId],
    );

    const cartSubtotal = useMemo(() => cart.reduce((sum, line) => sum + line.qty * line.unitPrice, 0), [cart]);

    const discountAmount = useMemo(() => {
        const v = Number(discountValue);
        if (!discountValue || Number.isNaN(v) || v <= 0) return 0;
        if (discountMode === "fixed") return Math.min(v, cartSubtotal);
        return Math.min((cartSubtotal * v) / 100, cartSubtotal);
    }, [discountValue, discountMode, cartSubtotal]);

    const taxableBase = useMemo(() => Math.max(cartSubtotal - discountAmount, 0), [cartSubtotal, discountAmount]);
    const taxAmount = useMemo(() => (taxEnabled ? taxableBase * TAX_RATE : 0), [taxEnabled, taxableBase]);
    const grandTotal = useMemo(() => taxableBase + taxAmount, [taxableBase, taxAmount]);

    const clearInlineError = () => setErrorInline("");

    // ... (Keep all functions: validateAddToCart, addToCart, incQty, decQty, removeLine, placeOrder)
    const validateAddToCart = () => {
        if (items.length === 0) return "No items available. Add items first.";
        if (!selectedItem) return "Select an item.";
        const q = Number(orderQty);
        if (orderQty === "" || Number.isNaN(q) || q <= 0) return "Enter a valid qty.";
        if (q > Number(selectedItem.qtyOnHand)) return "Not enough stock.";
        return "";
    };

    const addToCart = () => {
        clearInlineError();
        const msg = validateAddToCart();
        if (msg) { setErrorInline(msg); showToast(msg, "error"); return; }
        const q = Number(orderQty);
        setCart((prev) => {
            const existing = prev.find((l) => String(l.itemId) === String(selectedItem.id));
            if (!existing) {
                return [...prev, { itemId: selectedItem.id, description: selectedItem.description, unitPrice: Number(selectedItem.unitPrice), qty: q }];
            }
            const newQty = existing.qty + q;
            if (newQty > Number(selectedItem.qtyOnHand)) {
                showToast("Exceeds stock", "error"); return prev;
            }
            return prev.map((l) => String(l.itemId) === String(selectedItem.id) ? { ...l, qty: newQty } : l);
        });
        setOrderQty("");
        showToast("Added to cart", "success");
    };

    const incQty = (itemId) => {
        const it = items.find((x) => String(x.id) === String(itemId));
        if (!it) return;
        setCart((prev) => prev.map((l) => {
            if (String(l.itemId) !== String(itemId)) return l;
            if (l.qty + 1 > Number(it.qtyOnHand)) { showToast("Stock limit", "error"); return l; }
            return { ...l, qty: l.qty + 1 };
        }));
    };

    const decQty = (itemId) => {
        setCart((prev) => prev.map((l) => String(l.itemId) === String(itemId) ? { ...l, qty: Math.max(l.qty - 1, 1) } : l).filter((l) => l.qty > 0));
    };

    const removeLine = (itemId) => {
        setCart((prev) => prev.filter((l) => String(l.itemId) !== String(itemId)));
    };

    const placeOrder = async () => {
        clearInlineError();
        if (cart.length === 0) { setErrorInline("Cart empty"); return; }
        if (!selectedCustomer) { setErrorInline("Select customer"); return; }
        const payload = {
            orderId: Number(orderSeq),
            date: orderDate,
            customerId: Number(selectedCustomer.id),
            orderDetails: cart.map((l) => ({ itemId: Number(l.itemId), qty: Number(l.qty), unitPrice: Number(l.unitPrice) })),
        };
        try {
            setPlacing(true);
            await orderApi.placeOrder(payload);
            const orderSummary = {
                id: crypto.randomUUID(), orderId: orderDisplayId, date: orderDate, customerId: selectedCustomer.id, customerName: selectedCustomer.name,
                lines: cart, subtotal: cartSubtotal, discountMode, discountValue, discountAmount, taxEnabled, taxAmount, total: grandTotal,
            };
            setOrders((prev) => [orderSummary, ...prev]);
            try { const fresh = await itemApi.getAll(); setItems(Array.isArray(fresh) ? fresh : []); } catch (e) {}
            setCart([]); setSelectedItemId(""); setOrderQty(""); setDiscountValue(""); setTaxEnabled(false);
            setOrderSeq((s) => s + 1); setSuccessOpen(true); showToast("Order placed", "success");
        } catch (err) {
            setErrorInline("Order failed.");
            showToast("Order failed", "error");
        } finally { setPlacing(false); }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold text-gray-900">New Sale</h2>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                            <ReceiptText className="mr-2 h-4 w-4" />
                            <span className="font-mono font-medium text-gray-900">{orderDisplayId}</span>
                        </div>
                        <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span className="font-medium text-gray-900">{orderDate}</span>
                        </div>
                    </div>
                </div>
                {errorInline && (
                    <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mt-4 text-sm flex items-center">
                        <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                        {errorInline}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Input (4 cols) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-4 border-b border-gray-100 pb-2">Customer</h3>
                        {customers.length === 0 ? (
                            <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500 text-sm">
                                No customers found.
                            </div>
                        ) : (
                            <>
                                <Select
                                    label="Select Customer"
                                    value={selectedCustomerId}
                                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                                >
                                    <option value="">-- Choose Customer --</option>
                                    {customers.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </Select>
                                {selectedCustomer && (
                                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mt-4">
                                        <p className="font-bold text-blue-900">{selectedCustomer.name}</p>
                                        <p className="text-sm text-blue-700 mt-1">{selectedCustomer.address}</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-4 border-b border-gray-100 pb-2">Add Item</h3>
                        {items.length === 0 ? (
                            <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500 text-sm">
                                No items found.
                            </div>
                        ) : (
                            <>
                                <Select
                                    label="Select Item"
                                    value={selectedItemId}
                                    onChange={(e) => setSelectedItemId(e.target.value)}
                                >
                                    <option value="">-- Choose Item --</option>
                                    {items.map((it) => (
                                        <option key={it.id} value={it.id}>{it.description}</option>
                                    ))}
                                </Select>
                                {selectedItem && (
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase">Price</p>
                                            <p className="font-bold text-gray-900">Rs {Number(selectedItem.unitPrice).toFixed(2)}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase">Stock</p>
                                            <p className="font-bold text-gray-900">{selectedItem.qtyOnHand}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="mt-4 flex items-end gap-3">
                                    <div className="flex-1">
                                        <Input
                                            label="Quantity"
                                            type="number"
                                            value={orderQty}
                                            onChange={(e) => setOrderQty(e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                    <Button onClick={addToCart} className="mb-[1px]" disabled={placing}>
                                        Add
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right: Cart (8 cols) */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[500px]">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <h3 className="text-sm font-bold uppercase text-gray-600 flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4" /> Current Cart
                            </h3>
                            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {cart.length} Items
              </span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-0">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white sticky top-0 shadow-sm z-10 text-xs text-gray-500 uppercase font-semibold">
                                <tr>
                                    <th className="px-4 py-3 bg-gray-50">Item</th>
                                    <th className="px-4 py-3 bg-gray-50 text-center">Qty</th>
                                    <th className="px-4 py-3 bg-gray-50 text-right">Price</th>
                                    <th className="px-4 py-3 bg-gray-50 text-right">Total</th>
                                    <th className="px-4 py-3 bg-gray-50 text-center"></th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {cart.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-gray-400 italic">
                                            Cart is empty. Add items to begin.
                                        </td>
                                    </tr>
                                ) : (
                                    cart.map((l) => (
                                        <tr key={l.itemId} className="group hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">{l.description}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center bg-white border border-gray-200 rounded-md w-fit mx-auto">
                                                    <button
                                                        onClick={() => decQty(l.itemId)}
                                                        className="p-1 hover:bg-gray-100 text-gray-500"
                                                        disabled={placing}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="w-8 text-center font-medium text-gray-700">{l.qty}</span>
                                                    <button
                                                        onClick={() => incQty(l.itemId)}
                                                        className="p-1 hover:bg-gray-100 text-gray-500"
                                                        disabled={placing}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right text-gray-600">
                                                {Number(l.unitPrice).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium text-gray-900">
                                                {(l.qty * l.unitPrice).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => removeLine(l.itemId)}
                                                    disabled={placing}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Section */}
                        <div className="bg-gray-50 p-6 border-t border-gray-200">
                            <div className="space-y-2 mb-4">
                                <Row label="Subtotal" value={`Rs ${cartSubtotal.toFixed(2)}`} />

                                <div className="flex justify-between items-center py-2 text-sm">
                                    <span className="text-gray-500">Discount</span>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={discountMode}
                                            onChange={(e) => setDiscountMode(e.target.value)}
                                            className="bg-white border border-gray-300 text-xs rounded px-2 py-1 outline-none focus:border-blue-500"
                                        >
                                            <option value="percent">%</option>
                                            <option value="fixed">Rs</option>
                                        </select>
                                        <input
                                            type="number"
                                            value={discountValue}
                                            onChange={(e) => setDiscountValue(e.target.value)}
                                            className="w-16 bg-white border border-gray-300 text-xs rounded px-2 py-1 outline-none focus:border-blue-500 text-right"
                                            placeholder="0"
                                        />
                                        <span className="text-red-600 w-20 text-right">- {discountAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-2 text-sm">
                                    <span className="text-gray-500">Tax ({`${(TAX_RATE * 100).toFixed(0)}%`})</span>
                                    <div className="flex items-center gap-2">
                                        <label className="flex items-center cursor-pointer">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={taxEnabled}
                                                    onChange={() => setTaxEnabled(!taxEnabled)}
                                                />
                                                <div className={`block w-10 h-6 rounded-full transition-colors ${taxEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${taxEnabled ? 'translate-x-4' : ''}`}></div>
                                            </div>
                                        </label>
                                        <span className="text-gray-700 w-20 text-right">+ {taxAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="pt-4 mt-2 border-t border-gray-200">
                                    <Row label="Grand Total" value={`Rs ${grandTotal.toFixed(2)}`} size="xl" strong />
                                </div>
                            </div>

                            <Button onClick={placeOrder} className="w-full py-3 text-base shadow-md" disabled={placing || cart.length === 0}>
                                {placing ? "Processing..." : "Place Order"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                open={successOpen}
                title="Success"
                onClose={() => setSuccessOpen(false)}
                footer={
                    <Button onClick={() => setSuccessOpen(false)}>Continue</Button>
                }
            >
                <div className="text-center py-4">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <ReceiptText className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Order Placed!</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Order <span className="font-mono font-bold text-gray-900">{makeOrderDisplayId(orderSeq - 1)}</span> has been successfully saved.
                    </p>
                </div>
            </Modal>
        </div>
    );
}

function Row({ label, value, strong, size = "base" }) {
    return (
        <div className={`flex items-center justify-between ${size === 'xl' ? 'text-xl' : 'text-sm'}`}>
            <span className={strong ? "font-bold text-gray-900" : "text-gray-500"}>{label}</span>
            <span className={strong ? "font-bold text-gray-900" : "font-medium text-gray-900"}>{value}</span>
        </div>
    );
}