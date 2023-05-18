
import React, { createContext, useState, useContext } from "react";


export const FavouritesContext = createContext();

export const useFavourites = () => useContext(FavouritesContext);

function FavouritesContextProvider(props) {
    const [showFavourites, setShowFavourites] = useState(false);



  return (
    <FavouritesContext.Provider value={{ showFavourites, setShowFavourites }}>
      {props.children}
    </FavouritesContext.Provider>
  );
}

export default FavouritesContextProvider;