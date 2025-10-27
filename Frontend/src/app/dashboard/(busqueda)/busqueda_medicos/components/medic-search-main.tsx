"use client";

import { Row, Col } from "antd";

import { SearchCardPersonal } from "@/components/custom/search-card";
import {
  DropdownMenuCheckboxes,
  DropdownOneSelected,
} from "@/components/custom/dropdown";

import "./dropdown-medic.css";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckedState } from "@radix-ui/react-checkbox";
export function MedicSearchMain() {
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
  const [searchInput, setSearchInput] = useState<string>("");
  const [pasillos, setTiposFuncionarios] = useState<string[]>([""]);
  const [curPage, setCurPage] = useState<number>(1);

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);

    const firstPage = 1;
    setCurPage(firstPage);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `/dashboard/busqueda_medicos/api/get_all_personal`
        );
        const data: any = await res.json();
        setSearchData(data);
        setChangeableData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `/dashboard/busqueda_medicos/api/get_all_type_personal`
        );
        const data: any = await res.json();
        setTiposFuncionarios(
          data.map((tipoFuncionario: any) => tipoFuncionario["tipo"])
        );
        setTiposFuncionariosAFiltrar(
          data.map((tipoFuncionario: any) => tipoFuncionario["tipo"])
        );
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

  const [pasillosSeleccionados, setPasillosSeleccionados] = useState<
    CheckedState[]
  >(
    filter_specialties["categories"].map((_) =>
      filter_specialties["defaultAllSelected"] ? true : false
    )
  );

  const [pasillosAFiltrar, setTiposFuncionariosAFiltrar] = useState<string[]>(
    []
  );

  const handleFilter = () => {
    let toFilterData = searchData;

    toFilterData = toFilterData.filter((personal) => {
      const funcionarioName = personal["nombre"];
      const funcionarioEspecialidad = personal["tipo"];
      const funcionarioRut = personal["rut"];

      if (
        (funcionarioName.toLowerCase().includes(searchInput) ||
          funcionarioRut.toLowerCase().includes(searchInput)) &&
          pasillosAFiltrar.includes(funcionarioEspecialidad)
      )
        return personal;
    });

    setChangeableData(toFilterData);
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
      setTiposFuncionariosAFiltrar(pasillos);
      return;
    }

    setPasillosSeleccionados(newSeleccionadosEstados);
    setTiposFuncionariosAFiltrar(newPasillos);
  };
  
  return (
    <Row justify="center" align="top">
      <Col xxl={5} xl={5} xs={24} className="split-container-col">
        <div>
          <div className="filterer-item-no-flex">
            <Input
              placeholder={"Buscar un funcionario..."}
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
        className="split-container-col search-medic-container"
      >
        <div>
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
                  {<SearchCardPersonal data={data} />}
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Col>
    </Row>
  );
}
