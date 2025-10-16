import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function DemoBanner() {
  const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' ||
                   import.meta.env.VITE_API_URL === 'https://your-backend-api-url.com' || 
                   (import.meta.env.PROD && import.meta.env.VITE_API_URL?.includes('localhost'));

  if (!USE_MOCK) return null;

  return (
    <Alert className="border-blue-200 bg-blue-50 mb-4">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>Demo Mode:</strong> This is a demonstration with sample data. 
        Backend is not connected. All actions are simulated locally.
      </AlertDescription>
    </Alert>
  );
}