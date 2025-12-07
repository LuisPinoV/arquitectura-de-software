#public

resource "aws_subnet" "public_subnet" {
  vpc_id = aws_vpc.main.id
  cidr_block        = var.public_subnet_cidr
  availability_zone = "${var.region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet"
    Tier = "public"
  }
}

#private

resource "aws_subnet" "private_subnet" {
  vpc_id = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidr
  availability_zone = "${var.region}a"

  tags = {
    Name = "private-subnet"
    Tier = "private"
  }
}
