"use client"
import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { cn } from "@/utils/cn"
import { Menu, MenuItem } from "@/components/ui/navbar-menu"
import { useAuth, ROLES } from '@/context/AuthContext'

function Navbar({ className }: { className?: string }) {
  const { isAuthenticated, user } = useAuth()
  const [active, setActive] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        <div onClick={() => scrollToSection('inicio')} className="cursor-pointer">
          <MenuItem setActive={setActive} active={active} item="Inicio" />
        </div>

        <div onClick={() => scrollToSection('features')} className="cursor-pointer">
          <MenuItem setActive={setActive} active={active} item="Funcionalidades" />
        </div>

        <div onClick={() => scrollToSection('faq')} className="cursor-pointer">
          <MenuItem setActive={setActive} active={active} item="FAQ" />
        </div>

        {isAuthenticated ? (
          <Link to={user?.roleId === ROLES.ADMIN ? "/dashboard" : "/login"}>
            <MenuItem setActive={setActive} active={active} item="Mi Cuenta" />
          </Link>
        ) : (
          <Link to="/login">
            <MenuItem setActive={setActive} active={active} item="Iniciar Sesión" />
          </Link>
        )}
      </Menu>
    </div>
  )
}

export default Navbar