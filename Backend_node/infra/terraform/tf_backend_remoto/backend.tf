terraform {
  backend "remote" {
    organization = var.organization

    workspaces {
      name = var.workspace
    }
  }
}
