import "./busq-general.css";
import { SearchGeneralMain } from "./components/main-search-general";

/*
  TODO:
    3. Connect the cards with the backend to gather data
    5. Connect the search bar with the search page
    6. Connect the chart with the calendar system
    7. Limit amount of boxes per page depending on filter and current page
*/

export default function Page() {

  return (
    <div className="general-search-container">
      <SearchGeneralMain />
    </div>
  );
}
