import { useState } from "react";
import { useEffect } from "react";
import { Nutrition } from "./Nutrition";
import { LoaderPage } from "./LoaderPage";
import Swal from 'sweetalert2';
import './App.css';


function App() {

  const [search, setSearch] = useState();
  const [wordSubmitted, setWordSubmitted] = useState('');
  const [ingredients, setIngredients] = useState();
  const [loader, setLoader] = useState(false);

  const APP_ID = 'dc43f5c9';
  const APP_KEY = '41004f36187693a52846881269bea7f0';
  const APP_URL = 'https://api.edamam.com/api/nutrition-details'

  const fetchData = async (ingr) => {
    setLoader(true);

    const response = await fetch(`${APP_URL}?app_id=${APP_ID}&app_key=${APP_KEY}`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingr: ingr })
    })

    if(response.ok) {
      setLoader(false);
      const data = await response.json();
      setIngredients(data);
    } 
    else{
      setLoader(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Look at the instruction above!',
      }) 
    }
  }

  const myRecipeSearch = e => {
    setSearch(e.target.value);
  }

  const finalSearch = e => {
    e.preventDefault();
    setWordSubmitted(search);
  }

  useEffect(() => {
    if (wordSubmitted !== '') {
      let ingr = wordSubmitted.split(/[,,;,\n,\r]/);
      fetchData(ingr);
    }
  }, [wordSubmitted])


  return (
    <div className="container">
      {loader && <LoaderPage />}

      <h1>Nutrition Analysis</h1>
      <p>Enter an ingredient list list for what you are cooking</p>
      <p>Ex:"1 cup rice, 10 oz chickpeas", etc.</p>
      <form onSubmit={finalSearch}>
        <input
          placeholder="Search..."
          onChange={myRecipeSearch}
        />
        <button type="submit">Search</button>
      </form>
      <div className="nutrition">
        {
          ingredients && <p>{ingredients.calories} kcal</p>
        }
        {
          ingredients && Object.values(ingredients.totalNutrients)
            .map(({ label, quantity, unit }) =>
              <Nutrition
                label={label}
                quantity={quantity}
                unit={unit}
              />
            )
        }
      </div>
    </div>
  );
}

export default App;

