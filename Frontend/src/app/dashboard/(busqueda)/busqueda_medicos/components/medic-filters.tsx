import { DropdownMenuCheckboxes } from "@/components/custom/dropdown";
import { SearchForm } from "@/components/search-form";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

import "./dropdown-medic.css";

const filter_specialties = {
  name: "Especialidad",
  desc: "Elija especialidad de doctores...",
  categories: [
    "Otorrino",
    "Cirugía general",
    "Kinesiología",
    "Psiquiatría",
    "Oftalmología",
    "Especialidad 1",
    "Especialidad 2",
    "Especialidad 3",
    "Especialidad 4",
    "Especialidad 5",
  ],
};

const filter_state = {
  name: "Estado actual",
  desc: "Elija por estado de médico...",
  categories: ["Libre", "Ocupado"],
};

export function MedicsFilters() {
  return (
    <div>
      <div className="filterer-item-no-flex">
        <SearchForm placeholder={"Buscar Médico..."} />
      </div>
      <div className="filterer-item-flex">
        <DropdownMenuCheckboxes data={filter_specialties} />
      </div>
      <div className="filterer-item-flex">
        <DropdownMenuCheckboxes data={filter_state} />
      </div>
      <div className="filterer-item-flex">
        <Button style = {{flex:"1 1 100%"}}>Filtrar</Button>
      </div>
    </div>
  );
}
