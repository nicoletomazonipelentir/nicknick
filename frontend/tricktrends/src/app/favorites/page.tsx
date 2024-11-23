'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface FavoriteSong {
  album: string
  artist: string[]
  genre: string
  track: string
  track_id: string
}

export default function FavoritesPage() {
  const router = useRouter();

  const [favorites, setFavorites] = useState<FavoriteSong[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          throw new Error('User ID not found in localStorage')
        }

        const response = await fetch('http://localhost:5000/api/v1/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: parseInt(userId, 10) } ),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch favorites')
        }

        const data = await response.json()
        setFavorites(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  return (
    <div className="min-h-screen bg-[#a3b18a] text-[#344e41]">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Suas músicas favoritas</CardTitle>
            <CardDescription>Aqui está a lista das suas músicas favs</CardDescription>
          </CardHeader>
          <Button onClick={() => router.push("/home")} className="ml-8 bg-black text-white">
            Voltar para Home
          </Button>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : favorites.length === 0 ? (
              <div className="text-center text-gray-500">Você ainda não adicionou nenhuma música favorita.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Músicas</TableHead>
                    <TableHead>Artista</TableHead>
                    <TableHead>Album</TableHead>
                    <TableHead>Gênero</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {favorites.map((song) => (
                    <TableRow key={song.track_id}>
                      <TableCell>{song.track}</TableCell>
                      <TableCell>{song.artist.join(', ')}</TableCell>
                      <TableCell>{song.album}</TableCell>
                      <TableCell>{song.genre}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
