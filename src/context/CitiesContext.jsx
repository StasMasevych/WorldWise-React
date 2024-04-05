import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  if (action.type === "loading") {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === "cities/loaded") {
    return {
      ...state,
      isLoading: false,
      cities: action.payload,
    };
  }

  if (action.type === "city/loaded") {
    return {
      ...state,
      isLoading: false,
      currentCity: action.payload,
    };
  }

  if (action.type === "city/added") {
    return {
      ...state,
      isLoading: false,
      cities: [...state.cities, action.payload],
    };
  }

  if (action.type === "city/deleted") {
    return {
      ...state,
      isLoading: false,
      cities: action.payload,
    };
  }

  if (action.type === "rejected") {
    return {
      ...state,
      loading: false,
      error: action.payload,
    };
  }

  throw new Error("Unknown action type");
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  /* const [cities, setCities] = useState([]);
  const [currentCity, setCurrentCity] = useState({});
  console.log(cities);
  console.log(currentCity);
  const [isLoading, setIsLoading] = useState(false);
  console.log("isLoading", isLoading); */

  useEffect(function () {
    dispatch({ type: "loading" });
    async function fetchCities() {
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "The was an error at loading data...",
        });
      }
    }
    fetchCities();
    console.log("fetchCities call");
  }, []);

  // get city from json file DB by get request to server

  async function getCity(id) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      console.log("city loaded", data);
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "The was an error at loading data...",
      });
    }
  }

  // Post new city to json DB by post request to server

  async function addNewCity(newCityData) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCityData),
      });

      if (!res.ok) {
        throw new Error("Failed to add new city");
      }

      const newAddedCity = await res.json();
      dispatch({ type: "city/added", payload: newAddedCity });
      /* const updatedCities = [...cities, newAddedCity];
      setCities(updatedCities); */
      console.log("New city added:", newAddedCity);
      // Handle success, e.g., update state or trigger a refresh of city data
    } catch {
      dispatch({
        type: "rejected",
        payload: "The was an error at adding city...",
      });
    }
  }

  // Delete a city from json DB by delete request to server

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });

      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete new city");
      }
      //changing UI state with deleting
      const newArrayOfCities = cities.filter((city) => city.id !== id);
      dispatch({ type: "city/deleted", payload: newArrayOfCities });

      console.log("City deleted successfully");
    } catch {
      dispatch({
        type: "rejected",
        payload: "The was an error at deleting city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        getCity,
        addNewCity,
        deleteCity,
        isLoading,
        currentCity,
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
