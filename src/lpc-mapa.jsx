import "core-js/stable";
import "whatwg-fetch";

import React from "react";
import ReactDOM from "react-dom";

import peopleByDistricts from "./people_by_districts.json";
import offices from "./offices.json";
import Map from "./Map.jsx";

const LpcMapaApp = () => {
  const peopleCount = React.useMemo(() => {
    return Object.values(peopleByDistricts).reduce(
      (carry, value) => carry + value,
      0
    );
  }, [peopleByDistricts]);

  return (
    <div>
      <div className="lpc-mapa--header-currently">
        Aktuálně máme registrováno {offices.length}&nbsp;ambulancí a&nbsp;
        {peopleCount}
        &nbsp;dobrovolníků z&nbsp;celé ČR
      </div>

      <div className="lpc-mapa--map-container">
        <Map offices={offices} peopleByDistricts={peopleByDistricts} />
      </div>
    </div>
  );
};

const rootEl = document.getElementById("lpc-mapa-root");
if (rootEl) {
  ReactDOM.render(<LpcMapaApp />, rootEl);
}
