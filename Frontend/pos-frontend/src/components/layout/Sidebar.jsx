import { NavLink } from "react-router-dom";
import { Home, ShoppingCart, Users } from "lucide-react";

const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`
        }
    >
        {({ isActive }) => (
            <>
                <Icon
                    className={`mr-3 h-5 w-5 ${
                        isActive ? "text-blue-600" : "text-gray-400"
                    }`}
                />
                {label}
            </>
        )}
    </NavLink>
);

export default function Sidebar() {
    return (
        <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
            <div className="flex items-center justify-center h-16 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                    POS <span className="text-blue-600">System</span>
                </h1>
            </div>
            <nav className="flex-1 px-3 py-6 space-y-1">
                <NavItem to="/orders" icon={ShoppingCart} label="Orders" />
                <NavItem to="/customers" icon={Users} label="Customers" />
                <NavItem to="/items" icon={Home} label="Items" />
            </nav>
            <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-gray-400 text-center">© 2026 POS Inc.</p>
            </div>
        </div>
    );
}