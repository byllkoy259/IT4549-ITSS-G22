import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const SearchBar = () => {
  const [myOptions, setMyOptions] = useState([]);

  const getDataFromAPI = () => {
    console.log("Fetching options from API");

    fetch("http://localhost:3000/auth/pet-owners")
      .then((response) => response.json())
      .then((res) => {
        if (res && res.Result && res.Result.length > 0) {
          const options = res.Result.map((item) => item.owner_name);
          setMyOptions(options);
          console.log("Options fetched from API:", options);
        } else {
          console.log(
            "No data received from API or unexpected response structure"
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching options from API:", error);
      });
  };

  return (
    <div>
      <Autocomplete
        style={{ width: 500 }}
        freeSolo
        autoComplete
        autoHighlight
        options={myOptions}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={getDataFromAPI}
            variant="outlined"
            label="Search Box"
          />
        )}
      />
    </div>
  );
};

export default SearchBar;
