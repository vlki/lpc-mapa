import "core-js/stable";
import "whatwg-fetch";

import React from "react";
import ReactDOM from "react-dom";
import { uniq } from "lodash";

import peopleByDistrictsNew from "./people_by_districts.json";
import peopleByDistrictsLegacy from "./people_by_districts_legacy.json";
import officesByDistrictsLegacy from "./offices_by_districts_legacy.json";
import offices from "./offices.json";
import Map from "./Map.jsx";

const LpcMapaApp = () => {
  const peopleByDistricts = React.useMemo(() => {
    return uniq([
      ...Object.keys(peopleByDistrictsNew),
      ...Object.keys(peopleByDistrictsLegacy),
    ]).reduce((carry, district) => {
      return {
        ...carry,
        [district]:
          (peopleByDistrictsNew[district]
            ? peopleByDistrictsNew[district]
            : 0) +
          (peopleByDistrictsLegacy[district]
            ? peopleByDistrictsLegacy[district]
            : 0),
      };
    }, {});
  }, [peopleByDistrictsNew, peopleByDistrictsLegacy]);
  console.log(peopleByDistricts);

  const peopleCount = React.useMemo(() => {
    return Object.values(peopleByDistricts).reduce(
      (carry, value) => carry + value,
      0
    );
  }, [peopleByDistricts]);

  const officesCount = React.useMemo(() => {
    return (
      offices.length +
      Object.values(officesByDistrictsLegacy).reduce(
        (carry, value) => carry + value,
        0
      )
    );
  }, [officesByDistrictsLegacy, offices]);

  return (
    <div>
      <div className="lpc-mapa--header-currently">
        Aktuálně máme registrováno {officesCount}&nbsp;ambulancí a&nbsp;
        {peopleCount}
        &nbsp;dobrovolníků z&nbsp;celé ČR
      </div>

      <div className="lpc-mapa--map-container">
        <Map
          offices={offices}
          peopleByDistricts={peopleByDistricts}
          officesByDistricts={officesByDistrictsLegacy}
        />
      </div>
    </div>
  );
};

const rootEl = document.getElementById("lpc-mapa-root");
if (rootEl) {
  ReactDOM.render(<LpcMapaApp />, rootEl);
}
