"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function EnhancedLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userId", data.user_id);
        localStorage.setItem("isAuthenticated", "true");
        router.push("/home");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // aqui mona: alterei o fundo e o texto para as cores que você pediu
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#a3b18a", color: "#344e41" }}
    >
      <div
        className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-2xl transform transition-all hover:scale-105"
        style={{ color: "#344e41" }} // aqui mona: texto verde escuro no card
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold">Que bom que voltou!</h2>
          <p className="mt-2 text-sm">Logue na sua conta</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Label htmlFor="email-address" className="sr-only">
                Email
              </Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Senha"
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <Label htmlFor="remember-me" className="ml-2 block text-sm">
                Lembre de mim
              </Label>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white"
              style={{ backgroundColor: "#344e41", hover: { backgroundColor: "#2a3d33" } }} // aqui mona: botão com fundo verde escuro
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Logar"}
            </Button>
          </div>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm">
            Não tem uma conta?{" "}
            <Link href="/register" className="font-medium" style={{ color: "#344e41" }}>
              Crie uma conta aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
