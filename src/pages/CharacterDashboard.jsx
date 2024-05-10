import React, { useState, useEffect } from "react";
import CharacterForm from "../components/CharacterForm";
import axios from "axios";

const CharactersDashboard = () => {
  const [characters, setCharacters] = useState([]);
  const [currentCharacter, setCurrentCharacter] = useState(null);

  const apiKey = import.meta.env.KEY;
  const apiUrl = import.meta.env.API_URL;
  // Fetch characters from the backend
  useEffect(() => {
    axios
      .get("https://kekken-backend.onrender.com/api/characters")
      .then((response) => {
        setCharacters(response.data);
      })
      .catch((error) => console.error("Error fetching characters", error));
  }, []);

  const saveCharacter = (character) => {
    const payload = {
      key: apiKey,
      ...character,
    };
    const method = character.id ? "patch" : "post";
    const url = character.id
      ? `${apiUrl}/api/characters/${character.id}`
      : `${apiUrl}/api/characters`;

    axios[method](url, payload)
      .then((response) => {
        if (method === "post") {
          setCharacters([...characters, response.data]); // Add new character to list
        } else {
          const updatedCharacters = characters.map((item) =>
            item.id === character.id ? response.data : item
          );
          setCharacters(updatedCharacters); // Update the list with the edited character
        }
        setCurrentCharacter(null); // Reset the current character
      })
      .catch((error) => console.error("Error saving character", error));
  };

  const handleEdit = (character) => {
    setCurrentCharacter(character);
  };

  return (
    <div>
      {/* List of characters */}
      {characters.map((character) => (
        <div key={character.id}>
          {character.name}
          <button onClick={() => handleEdit(character)}>Edit</button>
        </div>
      ))}
      {/* Character Form */}
      <CharacterForm characterData={currentCharacter} onSave={saveCharacter} />
    </div>
  );
};

export default CharactersDashboard;
