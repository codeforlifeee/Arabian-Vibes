import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  User,
  Heart,
  ShoppingBag,
  Star,
  Settings,
  LogOut,
  Menu,
  Hotel,
  Umbrella,
  Ship,
  ActivityIcon,
  PersonStanding,
  Accessibility,
} from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { 
  getCurrencySymbol, 
  getSupportedCurrencies, 
  type Currency,
  SUPPORTED_CURRENCIES 
} from "@/lib/currencyApi";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { FaCcVisa, FaPassport } from "react-icons/fa";

const Header = () => {
  const { currentCurrency, setCurrency, getSupportedCurrencies, isLoading, lastUpdated, isUsingFallback, refreshRates } = useCurrency();
  const { user, isAgent, logout } = useAuth();
  const { data: siteSettings, isLoading: settingsLoading, error: settingsError } = useSiteSettings();
  const location = useLocation();
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginTab, setLoginTab] = useState<"login" | "register">("login");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navTabs = [
    { id: "hhome", href: "/", label: "Activities", icon: <ActivityIcon className="w-4 h-4" /> },
    { id: "hhotel", href: "/hotelsearch", label: "Hotels", icon: <Hotel className="w-4 h-4" /> },
    { id: "hholiday", href: "/holidays", label: "Holidays", icon: <Umbrella className="w-4 h-4" /> },
    { id: "hvisa", href: "/visas", label: "Visa", icon: <FaPassport className="w-4 h-4" /> },
    { id: "hcruise", href: "/cruise", label: "Cruise", icon: <Ship className="w-4 h-4" /> },
    { id: "hAboutUs", href: "/about-us", label: "About Us", icon: <PersonStanding className="w-4 h-4" /> },
  ];

  return (
    <header className="w-full bg-background border-b">
      {/* Top Utility Bar */}
      <div className="bg-primary text-primary-foreground text-xs sm:text-sm">
        <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-6">
            {siteSettings.dubaiContactNumber && <span>Dubai: {siteSettings.dubaiContactNumber}</span>}
            {siteSettings.indiaContactNumber && <span>India: {siteSettings.indiaContactNumber}</span>}
            {!siteSettings.dubaiContactNumber && !siteSettings.indiaContactNumber && (
              <span className="text-primary-foreground/60">Contact info loading...</span>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
     




           
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 text-xs sm:text-sm flex items-center">
                  {isLoading && <div className="w-2 h-2 mr-1 rounded-full bg-current animate-pulse" />}
                  {getCurrencySymbol(currentCurrency)} {currentCurrency} 
                  <ChevronDown className="ml-1 w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 sm:w-64 max-h-60 overflow-y-auto text-xs sm:text-sm">
                <div className="px-2 py-1 text-xs text-muted-foreground border-b mb-1">
                  {isLoading ? (
                    "Updating rates..."
                  ) : isUsingFallback ? (
                    "Using offline rates"
                  ) : (
                    "Live exchange rates"
                  )}
                  {lastUpdated && !isLoading && (
                    <div className="text-xs mt-1">
                      Updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                  )}
                </div>
                {getSupportedCurrencies().map((currencyCode) => (
                  <DropdownMenuItem
                    key={currencyCode}
                    onClick={() => setCurrency(currencyCode)}
                    className="flex justify-between"
                  >
                    <span className="flex items-center">
                      <span className="w-8 text-left">{getCurrencySymbol(currencyCode)}</span>
                      <span className="font-medium">{currencyCode}</span>
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {currencyCode === 'AED' ? 'UAE Dirham' : 
                       currencyCode === 'USD' ? 'US Dollar' : 
                       currencyCode === 'INR' ? 'Indian Rupee' : currencyCode}
                    </span>
                  </DropdownMenuItem>
                ))}
                <div className="border-t mt-1 pt-1">
                  <DropdownMenuItem onClick={refreshRates} disabled={isLoading}>
                    <div className="flex items-center w-full justify-center text-xs">
                      {isLoading ? "Refreshing..." : "Refresh Rates"}
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/contact" className="hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/arrabian.png" alt="Arabian Vibes Logo" className="h-10 sm:h-14 w-auto" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {!user ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <LoginDialog isOpen={loginOpen} setIsOpen={setLoginOpen} defaultTab={loginTab}>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setLoginTab("login"); setLoginOpen(true); }}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                  >
                    Log In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => { setLoginTab("register"); setLoginOpen(true); }}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                  >
                    Register
                  </Button>
                </div>
              </LoginDialog>

            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name} {isAgent && '(Agent)'}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 text-xs sm:text-sm">
                <DropdownMenuItem><ShoppingBag className="mr-2 w-4 h-4" /> My Bookings</DropdownMenuItem>
                <DropdownMenuItem><Heart className="mr-2 w-4 h-4" /> My Wishlist</DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="mr-2 w-4 h-4" /> R Points
                  <Badge variant="secondary" className="ml-auto">248</Badge>
                </DropdownMenuItem>
                {isAgent && (
                  <>
                    <DropdownMenuItem className="text-green-600">🎯 Agent Dashboard</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs text-muted-foreground">10% discount applied</DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem><Settings className="mr-2 w-4 h-4" /> Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}><LogOut className="mr-2 w-4 h-4" /> Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 text-xs">
              {navTabs.map((tab) => (
                <DropdownMenuItem key={tab.id} asChild>
                  <Link to={tab.href} className="flex items-center gap-2">
                    {tab.icon}
                    {tab.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop Tabs */}
      <nav className="hidden lg:flex justify-center items-center gap-2 px-4 py-4 border-t border-border bg-gradient-to-r from-blue-50/50 via-white to-blue-50/50 shadow-sm">
        {navTabs.map((tab) => {
          const isActive = location.pathname === tab.href;
          return (
            <Link
              key={tab.id}
              to={tab.href}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm ${isActive
                  ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg scale-110"
                  : "text-gray-700 hover:bg-primary/10 hover:text-primary hover:scale-105 hover:shadow-md bg-white"
                }`}
            >
              <span className="transition-transform group-hover:scale-125">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;
