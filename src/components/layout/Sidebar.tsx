import { NavLink } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { 
  BarChart2, 
  Home, 
  Settings, 
  Upload,
  FileCheck,
  Activity,
  ChevronDown,
  FolderOpen,
  BookType 
} from "lucide-react"

function Sidebar() {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const headerRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const [isIndicadoresOpen, setIsIndicadoresOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard/overview', label: 'Resumen', icon: BarChart2 },
    { path: '/dashboard/surveys', label: 'Encuestas', icon: FileCheck },
    { path: '/dashboard/upload', label: 'Subir Archivos', icon: Upload },
    { path: '/dashboard/settings', label: 'Configuración', icon: Settings },
    { path: '/dashboard/files', label: 'Ver Archivos', icon: FolderOpen  },
    { path: '/dashboard/word-selector', label: 'Selector de Palabras', icon: BookType }
  ]

  const indicadores = [
    { path: '/dashboard/indicadores/ansiedad', label: 'Ansiedad' },
    { path: '/dashboard/indicadores/depresion', label: 'Depresión' },
    { path: '/dashboard/indicadores/estres', label: 'Estrés' },
    { path: '/dashboard/indicadores/conductual', label: 'Conductual' },
    { path: '/dashboard/indicadores/somatizacion', label: 'Somatización' },
    { path: '/dashboard/indicadores/tdah', label: 'TDAH' }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sidebarRef.current, {
        x: -100,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      })

      gsap.from(headerRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.5,
        delay: 0.2,
        ease: "power2.out"
      })

      gsap.from(navItemsRef.current, {
        x: -30,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        delay: 0.4,
        ease: "power2.out"
      })

      gsap.from(footerRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        delay: 0.8,
        ease: "power2.out"
      })
    })

    return () => ctx.revert()
  }, [])

  const handleMouseEnter = (index: number) => {
    gsap.to(navItemsRef.current[index], {
      x: 5,
      duration: 0.3,
      ease: "power2.out"
    })
  }

  const handleMouseLeave = (index: number) => {
    gsap.to(navItemsRef.current[index], {
      x: 0,
      duration: 0.3,
      ease: "power2.out"
    })
  }

  return (
    <aside 
      ref={sidebarRef}
      className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-full"
    >
      <div 
        ref={headerRef}
        className="p-6 border-b border-gray-200"
      >
        <h1 className="text-xl font-semibold text-gray-900 text-center">Sistema Encuestas</h1>
        <img src="/assets/tux.webp" alt="Logo" className="mt-2 w-24 h-24 mx-auto" />
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            ref={(el) => {
              navItemsRef.current[index] = el
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mb-1 ${
                isActive ? 'bg-blue-50 text-blue-600 font-medium' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="mb-1">
          <button
            onClick={() => setIsIndicadoresOpen(!isIndicadoresOpen)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5" />
              <span>Indicadores</span>
            </div>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${
                isIndicadoresOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <div 
            className={`overflow-hidden transition-all duration-300 ${
              isIndicadoresOpen ? 'max-h-60' : 'max-h-0'
            }`}
          >
            <div className="pl-11 space-y-1 mt-1">
              {indicadores.map((indicador) => (
                <NavLink
                  key={indicador.path}
                  to={indicador.path}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors ${
                      isActive ? 'bg-blue-50 text-blue-600 font-medium' : ''
                    }`
                  }
                >
                  {indicador.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div 
        ref={footerRef}
        className="p-4 border-t border-gray-200"
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar