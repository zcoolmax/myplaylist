import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Form, Alert, Modal } from "react-bootstrap";

import { useAuth } from "../provider/authProvider";

function PlayLists() {
  const { axios, token, profile } = useAuth();
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const parseProfile = JSON.parse(profile);

  const getPlaylist = () => {
    if (axios.defaults.headers.common["Authorization"] && token) {
      axios.get(`/users/${parseProfile.id}/playlists`).then(({ data }) => {
        setPlaylist(data);
      });
    }
  };

  const CreatePlaylist = (e) => {
    e.preventDefault();
    if (axios.defaults.headers.common["Authorization"] && token) {
      axios
        .post(`/users/${parseProfile.id}/playlists`, {
          name: playlistName,
          description: playlistDesc,
          public: true,
        })
        .then(({ data }) => {
          setPlaylistName("");
          setPlaylistDesc("");
          getPlaylist();
          handleClose();
        });
    }
  };

  const removePlaylist = ({ id }) => {
    if (axios.defaults.headers.common["Authorization"] && token) {
      axios.delete(`playlists/${id}/followers`).then(({ data }) => {
        getPlaylist();
      });
    }
  };

  useEffect(() => {
    getPlaylist();
  }, []);

  return (
    <div className="container mt-5">
      <Row xs={12} className="mb-2">
        <Col>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={CreatePlaylist}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    onChange={(e) => setPlaylistName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setPlaylistDesc(e.target.value)}
                  />
                </Form.Group>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button type="submit" variant="primary" className="ms-1">
                  Create
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
          <Button variant="primary" onClick={handleShow}>
            Create New Playlist
          </Button>
        </Col>
      </Row>
      {playlist?.items?.length <= 0 ? (
        <Alert variant={"danger"}>No Playlist</Alert>
      ) : null}
      <Row xs={1} md={3} className="g-4">
        {playlist?.items?.map((_, idx) => (
          <Col key={idx}>
            <Card>
              {_.images.length ? (
                <Card.Img height={180} variant="top" src={_?.images[0].url} />
              ) : (
                <svg
                  className="bd-placeholder-img card-img-top"
                  width="100%"
                  height="180"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid slice"
                  focusable="false"
                  role="img"
                  aria-label="Placeholder: Image cap"
                >
                  <title>Placeholder</title>
                  <rect width="100%" height="100%" fill="#868e96"></rect>
                </svg>
              )}
              <Card.Body>
                <Card.Title>
                  <a href={`playlist/${_?.id}`}>{_?.name}</a>
                </Card.Title>
                {/* <Card.Text>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit
                  longer.
                </Card.Text> */}
                <a className="btn btn-primary" href={`playlist/${_?.id}`}>
                  View
                </a>
                {/* <Button variant="primary">view</Button> */}
                <Button
                  className="ms-1"
                  variant="danger"
                  onClick={() => removePlaylist(_)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default PlayLists;
