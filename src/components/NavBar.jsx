import React, { useEffect } from "react";
import { useAuth } from "../provider/authProvider";
import { Button, Container, Navbar, Nav } from "react-bootstrap";

function NavBar() {
  const { axios, token, setToken, profile, setProfile } = useAuth();

  const parseProfile = JSON.parse(profile);

  const getProfile = () => {
    if (axios.defaults.headers.common["Authorization"] && token) {
      axios.get("/me").then(({ data }) => {
        setProfile(data);
      });
    }
  };
  const logout = () => {
    setToken(null);
    setProfile(null);
  };

  useEffect(() => {
    getProfile();
  }, [token]);

  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Playlist APP</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/music">Music</Nav.Link>
            <Nav.Link href="/playlists">Playlists</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link
              target="_blank"
              href={`${parseProfile?.external_urls?.spotify}`}
            >
              {parseProfile?.display_name}
            </Nav.Link>
            <Button className="ms-1 btn-sm" variant="danger" onClick={logout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
