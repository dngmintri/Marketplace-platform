import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - Phase 2 */}
      <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-6">
        <span className="text-xl font-bold text-blue-600">Marketplace</span>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © 2026 Marketplace Platform
      </footer>
    </div>
  );
};

export default MainLayout;
