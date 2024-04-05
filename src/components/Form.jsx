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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  /* console.log(geocodingError); */
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  /* console.log(startDate); */

  const [lat, lng] = useURLPosition();
  const { addNewCity, isLoading } = useCities();

  const navigate = useNavigate();

  const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

  async function handleSubmitForm(e) {
    e.preventDefault();
    /* console.log(e); */

    if (!cityName || !date) return;

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

    //const updatedCities = [...cities, newVisitedCity]; transfer inside function addNewCity

    /* console.log(updatedCities); */
    //setCities(updatedCities); transfer inside function addNewCity
    await addNewCity(newVisitedCity);
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
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmitForm}
    >
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
        <DatePicker
          id="date"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
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
