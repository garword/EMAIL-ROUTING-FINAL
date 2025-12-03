"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Language, t } from "@/lib/translations";
import { Mail, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [language] = useState<Language>("id");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Load language preference
    const savedLang = localStorage.getItem("language") as Language;
    // Language is set to Indonesian by default
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validasi username dan password
    if (username === "windaa" && password === "cantik") {
      // Simpan session ke localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      toast.success(t("Login berhasil!", language));
      
      // Redirect ke halaman utama
      router.push("/");
    } else {
      const errorMsg = t("Username atau password salah", language);
      setError(errorMsg);
      toast.error(errorMsg);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-3 sm:p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="space-y-1.5 pb-3">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 sm:p-2 rounded-lg">
              <Mail className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
            </div>
          </div>
          <CardTitle className="text-lg sm:text-xl text-center">{t("Email Routing Manager", language)}</CardTitle>
          <CardDescription className="text-xs sm:text-sm text-center">
            {t("Silakan masuk untuk melanjutkan", language)}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-3">
            {error && (
              <Alert variant="destructive" className="text-xs sm:text-sm">
                <AlertCircle className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs sm:text-sm">{t("Username", language)}</Label>
              <Input
                id="username"
                type="text"
                placeholder={t("Masukkan username", language)}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="focus:ring-indigo-500 h-8 sm:h-9 text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs sm:text-sm">{t("Password", language)}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("Masukkan password", language)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pr-9 sm:pr-10 focus:ring-indigo-500 h-8 sm:h-9 text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-3 sm:w-4 h-3 sm:h-4" />
                  ) : (
                    <Eye className="w-3 sm:w-4 h-3 sm:h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs sm:text-sm h-9 sm:h-10"
              disabled={isLoading}
            >
              {isLoading ? t("Loading...", language) : t("Masuk", language)}
            </Button>

            <div className="pt-2 text-center text-xs sm:text-sm text-gray-500 space-y-0.5">
              <p className="font-medium">{t("Demo Credentials:", language)}</p>
              <p className="font-mono text-xs">Username: windaa</p>
              <p className="font-mono text-xs">Password: cantik</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
