"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaStar } from "react-icons/fa";
import GenreSelection from "./genre";

export default function GeneratePage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    genre: "",
    artist: "",
    exampleSong: "",
    danceability: 50,
    disableExplicit: false,
  });
  const [songs, setSongs] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [artistOptions, setArtistOptions] = useState<string[]>([]);
  const [genreOptions, setGenreOptions] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [exampleSongOptions, setExampleSongOptions] = useState<string[]>([]);
  const normalizedFavorites = favorites.map(String);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userId = localStorage.getItem("userId");

    if (!isAuthenticated || isAuthenticated !== "true" || !userId) {
      router.push("/login");
    } else {
      fetchFavorites(userId); // Fetch favorites when the page loads
    }
  }, [router]);

  const fetchFavorites = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/favorites/all?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.map((favorite: any) => favorite.track_id)); // Store only track IDs
      }
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [artistsResponse, genresResponse, songsResponse] = await Promise.all([
          fetch("http://localhost:5000/api/v1/artists"),
          fetch("http://localhost:5000/api/v1/genres"),
          fetch("http://localhost:5000/api/v1/track_names"),
        ]);

        const artistsData = await artistsResponse.json();
        const genresData = await genresResponse.json();
        const songsData = await songsResponse.json();

        setArtistOptions(artistsData.artists || []);
        setGenreOptions(genresData.genres || []);
        setExampleSongOptions(songsData.track_names || []);
      } catch (error) {
        console.error("Erro ao buscar opções:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleFavorite = async (trackId: string) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Usuário não autenticado");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/v1/favorite/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, track_id: trackId }),
      });

      if (response.ok) {
        alert("Música adicionada aos favoritos!");
        fetchFavorites(userId); // Refresh the favorites list
      } else {
        alert("Não foi possível adicionar a música aos favoritos. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao favoritar música:", error);
      alert("Ocorreu um erro. Tente novamente mais tarde.");
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);
    setErrorMessage(null); // Clear previous error messages
    try {
      const response = await fetch("http://localhost:5000/api/v1/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Um erro inesperado"); // Set error message
        throw new Error("API returned an error");
      }
  
      const result = await response.json();
      setSongs(result);
      setStep(5); // Move to results display
    } catch (error) {
      console.error("Erro ao buscar músicas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const Step1 = () => (
    <div className="text-center">
      <h2 className="text-2xl mb-5 mt-[7.5%] font-bold">Qual é o seu mood hoje?</h2>
      <div className="relative flex justify-center -ml-[70%]">
        <GenreSelection formData={formData} setFormData={setFormData} />
      </div>
      <div className="flex justify-end -mt-11 ml-[65%] absolute">
        <Button onClick={() => setStep(3)} className="dark:bg-black bg-black text-white">
          Próximo
        </Button>
      </div>
    </div>
  );
  

  const Step3 = () => (
    <div className="text-center">
      <h2 className="text-2xl mb-5 mt-[7.5%] font-bold">Quanto você quer dançar?</h2>
      <Slider
        className="w-[60%] mx-auto bg-black"
        min={0}
        max={100}
        step={1}
        value={[formData.danceability]}
        onValueChange={(value) => setFormData({ ...formData, danceability: value[0] })}
      />
      <div className="mt-4 w-[20%] mx-auto flex justify-between">
        <Button onClick={() => setStep(2)} className="bg-black text-white">
          Voltar
        </Button>
        <Button onClick={() => setStep(4)} className="bg-black text-white">
          Próximo
        </Button>
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="text-center">
      <h2 className="text-2xl mb-5 mt-[7.5%] font-bold">Deseja evitar músicas explícitas?</h2>
      <Checkbox
        checked={formData.disableExplicit}
        onCheckedChange={(value) => setFormData({ ...formData, disableExplicit: !!value })}
        className="mt-4 mx-auto w-16 h-16 -mt-2"
      />
      <div className="mt-4 w-[20%] ml-[40%] flex justify-between">
        <Button onClick={() => setStep(3)} className="bg-black text-white">
          Voltar
        </Button>
        <Button onClick={onSubmit} className="bg-black text-white">
          Finalizar
        </Button>
      </div>
    </div>
  );

  const Results = () => (
    <div className="flex flex-col items-center text-center">
      <div className="text-center w-[75%]">
        <Button onClick={onSubmit} className="bg-black text-white mr-5">
          Gerar Novamente
        </Button>
        <Button onClick={() => router.push("/home")} className="bg-black text-white">
          Voltar para Home
        </Button>
        <div className="mt-5"></div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><p className="text-center mt-2">Música</p></TableHead>
              <TableHead><p className="text-center mt-2">Artista</p></TableHead>
              <TableHead><p className="text-center mt-2">Álbum</p></TableHead>
              <TableHead><p className="text-center mt-2">Gênero</p></TableHead>
              <TableHead><p className="text-center mt-2">Ação</p></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {songs.map((song, index) => (
              <TableRow key={index}>
                <TableCell>{song.track}</TableCell>
                <TableCell>{song.artist}</TableCell>
                <TableCell>{song.album}</TableCell>
                <TableCell>{song.genre}</TableCell>
                <TableCell>
                <Button
                  className={`${
                    favorites.includes(song.track_id)
                      ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                      : "bg-gray-400 hover:bg-gray-500 text-black"
                  }`}
                  onClick={() => handleFavorite(song.track_id)}
                >
                  <FaStar
                    style={{
                      color: normalizedFavorites.includes(String(song.track_id))
                        ? "yellow"
                        : "black",
                    }}
                  />
                </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-5">Descubra suas novas músicas favoritas</h1>
      {step === 1 && <Step1 />}
      {step === 3 && <Step3 />}
      {step === 4 && <Step4 />}
      {step === 5 && <Results />}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {errorMessage && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
          <h2 className="text-lg font-semibold text-red-600 mb-4">Erro</h2>
          <p className="text-gray-700">{errorMessage}</p>
          <button
            onClick={() => setErrorMessage(null)}
            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Fechar
          </button>
        </div>
      </div>
    )}
    </div>
  );
}
