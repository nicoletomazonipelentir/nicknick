"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

const GenreSelection = ({ formData = {}, setFormData }: any) => {
  // Default to an empty string if `formData.genre` is undefined
  const [query, setQuery] = useState(formData.genre || "");
  const [genreOptions, setGenreOptions] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGenreSelected, setIsGenreSelected] = useState(false); // New state to track if a genre is selected

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/genres?query=${query}`);
        if (response.ok) {
          const data = await response.json();
          setGenreOptions(data.genres || []);
        } else {
          console.error("Erro ao buscar gêneros:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
      }
    };

    if (query.length > 0 && !isGenreSelected) {
      fetchGenres();
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  }, [query, isGenreSelected]);

  const handleSelectGenre = (genre: string) => {
    setQuery(genre);
    setFormData({ ...formData, genre }); // Update formData with the selected genre
    setIsDropdownOpen(false); // Close the dropdown
    setIsGenreSelected(true); // Mark genre as selected
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsGenreSelected(false); // Allow dropdown to reopen if the user starts typing again
  };

  return (
    <div className="relative w-[20%] ml-[40%] text-center">
      <Input
        type="text"
        placeholder="Digite ou escolha um gênero"
        className="mb-2 w-full p-2 border rounded-md"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => !isGenreSelected && setIsDropdownOpen(true)} // Only open dropdown if no genre is selected
      />
      {isDropdownOpen && genreOptions.length > 0 && (
        <div className="absolute bg-white border border-gray-300 rounded-md shadow-md w-full max-h-48 overflow-y-auto z-10">
          {genreOptions.map((genre) => (
            <div
              key={genre}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectGenre(genre)}
            >
              {genre}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenreSelection;
