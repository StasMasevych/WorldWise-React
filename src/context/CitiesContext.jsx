import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const BASE_URL = "http://localhost:8000";

  const [cities, setCities] = useState([]);
  const [currentCity, setCurrentCity] = useState({});
  console.log(cities);
  console.log(currentCity);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(function () {
    setIsLoading(true);
    async function fetchCities() {
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch {
        alert("There is an error loading data ...");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
    console.log("fetchCities call");
  }, []);

  // get city from json file DB by get request to server

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch {
      alert("There is an error loading data ...");
    } finally {
      setIsLoading(false);
    }
  }

  // Post new city to json DB by post request to server

  async function addNewCity(newCityData) {
    try {
      const response = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCityData),
      });

      if (!response.ok) {
        throw new Error("Failed to add new city");
      }

      const data = await response.json();
      console.log("New city added:", data);
      // Handle success, e.g., update state or trigger a refresh of city data
    } catch (error) {
      console.error("Error adding new city:", error);
      // Handle error, e.g., show error message to the user
    }
  }

  // Delete a city from json DB by delete request to server

  async function deleteCity(id) {
    try {
      const response = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("City deleted successfully");
        // Perform any necessary actions after successful deletion
      } else {
        console.error("Failed to delete city");
        // Handle error cases
      }
    } catch (error) {
      console.error("Error deleting city:", error);
      // Handle network errors
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        setCities,
        getCity,
        addNewCity,
        deleteCity,
        isLoading,
        setIsLoading,
        currentCity,
        setCurrentCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("context is outside CitiesProvider");
  return context;
}

export { CitiesContext, CitiesProvider, useCities };
