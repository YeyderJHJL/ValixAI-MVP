import Link from "next/link";

export function Header() {
  return (
    <header className="w-full py-6 px-6 border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-blue-600">
          ValixAI
        </Link>
        <nav>
          <Link href="/test" className="text-xl font-medium text-gray-600 hover:text-blue-600 transition-colors">
            Validar Idea
          </Link>
        </nav>
      </div>
    </header>
  );
}
