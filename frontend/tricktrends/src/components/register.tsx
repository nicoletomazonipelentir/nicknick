"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPageComponent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        await response.json();
        router.push("/login");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#a3b18a", color: "#344e41" }} // Alteração no fundo e no texto
    >
      <div
        className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg"
        style={{ color: "#344e41" }} // Texto no card
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold">Criar uma conta</h2>
          <p className="mt-2 text-sm">Junte-se a gente</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Label htmlFor="name" className="sr-only">
                Nome Completo
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                onChange={handleInputChange}
                value={formData.name}
                placeholder="Nome Completo"
              />
            </div>
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
                onChange={handleInputChange}
                value={formData.email}
                placeholder="Email"
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
                autoComplete="new-password"
                required
                onChange={handleInputChange}
                value={formData.password}
                placeholder="Senha"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="sr-only">
                Confirme a Senha
              </Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                onChange={handleInputChange}
                value={formData.confirmPassword}
                placeholder="Confirme a Senha"
              />
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white"
              style={{ backgroundColor: "#344e41", hover: { backgroundColor: "#2a3d33" } }} // Botão verde escuro
            >
              Cadastrar
            </Button>
          </div>
        </form>
        <div className="text-center">
          <p className="mt-2 text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-medium" style={{ color: "#344e41" }}>
              Logue aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
