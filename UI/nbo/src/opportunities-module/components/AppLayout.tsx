import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Archive, 
  Package,
  Settings, 
  Menu,
  X,
  HelpCircle,
  TrendingUp,
  Award,
  BarChart3,
  Home,
  User
} from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { HelpDialog } from './HelpDialog';

export function AppLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const navigation = [
    // { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Home', href: '/', icon: Home },
    { name: 'Manage Opportunities', href: '/nbos', icon: FileText },
    { name: 'Products', href: '/products', icon: Package },
  ];

  const dataNav = [
    { name: 'Marketshare Gains', href: '/marketshare', icon: TrendingUp },
    { name: 'Design Wins', href: '/design-wins', icon: Award },
    { name: 'Manage Archive', href: '/manage-archive', icon: Archive },
  ];

  const reportsNav = [
    { name: 'NBO Analytics', href: '/analytics', icon: BarChart3 },
  ];

  const masterNav = [
    { name: 'Master Data', href: '/master-data' },
    { name: 'Form Factor', href: '/masters/form-factor' },
    { name: 'Data Rate', href: '/masters/data-rate' },
    { name: 'Stacking', href: '/masters/stacking' },
  ];

  const generalNav = [
    { name: 'General Info', href: '/general-info' },
  ];

  const userNav = [
    { name: 'My Profile', href: '/my-profile' },
    { name: 'Create New User', href: '/user-form' },
    { name: 'User Management', href: '/user-management' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X /> : <Menu />}
            </Button>
            <div>
              <h1 className="text-blue-600">Amphenol Communications Solutions</h1>
              <p className="text-sm text-gray-600">NBO Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setHelpOpen(true)}
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
            <div className="text-right hidden sm:block">
              <p className="text-sm">Welcome, Akhil Anil</p>
              <Button variant="link" className="h-auto p-0 text-sm text-blue-600">
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-[57px] left-0 z-30 h-[calc(100vh-57px)] w-64 
            bg-white border-r border-gray-200 transition-transform lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <nav className="p-4 space-y-6 overflow-y-auto">
            <div>
              <h3 className="px-3 mb-2 text-xs text-gray-500 uppercase tracking-wider">
                Main Menu
              </h3>
              <div className="space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                        ${isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="px-3 mb-2 text-xs text-gray-500 uppercase tracking-wider">
                Data Management
              </h3>
              <div className="space-y-1">
                {dataNav.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm
                        ${isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="px-3 mb-2 text-xs text-gray-500 uppercase tracking-wider">
                Reports
              </h3>
              <div className="space-y-1">
                {reportsNav.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm
                        ${isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="px-3 mb-2 text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Master Data
              </h3>
              <div className="space-y-1">
                {masterNav.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        block px-3 py-2 rounded-lg transition-colors text-sm
                        ${isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
             <div>
              <h3 className="px-3 mb-2 text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <User className="w-5 h-5" />
                User
              </h3>
              <div className="space-y-1">
                {userNav.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        block px-3 py-2 rounded-lg transition-colors text-sm
                        ${isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>           
            <div>
              <h3 className="px-3 mb-2 text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-5 h-5" />
                General Info
              </h3>
              <div className="space-y-1">
                {generalNav.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        block px-3 py-2 rounded-lg transition-colors text-sm
                        ${isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}
