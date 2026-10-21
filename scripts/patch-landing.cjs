const fs = require('fs');
const path = require('path');

const appPath = path.resolve('src/App.tsx');
let code = fs.readFileSync(appPath, 'utf8');

// 1. Add LandingPage import
if (!code.includes("import { LandingPage }")) {
  code = code.replace(
    "import { MetasTrackerModal } from './components/MetasTrackerModal';",
    "import { MetasTrackerModal } from './components/MetasTrackerModal';\r\nimport { LandingPage } from './components/LandingPage';"
  );
}

// 2. Add ArrowLeft to lucide-react imports if not present
if (!code.includes("ArrowLeft,")) {
  code = code.replace(
    "  ChevronLeft,\r\n",
    "  ChevronLeft,\r\n  ArrowLeft,\r\n"
  );
}

// 3. Add routing state right before `return (` at line ~990
const routingCode = `  const [currentRoute, setCurrentRoute] = useState<'landing' | 'app'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as any).standalone === true;
      if (path.startsWith('/app') || path.startsWith('/terminal') || isStandalone) {
        return 'app';
      }
    }
    return 'landing';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/app') || path.startsWith('/terminal')) {
        setCurrentRoute('app');
      } else {
        setCurrentRoute('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: 'landing' | 'app') => {
    setCurrentRoute(route);
    const targetPath = route === 'app' ? '/app' : '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  if (currentRoute === 'landing') {
    return <LandingPage onEnterApp={() => navigateTo('app')} />;
  }

  return (`;

if (!code.includes("const [currentRoute, setCurrentRoute] = useState<'landing' | 'app'>")) {
  const targetReturn = "  return (\r\n    <div className=\"h-full h-dvh w-full max-w-full bg-white text-[#1e293b] font-sans flex flex-col overflow-hidden select-none\">";
  code = code.replace(targetReturn, routingCode + "\r\n    <div className=\"h-full h-dvh w-full max-w-full bg-white text-[#1e293b] font-sans flex flex-col overflow-hidden select-none\">");
}

// 4. Add "Página Inicial" button inside the Header next to logo
const logoTarget = `            <div className="flex items-baseline gap-1.5 leading-none">\r\n              <span className="font-black text-sm tracking-tight text-white">AntiTrader</span>\r\n              <span className="hidden md:inline text-[9px] font-semibold text-emerald-400 uppercase tracking-wider">\r\n                Setup Graham &amp; Bazin\r\n              </span>\r\n            </div>\r\n          </div>\r\n\r\n        </div>`;

const logoReplacement = `            <div className="flex items-baseline gap-1.5 leading-none">\r\n              <span className="font-black text-sm tracking-tight text-white">AntiTrader</span>\r\n              <span className="hidden md:inline text-[9px] font-semibold text-emerald-400 uppercase tracking-wider">\r\n                Setup Graham &amp; Bazin\r\n              </span>\r\n            </div>\r\n          </div>\r\n\r\n          <button\r\n            onClick={() => navigateTo('landing')}\r\n            className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-2 py-1 rounded border border-slate-200 transition-colors cursor-pointer shadow-2xs"\r\n            title="Ver Página Inicial & Planos de Assinatura"\r\n          >\r\n            <ArrowLeft className="w-3 h-3 text-slate-400" />\r\n            <span className="hidden sm:inline">Página Inicial</span>\r\n          </button>\r\n        </div>`;

if (!code.includes("Ver Página Inicial & Planos de Assinatura") && code.includes(logoTarget)) {
  code = code.replace(logoTarget, logoReplacement);
}

fs.writeFileSync(appPath, code, 'utf8');
console.log('App.tsx successfully patched with Landing Page routing!');
