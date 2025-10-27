import "../busq-general.css";
import { SearchGeneralMain } from "../components/main-search-general";

/*
  TODO:
    3. Connect the cards with the backend to gather data
    6. Connect the chart with the calendar system
    7. Limit amount of boxes per page depending on filter and current page
*/

export default async function Page({
  params,
}: {
  params: Promise<{ busqueda: string }>;
}) {

  const { busqueda } = await params;
  return (
    <div className="general-search-container">
      <SearchGeneralMain search_input = {busqueda} />
    </div>
  );
}
