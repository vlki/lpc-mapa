import "core-js/stable";
import "whatwg-fetch";

import React from "react";
import ReactDOM from "react-dom";
import { uniq } from "lodash";
import clsx from "clsx";

import { publicUrl } from "./shared.js";
import peopleByDistrictsNew from "./people_by_districts.json";
import peopleByDistrictsLegacy from "./people_by_districts_legacy.json";
import officesByDistrictsLegacy from "./offices_by_districts_legacy.json";
import offices from "./offices.json";
import Map from "./Map.jsx";

const LpcMapaApp = () => {
  const [display, setDisplay] = React.useState("all");

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
        Aktuálně máme registrováno {officesCount}&nbsp;ordinací a&nbsp;
        {peopleCount}
        &nbsp;dobrovolníků z&nbsp;celé ČR
      </div>

      <div className="lpc-mapa--display-switch">
        <button
          type="button"
          onClick={() => setDisplay("all")}
          className={clsx({ active: display === "all" })}
        >
          Zobrazit vše
        </button>
        <button
          type="button"
          onClick={() => setDisplay("offices")}
          className={clsx({ active: display === "offices" })}
        >
          <img
            src={publicUrl("marker-icon-office.png")}
            alt="Mapová ikona ordinace"
          />
          Pouze ordinace
        </button>
        <button
          type="button"
          onClick={() => setDisplay("people")}
          className={clsx({ active: display === "people" })}
        >
          <img
            src={publicUrl("marker-icon-person.png")}
            alt="Mapová ikona dobrovolníka"
          />
          Pouze dobrovolníci
        </button>
      </div>

      <div className="lpc-mapa--map-container">
        <Map
          display={display}
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
