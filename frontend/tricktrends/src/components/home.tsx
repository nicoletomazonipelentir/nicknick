import Link from 'next/link'
import { Music, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div
      className="min-h-screen bg-[#a3b18a] text-[#344e41]" // Garantir que o fundo cubra a tela toda
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Trick Trends</h1>
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-stretch">
          <Card className="w-full sm:w-1/2 max-w-md flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-400" />
                Favoritas
              </CardTitle>
              <CardDescription>Veja e gerencie suas músicas favoritas</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>
                Acesse sua biblioteca de músicas favoritas. Organize, redescubra e curta as músicas que você gosta.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/favorites">Ir para as Favoritas</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="w-full sm:w-1/2 max-w-md flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-6 w-6 text-blue-500" />
                Gerar novas músicas
              </CardTitle>
              <CardDescription>Crie uma playlist baseada nas suas preferências</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>
                Descubra novas músicas baseadas no seu estilo musical favorito. Utilizando nossa clusterização, o sistema gera músicas personalizadas para você.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/generate">Gerar Músicas</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
