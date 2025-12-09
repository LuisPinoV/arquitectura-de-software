terraform {
  backend "remote" {
    organization = "Donde_Tomas"

    workspaces {
      name = "arquitectura-de-software"
    }
  }
}
