"use client";

import { Row, Col } from "antd";

import { SearchCard } from "@/components/custom/search-card";

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

  const [pasillos, setPasillos] = useState<string[]>([""]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `/dashboard/busqueda_general/api/get_all_boxes`
        );
        const data: any = await res.json();
        setSearchData(data["dataArr"]);
        setChangeableData(data["dataArr"]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/dashboard/general/api/get_specialties`);
        const data: any = await res.json();
        setPasillos(
          data["data"].map((especialidad: any) => especialidad["especialidad"])
        );
        setPasillosAFiltrar(data["data"].map((especialidad: any) => especialidad["especialidad"]));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const filter_specialties = {
    name: "Pasillo",
    desc: "Elija pasillo de box...",
    categories: pasillos,
    defaultAllSelected: false,
  };
  
  let dataArr = changeableData;

  const [pasillosSeleccionados, setPasillosSeleccionados] = useState<
    CheckedState[]
  >(
    filter_specialties["categories"].map((_) =>
      filter_specialties["defaultAllSelected"] ? true : false
    )
  );

  const [pasillosAFiltrar, setPasillosAFiltrar] = useState<string[]>([]);

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);

    const firstPage = 1;
    setCurPage(firstPage);
  };

  const handleFilter = () => {
    let toFilterData = searchData;

    toFilterData = toFilterData.filter((box) => {
      const boxName = `BOX - ${box["box"]}`;
      const boxEspecialidad = box["especialidad"];
      const boxEstado = box["estado"];
      const boxOcupancia = parseFloat(box["ocupancia"]);

      if (
        boxName.toLowerCase().includes(searchInput) &&
        pasillosAFiltrar.includes(boxEspecialidad) &&
        estadosAFiltrar.includes(boxEstado) &&
        boxOcupancia >= usagePercentage
      )
        return box;
    });

    setChangeableData(toFilterData);
  };

  const startIndex = (curPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, dataArr.length);

  const visibleData = dataArr.slice(startIndex, endIndex);

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
      const curSeleccionadoEstado = pasillosSeleccionados[i];

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
      setPasillosSeleccionados(newSeleccionadosEstados);
      setPasillosAFiltrar(pasillos);
      return;
    }

    setPasillosSeleccionados(newSeleccionadosEstados);
    setPasillosAFiltrar(newPasillos);
  };

  const filter_state = {
    name: "Estado actual",
    desc: "Elija por estado de box...",
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
  const [estadosAFiltrar, setEstadosAFiltrar] = useState<string[]>(
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
                placeholder={"Buscar una box..."}
                className="rounded-lg border"
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="filterer-item-flex">
              <DropdownMenuCheckboxes
                data={filter_specialties}
                value={pasillosSeleccionados}
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
