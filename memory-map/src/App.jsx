import React, { useState } from 'react';
import { AboutNav, BreedNav } from './Navigation';
import { PetList } from './PetList';

function App(props) {
  const [pets, setPets] = useState(props.pets);

  const adoptPet = (name) => {
    const updatedPets = pets.map((pet) => {
      if (pet.name === name) {
        return { ...pet, adopted: true };
      }
      return pet;
    });
    setPets(updatedPets);
  };

  const breeds = [...new Set(pets.map((pet) => pet.breed))];

  return (
    <div>
      <header className="py-3 mb-4">
        <div className="container">
          <h1>Adopt a Pet</h1>
        </div>
      </header>

      <main className="container">
        <div className="row">
          <div id="navs" className="col-3">
            <BreedNav breeds={breeds} />
            <AboutNav />
          </div>

          <div className="col-9">
            <div id="petList">
              <PetList pets={pets} adoptCallback={adoptPet} />
            </div>
          </div>
        </div>
      </main>

      <footer className="container">
        <small>Images from <a href="http://www.seattlehumane.org/adoption/dogs">Seattle Humane Society</a></small>
      </footer>
    </div>
  );
}

export default App;
