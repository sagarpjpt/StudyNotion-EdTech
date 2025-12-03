import { Outlet } from "react-router-dom";

import Sidebar from "../components/core/Dashboard/Sidebar";

import MobileBottomNav from "../components/core/Dashboard/MobileBottomNav";

function Dashboard() {
  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-[1000px] py-10 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </div>
      </div>
      {/* bottom navbar for mobile */}
      <MobileBottomNav />
    </>
  );
}

export default Dashboard;
