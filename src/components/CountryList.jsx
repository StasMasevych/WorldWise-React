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

  // Create arr of objects  with country and emoji properties
  const countries = uniqueCountries.map((country) => {
    //take the objects to put in the new arr
    const cityWithCountry = cities.find((city) => city.country === country);

    return {
      country: country,
      emoji: cityWithCountry.emoji,
    };
  });

  /* console.log(uniqueCountries); */
  /*  console.log(countries); */

  // other option with reduce

  const countries2 = cities.reduce((arr, city) => {
    //if arr does not have country then new arr and push countries

    if (!arr.map((el) => el.city).includes(city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji }];
    } else {
      return arr;
    }
  }, []);

  console.log(countries2);

  return (
    <ul className={styles.countryList}>
      {countries2.map((country) => (
        <CountryItem key={country.id} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
