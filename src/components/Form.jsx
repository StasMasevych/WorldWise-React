// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useURLPosition } from "../hooks/useURLPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../context/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState("");
  const [isLoadingGeolocation, setIsLoadingGeolocation] = useState(false);
  const [geocodingError, setGeocodingError] = useState("");
  console.log(geocodingError);
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  const [lat, lng] = useURLPosition();
  const { cities, setCities, addNewCity } = useCities();
  const navigate = useNavigate();

  const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

  function handleSubmitForm(e) {
    e.preventDefault();
    console.log(e);

    const newVisitedCity = {
      cityName: cityName,
      date: date.toString(),
      position: {
        lat: lat,
        lng: lng,
      },
      emoji: emoji,
      notes: notes,
      id: crypto.randomUUID(),
    };

    const updatedCities = [...cities, newVisitedCity];

    /* console.log(updatedCities); */
    setCities(updatedCities);
    addNewCity(newVisitedCity);
    navigate("/app/cities");
  }

  useEffect(() => {
    if (!lat && !lng) return;

    async function fetchCityData() {
      try {
        setIsLoadingGeolocation(true);
        setGeocodingError("");
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        console.log(data);
        if (!data.countryCode)
          throw new Error(" There is no city. Please, click on another place");

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName || "");
        setEmoji(convertToEmoji(data.countryCode));
      } catch (error) {
        setGeocodingError(error.message);
      } finally {
        setIsLoadingGeolocation(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  if (!lat && !lng)
    return (
      <Message message="Please, select the city on the map which you visited" />
    );

  if (isLoadingGeolocation) return <Spinner />;

  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form className={styles.form} onSubmit={handleSubmitForm}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
