"use client";

import { Row, Col } from "antd";

import { SearchCard } from "@/components/custom/search-card";
import { useUserProfile } from "@/hooks/use-user";

import "./dropdown-boxes.css";
import { Button } from "@/components/ui/button";

import {
  DropdownMenuCheckboxes,
  DropdownOneSelected,
} from "@/components/custom/dropdown";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { CheckedState } from "@radix-ui/react-checkbox";
import { apiFetch } from "@/lib/apiClient";
import { getUserProfile } from "@/utils/get_user_profile";

export function BoxSearchMain() {
  const pagesPerDisplay = {
    name: "20",
    categories: ["5", "10", "20", "25", "50", "100"],
    default: "20",
  };

  const [searchData, setSearchData] = useState<any[]>([]);
  const [changeableData, setChangeableData] = useState<any[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    parseInt(pagesPerDisplay["name"])
  );
  const [curPage, setCurPage] = useState<number>(1);

  const [usagePercentage, setUsagePercentage] = useState<number>(0);

  const [searchInput, setSearchInput] = useState<string>("");

  const [pasillos, setType] = useState<string[]>([""]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await apiFetch(`/api/scheduling/get_boxes`);
        const data: any = await res?.json();

        setSearchData(data ?? []);
        setChangeableData(data ?? []);
      } catch (error) {
        console.error("Error fetching data");
      }
    }

    fetchData();
  }, []);

  const [profile, setClientProfile] = useState<any>(null)
  
    useEffect(() => {
      const p = getUserProfile()
      setClientProfile(p)
    }, [])
  
    const space = profile?.spaceName ?? "Espacio"

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await apiFetch(`/api/general/get_specialties`);
        const data: any = await res?.json();

        if (Array.isArray(data) && data) {
          setType(data.map((type: any) => type["especialidad"]));
          setTypesToFilter(data.map((type: any) => type["especialidad"]));
        } else {
          setType([]);
          setTypesToFilter([]);
        }
      } catch (error) {
        console.error("Error fetching data");
      }
    }

    fetchData();
  }, []);

  const filter_specialties = {
    name: "Tipo",
    desc: `Elija tipo de ${space}...`,
    categories: pasillos,
    defaultAllSelected: false,
  };

  let dataArr = changeableData;

  const [selectedTypes, setSelectedTypes] = useState<
    CheckedState[]
  >(
    filter_specialties["categories"].map((_) =>
      filter_specialties["defaultAllSelected"] ? true : false
    )
  );

  const [typesToFilter, setTypesToFilter] = useState<string[]>([]);

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);

    const firstPage = 1;
    setCurPage(firstPage);
  };

  const handleFilter = () => {
    let toFilterData = searchData;

    toFilterData = toFilterData.filter((spaceData) => {
      const spaceName = `${space} - ${spaceData["idBox"]}`;
      const spaceType = spaceData["especialidad"];
      const spaceState = spaceData["disponible"] ? "Libre" : "Ocupado";
      const spaceBusy = !Number.isNaN(parseFloat(spaceData["ocupancia"])) ? parseFloat(spaceData["ocupancia"]) : 100;

      if (
        (spaceName.toLowerCase().includes(searchInput) || searchInput == "") &&
        (typesToFilter.includes(spaceType) || typesToFilter.length == 0) &&
        (statesToFilter.includes(spaceState) || statesToFilter.length == 0) &&
        spaceBusy  >= usagePercentage
      )
        return spaceData;
    });

    setChangeableData(toFilterData);
  };

  const startIndex = (curPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, dataArr.length);

  console.log(dataArr);

  const visibleData = Array.isArray(dataArr) ? dataArr.slice(startIndex, endIndex) : [];

  const totalPages = Math.ceil(dataArr.length / itemsPerPage);

  const handleNext = () => {
    if (curPage < totalPages) {
      setCurPage(curPage + 1);
    }
  };

  const handlePrev = () => {
    if (curPage > 1) {
      setCurPage(curPage - 1);
    }
  };

  const handleChangeSpecialties = (curSelected: string) => {
    let newPasillos: string[] = [];
    let newSeleccionadosEstados: CheckedState[] = [];

    for (let i = 0; i < filter_specialties.categories.length; i++) {
      const curPasillo = filter_specialties.categories[i];
      const curSeleccionadoEstado = selectedTypes[i];

      if (curPasillo === curSelected) {
        newSeleccionadosEstados.push(!curSeleccionadoEstado);
      } else {
        newSeleccionadosEstados.push(curSeleccionadoEstado);
      }
    }

    for (let i = 0; i < filter_specialties.categories.length; i++) {
      const curSeleccionadoEstado = newSeleccionadosEstados[i];

      if (curSeleccionadoEstado) {
        newPasillos.push(filter_specialties.categories[i]);
      }
    }

    let checkedAllNull = true;

    for (let i = 0; i < newSeleccionadosEstados.length; i++) {
      if (newSeleccionadosEstados[i]) {
        checkedAllNull = false;
      }
    }

    if (checkedAllNull) {
      setSelectedTypes(newSeleccionadosEstados);
      setTypesToFilter(pasillos);
      return;
    }

    setSelectedTypes(newSeleccionadosEstados);
    setTypesToFilter(newPasillos);
  };

  const filter_state = {
    name: "Estado actual",
    desc: `Elija por estado de ${space}...`,
    categories: ["Libre", "Ocupado"],
    defaultAllSelected: false,
  };

  const [estadosSeleccionados, setEstadosSeleccionados] = useState<
    CheckedState[]
  >(
    filter_state["categories"].map((_) =>
      filter_state["defaultAllSelected"] ? true : false
    )
  );
  const [statesToFilter, setEstadosAFiltrar] = useState<string[]>(
    filter_state.categories
  );

  const handleChangeOcupancy = (newSelected: string) => {
    let newEstados: string[] = [];
    let newSeleccionadosEstados: CheckedState[] = [];

    for (let i = 0; i < filter_state.categories.length; i++) {
      const curEstado = filter_state.categories[i];
      const curSeleccionadoEstado = estadosSeleccionados[i];

      if (curEstado === newSelected) {
        newSeleccionadosEstados.push(!curSeleccionadoEstado);
      } else {
        newSeleccionadosEstados.push(curSeleccionadoEstado);
      }
    }

    for (let i = 0; i < filter_state.categories.length; i++) {
      const curSeleccionadoEstado = newSeleccionadosEstados[i];

      if (curSeleccionadoEstado) {
        newEstados.push(filter_state.categories[i]);
      }
    }

    let checkedAllNull = true;

    for (let i = 0; i < newSeleccionadosEstados.length; i++) {
      if (newSeleccionadosEstados[i]) {
        checkedAllNull = false;
      }
    }

    if (checkedAllNull) {
      setEstadosSeleccionados(newSeleccionadosEstados);
      setEstadosAFiltrar(filter_state.categories);
      return;
    }

    setEstadosSeleccionados(newSeleccionadosEstados);
    setEstadosAFiltrar(newEstados);
  };

  return (
    <div>
      <Row justify="center" align="top">
        <Col xxl={5} xl={5} xs={24} className="split-container-col">
          <div>
            <div className="filterer-item-no-flex">
              <Input
                placeholder={`Buscar un/a ${space}...`}
                className="rounded-lg border"
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="filterer-item-flex">
              <DropdownMenuCheckboxes
                data={filter_specialties}
                value={selectedTypes}
                onChange={(selected) => {
                  handleChangeSpecialties(selected);
                }}
              />
            </div>
            <div className="filterer-item-flex">
              {
                <DropdownMenuCheckboxes
                  data={filter_state}
                  value={estadosSeleccionados}
                  onChange={(selected) => handleChangeOcupancy(selected)}
                />
              }
            </div>
            <div className="filterer-item-no-flex">
              <p style={{ margin: "5px 0" }}>
                Porcentaje de uso - {usagePercentage}%
              </p>
              <Slider
                defaultValue={[0]}
                max={100}
                step={10}
                value={[usagePercentage]}
                onValueChange={(e) => setUsagePercentage(e[0])}
              />
            </div>
            <div className="filterer-item-flex">
              <Button style={{ flex: "1 1 100%" }} onClick={handleFilter}>
                Filtrar
              </Button>
            </div>
          </div>
        </Col>
        <Col
          xxl={19}
          xl={19}
          xs={24}
          className="split-container-col search-boxes-container"
        >
          <Row justify="center" align="top" style={{ marginTop: "30px" }}>
            <Col className="options-col" xs={24} md={12} lg={8} xl={8} xxl={8}>
              <div className="dropdown-filters-general">
                <p
                  style={{
                    margin: 0,
                    padding: 0,
                    width: "100%",
                    textAlign: "right",
                    alignSelf: "center",
                    paddingRight: "3%",
                  }}
                >
                  Items por página
                </p>
                <DropdownOneSelected
                  data={pagesPerDisplay}
                  value={itemsPerPage.toString()}
                  onChange={(selected) =>
                    handleItemsPerPageChange(parseInt(selected))
                  }
                />
              </div>
            </Col>
            <Col className="options-col" xs={24} md={12} lg={8} xl={8} xxl={8}>
              <div className="dropdown-filters-general">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={handlePrev} />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink>{curPage}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem></PaginationItem>
                    <PaginationItem>
                      <PaginationNext onClick={handleNext} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </Col>
          </Row>

          <Row justify="center" align="top" style={{ marginTop: "20px" }}>
            {visibleData.map((data: any, i, _) => (
              <Col
                key={i}
                className="search-cards-col"
                xs={16}
                xxl={7}
                xl={7}
                lg={10}
                md={10}
                sm={11}
                style={{
                  margin: "10px 0px 10px 10px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  className="search-cards"
                  style={{
                    alignSelf: "center",
                    flex: "1 1 100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {<SearchCard data={data} />}
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
}
