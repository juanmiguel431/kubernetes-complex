import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Fib = () => {

  const [seenInIndexes, setSeenInIndexes] = useState([]);
  const [values, setValues] = useState<any>({});
  const [index, setIndex] = useState('');


  const fetchValues = useCallback(async () => {
    const values = await axios.get('/api/values/current');
    // console.log({ values });
    setValues(values?.data);
  }, []);

  const fetchIndexes = useCallback(async () => {
    const seenIndexes = await axios.get('/api/values/all');
    // console.log({ seenIndexes });
    setSeenInIndexes(seenIndexes?.data || []);
  }, []);

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, [fetchValues, fetchIndexes]);

  const renderSeenIndexes = useCallback(() => {
    return seenInIndexes.map(({ number }) => number).join(', ');
  }, [seenInIndexes]);

  const renderValues = useCallback(() => {
    const entries = [];

    for (const key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }

    return entries;
  }, [values]);

  const handleSubmit = useCallback(async (event:  React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await axios.post('/api/values', { index: index });
    setIndex('');
  }, [index]);

  return (
    <div>
      <h2>Fibonacci Calculator - Kubernetes version</h2>
      <header>
        <Link to="/other-page">Other Page</Link>
      </header>
      <form onSubmit={(event) => handleSubmit(event)}>
        <label>Enter your index:</label>
        <input
          value={index}
          onChange={event => setIndex(event.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes()}

      <h3>Calculated values:</h3>
      {renderValues()}
    </div>
  );
};

export default Fib;
