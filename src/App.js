import React, { useState, useEffect } from 'react';
import List from './List';

function App() {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [image, setImage] = useState('');
  const [showForm, setShowForm] = useState(false); // State for form visibility

  // Function to calculate age from birthday
  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Load data from local storage when the component mounts
  useEffect(() => {
    const savedPeople = JSON.parse(localStorage.getItem('people')) || [];
    setPeople(savedPeople);
  }, []);

  // Save data to local storage whenever `people` changes
  useEffect(() => {
    localStorage.setItem('people', JSON.stringify(people));
  }, [people]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !birthday) return;  // Check for empty fields

    const newPerson = {
      id: new Date().getTime().toString(),
      name,
      age: calculateAge(birthday), // Calculate age based on the birthday
      birthday,
      image: image || 'https://www.w3schools.com/w3images/avatar2.png' // Default avatar image if none provided
    };

    setPeople([...people, newPerson]);
    setName('');
    setBirthday('');
    setImage('');
    setShowForm(false); // Hide form after submission
  };

  const toggleForm = () => {
    setShowForm(!showForm); // Toggle form visibility
  };

  const today = new Date();
  const todayMonthDay = `${today.getMonth() + 1}`.padStart(2, '0') + '-' + `${today.getDate()}`.padStart(2, '0');

  console.log("Today's Date (MM-DD):", todayMonthDay);

  const todaysBirthdays = people
    .map(person => ({
      ...person,
      age: calculateAge(person.birthday), // Compute age here
    }))
    .filter(person => {
      const personBirthday = new Date(person.birthday);
      const personMonthDay = `${personBirthday.getMonth() + 1}`.padStart(2, '0') + '-' + `${personBirthday.getDate()}`.padStart(2, '0');
      console.log(`Comparing today's date ${todayMonthDay} with ${person.name}'s birthday ${personMonthDay}`);
      return personMonthDay === todayMonthDay;
    });

  return (
    <main>
      <section className="container">
        <h3>{todaysBirthdays.length} birthdays today</h3>
        <List people={todaysBirthdays} />
        <button onClick={() => setPeople([])}>Clear All</button>
        <button onClick={toggleForm}>
          {showForm ? 'Hide Form' : 'Add Birthday'}
        </button>
        {showForm && ( // Conditionally render form based on showForm state
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="date" placeholder="Birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
              <input type="text" placeholder="Image URL (optional)" value={image} onChange={(e) => setImage(e.target.value)} />
              <button type="submit">Add Person</button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
