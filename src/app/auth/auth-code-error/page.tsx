import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="mx-auto max-w-md border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Authorization Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="leading-relaxed text-gray-600">
            We encountered an issue while processing your authentication
            request. This might be due to an expired link or invalid
            credentials.
          </p>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <Button asChild className="flex-1" variant="default">
              <Link href="/sign-in" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Link>
            </Button>

            <Button asChild className="flex-1" variant="outline">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
