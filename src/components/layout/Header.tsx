function Header() {
  return (
    <div className="p-4">
      <header className="bg-black shadow-xl rounded-2xl mx-auto border border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Dashboard</h2>
          
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              🔔
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-sm font-medium text-gray-300">Admin</span>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header