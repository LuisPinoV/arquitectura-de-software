import { DropdownMenuCheckboxes } from "@/components/custom/dropdown";
import { SearchForm } from "@/components/search-form";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

import "./dropdown-boxes.css";

const filter_specialties = {
  name: "Pasillo",
  desc: "Elija pasillo de box...",
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
  defaultAllSelected: false,
};

const filter_state = {
  name: "Estado actual",
  desc: "Elija por estado de box...",
  categories: ["Libre", "Ocupado", "Libre especialidad"],
  defaultAllSelected:false,
};

export function BoxFilters() {
  return (
    <div>
      <div className="filterer-item-no-flex">
        <SearchForm placeholder={"Buscar una box..."} />
      </div>
      <div className="filterer-item-flex">
        <DropdownMenuCheckboxes data={filter_specialties} />
      </div>
      <div className="filterer-item-flex">
        <DropdownMenuCheckboxes data={filter_state} />
      </div>
      <div className="filterer-item-no-flex">
        <p style={{ margin: "5px 0" }}>Porcentaje de uso - 100%</p>
        <Slider defaultValue={[100]} step={0.1} />
      </div>
      <div className="filterer-item-flex">
        <Button style = {{flex:"1 1 100%"}}>Filtrar</Button>
      </div>
    </div>
  );
}
