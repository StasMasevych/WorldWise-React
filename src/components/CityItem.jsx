import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../context/CitiesContext";

function CityItem({ city }) {
  const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
      /*  weekday: "long", */
    }).format(new Date(date));

  const { cities, setCities, currentCity, deleteCity } = useCities();

  const { cityName, date, emoji, id, position } = city;

  const isActive = id === currentCity.id;

  return (
    <>
      <li>
        <Link
          className={`${styles.cityItem} ${
            isActive ? styles["cityItem--active"] : ""
          }`}
          to={`${id}?lat=${position.lat}&lng=${position.lng}`}
        >
          {" "}
          {/* add id to the end of current url app/cities */}
          <span className={styles.emoji}>{emoji}</span>
          <h3 className={styles.name}>{cityName}</h3>
          <time className={styles.date}>{formatDate(date)}</time>
          <button
            className={styles.deleteBtn}
            onClick={(event) => {
              event.preventDefault(); // Prevent default link behavior
              const newArrayOfCities = cities.filter((city) => city.id !== id);
              setCities(newArrayOfCities);
              deleteCity(id);
            }}
          >
            &times;
          </button>
        </Link>
      </li>
    </>
  );
}

export default CityItem;
