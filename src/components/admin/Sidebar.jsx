import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, LogOut, ChevronLeft, ChevronRight, FileText, Settings, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ onClose, isCollapsed, toggleCollapse }) => {
  const { logout } = useAuth();

  const menu = [
    { path: '/admin', icon: LayoutDashboard, label: 'Panel' },
    { path: '/admin/urunler', icon: Package, label: 'Ürün Yönetimi' },
    { path: '/admin/siparisler', icon: ShoppingBag, label: 'Siparişler' },
    { path: '/admin/kategoriler', icon: LayoutDashboard, label: 'Kategoriler' },
    { path: '/admin/sayfalar', icon: FileText, label: 'Sayfa Yönetimi' },
    { path: '/admin/ayarlar', icon: Settings, label: 'Ayarlar (Kargo)' },
    { path: '/admin/profil', icon: User, label: 'Profil Ayarları' },
  ];

  return (
    <aside className={`bg-white border-r border-gray-100 flex flex-col shadow-soft z-20 transition-all duration-300 md:rounded-br-3xl md:border-b ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-5 border-b border-gray-50 flex flex-col gap-1 relative h-[70px] justify-center">
        {!isCollapsed ? (
          <>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none whitespace-nowrap">YÖNETİM</span>
            <span className="text-xl font-black text-secondary-900 tracking-tighter italic whitespace-nowrap">PANELİ</span>
          </>
        ) : (
          <span className="text-xl font-black text-primary tracking-tighter italic mx-auto">YP</span>
        )}
        
        {/* Toggle Button for Desktop */}
        <button 
          onClick={toggleCollapse}
          className="absolute -right-3 top-5 bg-white border border-gray-200 text-gray-500 rounded-full p-1 hover:text-primary hover:border-primary shadow-sm z-50 hidden md:flex items-center justify-center transition-transform hover:scale-110"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col justify-start">
        <nav className="px-3 py-3 space-y-0.5">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={onClose}
              title={isCollapsed ? item.label : ''}
              className={({ isActive }) =>
                `flex items-center gap-2.5 py-2 rounded-lg transition-all duration-300 font-bold text-xs uppercase tracking-wider ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.01]'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary hover:translate-x-0.5'
                } ${isCollapsed ? 'justify-center px-0' : 'px-3'}`
              }
            >
              <item.icon size={16} className="transition-colors min-w-[16px]" strokeWidth={2.5} />
              {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </NavLink>
          ))}
          
          <button
            onClick={logout}
            title={isCollapsed ? "Çıkış Yap" : ""}
            className={`flex items-center gap-2.5 w-full py-2 rounded-lg font-bold text-xs uppercase tracking-wider text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300 group ${isCollapsed ? 'justify-center px-0' : 'px-3'}`}
          >
            <LogOut size={16} className="group-hover:rotate-12 transition-transform min-w-[16px]" strokeWidth={2.5} />
            {!isCollapsed && <span className="whitespace-nowrap">ÇIKIŞ YAP</span>}
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;