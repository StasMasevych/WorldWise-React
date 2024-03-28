import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const BASE_URL = "http://localhost:8000";

  const [cities, setCities] = useState([]);
  const [currentCity, setCurrentCity] = useState({});
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

  // Assuming you have a function to handle the post request in your component

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

  return (
    <CitiesContext.Provider
      value={{
        cities,
        setCities,
        getCity,
        addNewCity,
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
