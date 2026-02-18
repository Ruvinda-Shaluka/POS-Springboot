import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Sidebar />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                <Outlet />
            </main>
        </div>
    );
}