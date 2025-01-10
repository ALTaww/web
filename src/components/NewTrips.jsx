import React, { useEffect, useState } from 'react'
// import { tripApi } from '../http/tripApi'
import Trip from './Trip'
import { getLastTrips } from '../http/tripApi'
import Loading from './Loading';

const NewTrips = () => {
  const [lastTrips, setLastTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const response = await getLastTrips(3);
        setLastTrips(response);
      } catch (err) {
        console.log(err)
      }
      setIsLoading(false)
    })();
  }, []);

  if (isLoading) {
    return <Loading/>
  }

  return (
    <div className='new-trips'>
      <h2>Новые поездки</h2>
      {lastTrips.map((trip) => (
        <Trip key={trip.id} {...trip} />
      ))}
    </div>
  );
};

export default NewTrips