import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("token"); // Clear authentication token
    router.push("/signup"); // Redirect to login page
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-lg font-semibold">Doctoral</h1>
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">
              <Link
                href="/profile"
                className="text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Profile
              </Link>
            </div>
          </div>
          <div className="ml-10 space-x-4 flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
