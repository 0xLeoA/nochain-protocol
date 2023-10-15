import React, { useState } from 'react';
import styles from '@/styles/Home.module.css' // Import your CSS file

function Home() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className={styles.container}>
    <input
      className={styles.auto-resize-input} // Apply a CSS class
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      placeholder="Type something..."
    /></div>
  );
}

export default Home;



