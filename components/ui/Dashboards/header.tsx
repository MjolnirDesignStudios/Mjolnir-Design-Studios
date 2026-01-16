export function MjolnirHeader() {
  return (
    <header className="bg-gradient-to-r from-black via-zinc-950 to-black border-b border-zinc-800/50 p-5 flex items-center justify-between">
      <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        MjolnirUI Pro Dashboard
      </h1>
      {/* Add user avatar, theme switcher, notifications later */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">AlphaTrader84</span>
      </div>
    </header>
  );
}