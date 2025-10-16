
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="bg-[#000000e6] h-10 px-4 md:px-6 flex items-center justify-between border-b border-[#333333] fixed top-0 left-0 right-0 z-50 mb-6">
      <div className="text-white font-semibold text-xs md:text-sm flex justify-center items-center">
        <span><img src="/FITT-White.png" alt="" className="h-6 w-6 m-1"/></span>
        Foundation For Innovation And Technology Transfer
      </div>
      <div>
        <Button 
          variant="ghost" 
          className="text-[#F1F1F1] hover:text-red-500 hover:bg-transparent"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </nav>
  );
}
