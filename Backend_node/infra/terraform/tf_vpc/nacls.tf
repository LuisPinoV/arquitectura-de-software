#public
resource "aws_network_acl" "public_nacl" {
  vpc_id = aws_vpc.main.id

  ingress {
    rule_no    = 100
    protocol   = "-1"
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }

  egress {
    rule_no    = 200
    protocol   = "-1"
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }

  subnet_ids = [aws_subnet.public_subnet.id]
}

#private
resource "aws_network_acl" "private_nacl" {
  vpc_id = aws_vpc.main.id

  ingress {
    rule_no    = 100
    protocol   = "-1"
    action     = "allow"
    cidr_block = aws_vpc.main.cidr_block
    from_port  = 0
    to_port    = 0
  }

  ingress {
    rule_no    = 101
    protocol   = "-1"
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }

  egress {
    rule_no    = 200
    protocol   = "-1"
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }

  subnet_ids = [aws_subnet.private_subnet.id]
}
