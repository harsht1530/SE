import { useState, useEffect } from 'react';
import apiService from '../services/api';

const useCongressData = (
  mainSearchCongressData, 
  doctorCongressData, 
  mainFlag
) => {
  const [congressData, setCongressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.toString().split(" ");
    return { day, month, year };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (mainFlag && mainSearchCongressData) {
          const formattedData = mainSearchCongressData.map(item => ({
            ...item,
            date: parseDate(item.Date_of_the_Event),
          }));
          setCongressData(formattedData);
        } else if (doctorCongressData && doctorCongressData.length > 0) {
          const formattedData = doctorCongressData.map(item => ({
            ...item,
            date: parseDate(item.Date_of_the_Event),
          }));
          setCongressData(formattedData);
        } else {
          const { congress_data } = await apiService.profiles.congress();
          const formattedData = congress_data.map(item => ({
            ...item,
            date: parseDate(item.Date_of_the_Event),
          }));
          setCongressData(formattedData);
        }
      } catch (err) {
        setError(err.message || "Error fetching congress data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mainSearchCongressData, doctorCongressData, mainFlag]);

  return { congressData, loading, error };
};

export default useCongressData;
