import React, { useState, useEffect } from "react";
import { TextField, Button, Paper, Grid, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const CharacterForm = ({ characterData, onSave }) => {
  const [character, setCharacter] = useState({
    name: "",
    image: "",
    mostImportantGrabs: [],
    guaranteedFollowUps: [],
    heatEngagers: [],
    importantMoves: [],
    punishers: { startup: [] },
    importantCombos: [
      {
        launchers: [],
        followUps: [],
        followUpSimple: [],
        vidUrl: "",
        endTime: "",
      },
    ],
    wallCombos: { general: [], withTornado: [] },
    comboEnders: [],
    heatSystem: { ender: "", engager: "" },
  });

  useEffect(() => {
    if (characterData) {
      setCharacter(characterData);
    }
  }, [characterData]);

  const handleChange = (event, index, key, subkey) => {
    const { name, value } = event.target; // Extract name and value from event.target
    setCharacter((prevCharacter) => {
      const updatedCharacter = { ...prevCharacter }; // Create a new character object based on the previous state

      if (key) {
        // If there's a key, we're updating a nested property
        let reference = updatedCharacter; // Start with the top-level character object
        const keys = key.split("."); // Split the key on '.' to navigate through nested objects
        keys.forEach((k, idx) => {
          if (idx === keys.length - 1) {
            // If it's the last key, update or assign the value
            if (subkey) {
              // If there's a subkey, it means we are targeting a property in an object in an array
              if (Array.isArray(reference[k]) && reference[k][index]) {
                reference[k][index][subkey] = value;
              } else {
                // Handle potential error or unexpected structure
                console.error(
                  "Expected an array at",
                  k,
                  "but found:",
                  reference[k]
                );
              }
            } else {
              // No subkey, so assign the value directly
              reference[k] = value;
            }
          } else {
            // Navigate deeper into the object
            reference = reference[k] = reference[k] || {}; // Ensure intermediate objects exist
          }
        });
      } else {
        // If no key, it's a top-level property
        updatedCharacter[name] = value;
      }

      return updatedCharacter; // Return the updated character
    });
  };

  const handleAddField = (key, newItem) => {
    const updated = { ...character };
    let ref = updated;
    key.split(".").forEach((k) => {
      if (!ref[k]) {
        ref[k] = [];
      } else {
        ref = ref[k];
      }
    });
    ref.push(newItem);
    setCharacter(updated);
  };

  const handleRemoveField = (key, idx) => {
    const updated = { ...character };
    let ref = updated;
    const keys = key.split(".");
    keys.forEach((k) => {
      if (!ref[k]) {
        return; // If key does not exist, stop execution
      } else if (Array.isArray(ref[k])) {
        ref = ref[k];
      }
    });
    if (idx >= 0 && idx < ref.length) {
      ref.splice(idx, 1);
    }
    setCharacter(updated);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(character);
  };
  const handleAddCombo = () => {
    const newCombo = {
      launchers: [],
      followUps: [],
      followUpSimple: [],
      vidUrl: "",
      endTime: "",
    };
    setCharacter((prevState) => ({
      ...prevState,
      importantCombos: [...prevState.importantCombos, newCombo],
    }));
  };

  const handleRemoveCombo = (index) => {
    setCharacter((prevState) => ({
      ...prevState,
      importantCombos: prevState.importantCombos.filter((_, i) => i !== index),
    }));
  };
  const handleArrayChange = (key, index, subKey, value, subIndex) => {
    setCharacter((prev) => {
      const newCharacter = { ...prev };
      newCharacter[key][index][subKey][subIndex] = value;
      return newCharacter;
    });
  };

  const handleAddToArray = (key, index, subKey) => {
    setCharacter((prev) => {
      const newCharacter = { ...prev };
      newCharacter[key][index][subKey].push("");
      return newCharacter;
    });
  };

  const handleRemoveFromArray = (key, index, subKey, subIndex) => {
    setCharacter((prev) => {
      const newCharacter = { ...prev };
      newCharacter[key][index][subKey].splice(subIndex, 1);
      return newCharacter;
    });
  };

  return (
    <Paper style={{ padding: 20 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="name"
              label="Character Name"
              value={character.name}
              onChange={(e) => handleChange(e)}
              margin="normal"
            />
            <TextField
              fullWidth
              name="image"
              label="Image URL"
              value={character.image}
              onChange={(e) => handleChange(e)}
              margin="normal"
            />
          </Grid>

          {Object.entries({
            "Most Important Grabs": "mostImportantGrabs",
            "Main combos": "importantCombos",
            "Guaranteed Follow-Ups": "guaranteedFollowUps",
            "Heat Engagers": "heatEngagers",
            "Important Moves": "importantMoves",
            "Startup Punishers": "punishers.startup",
            "General Wall Combos": "wallCombos.general",
            "Tornado Wall Combos": "wallCombos.withTornado",
            "Combo Enders": "comboEnders",
          }).map(
            ([label, section]) =>
              character[section] && (
                <DynamicSection
                  key={section}
                  label={label}
                  data={character[section]}
                  section={section}
                  handleChange={handleChange}
                  handleAddField={handleAddField}
                  handleRemoveField={handleRemoveField}
                />
              )
          )}

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="ender"
              label="Heat System Ender"
              value={character.heatSystem.ender}
              onChange={(e) => handleChange(e, null, "heatSystem", "ender")}
              margin="normal"
            />
            <TextField
              fullWidth
              name="engager"
              label="Heat System Engager"
              value={character.heatSystem.engager}
              onChange={(e) => handleChange(e, null, "heatSystem", "engager")}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Save Character
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

const DynamicSection = ({
  label,
  data,
  section,
  handleChange,
  handleAddField,
  handleRemoveField,
}) => {
  return (
    <Grid item xs={12}>
      <Button
        onClick={() => handleAddField(section, getDefaultNewItem(section))}
        variant="contained"
        startIcon={<AddIcon />}
        style={{ margin: "10px 0" }}
      >
        Add New {label}
      </Button>
      {data.map((item, idx) => (
        <Grid container spacing={2} key={idx}>
          {Object.keys(item)
            .filter((key) => key !== "_id")
            .map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  fullWidth
                  label={`${key.charAt(0).toUpperCase() + key.slice(1)}`}
                  value={item[key]}
                  onChange={(e) => handleChange(e, idx, section, key)}
                  margin="normal"
                />
              </Grid>
            ))}
          <IconButton
            onClick={() => handleRemoveField(section, idx)}
            style={{ marginTop: 20 }}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      ))}
    </Grid>
  );
};

function getDefaultNewItem(section) {
  switch (section) {
    case "mostImportantGrabs":
      return { move: "", escape: "" }; // Adjusted based on your typical data structure
    case "guaranteedFollowUps":
      return { move: "", followUp: "" };
    case "heatEngagers":
      return { move: "", description: "" };
    case "importantMoves":
      return { move: "" };
    case "punishers.startup":
      return { move: "", frames: "" };
    case "importantCombos":
      return {
        launchers: [],
        followUps: [],
        followUpSimple: [],
        vidUrl: "",
        endTime: "",
      };
    case "wallCombos.general":
    case "wallCombos.withTornado":
      return { move: "", followUp: "" };
    case "comboEnders":
      return { move: "", category: "" };
    default:
      return {};
  }
}

export default CharacterForm;
