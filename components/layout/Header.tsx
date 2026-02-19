import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="w-full py-4 px-6 border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.svg" 
            alt="ValixAI Logo" 
            width={40} 
            height={40} 
            className="w-10 h-10"
          />
          <span className="text-2xl font-black text-accent-500 tracking-tight">
            ValixAI
          </span>
        </Link>
        <nav>
          <Link 
            href="/test" 
            className="text-lg font-bold text-brand-600 hover:text-brand-700 transition-colors px-6 py-2 rounded-full border-2 border-brand-100 hover:bg-brand-50"
          >
            Validar Idea
          </Link>
        </nav>
      </div>
    </header>
  );
}
