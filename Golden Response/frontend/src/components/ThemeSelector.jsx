import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";
import { PaletteIcon } from "lucide-react";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <PaletteIcon className="h-5 w-5 text-base-content opacity-70" />
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-[100] shadow-xl bg-base-200 rounded-2xl w-64 p-3 mt-2 border border-base-300"
      >
        <p className="text-xs font-semibold text-base-content/60 uppercase tracking-widest mb-2 px-1">
          Choose Theme
        </p>
        <div className="grid grid-cols-2 gap-1 max-h-72 overflow-y-auto pr-1">
          {THEMES.map((t) => (
            <button
              key={t}
              data-theme={t}
              onClick={() => setTheme(t)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all
                hover:bg-base-300 cursor-pointer
                ${theme === t ? "bg-primary/20 ring-1 ring-primary font-semibold" : ""}
              `}
            >
              <div className="flex gap-0.5 shrink-0">
                {["bg-primary", "bg-secondary", "bg-accent", "bg-neutral"].map((cls) => (
                  <span key={cls} className={`w-2.5 h-2.5 rounded-full ${cls}`} />
                ))}
              </div>
              <span className="text-xs capitalize truncate">{t}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
