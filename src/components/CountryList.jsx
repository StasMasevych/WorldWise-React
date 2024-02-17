import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import styles from "./CountryList.module.css";

function CountryList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  if (!cities || cities.length === 0)
    return (
      <Message message="Add you first city by clicking a city on the map" />
    );

  // Extract unique countries
  const uniqueCountries = [...new Set(cities.map((city) => city.country))];

  console.log(uniqueCountries);

  return (
    <div></div>
    /*  <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.id} country={country} />
      ))}
    </ul> */
  );
}

export default CountryList;
