import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

function Music() {
  const navigate = useNavigate();

  const { axios, token, profile } = useAuth();
  const [search, setSearch] = useState("");
  const [musicList, setMusicList] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setSelectedTrack({});
  };
  const handleShow = () => setShow(true);

  const parseProfile = JSON.parse(profile);

  const searchMusic = (e) => {
    e.preventDefault();
    if (token) {
      axios
        .get(`/search?type=track&market=TH&q=${encodeURI(search)}`)
        .then(({ data }) => {
          setMusicList(data);
        });
    }
  };

  const getPlaylist = (item) => {
    setSelectedTrack(item);
    if (axios.defaults.headers.common["Authorization"] && token) {
      axios.get(`/users/${parseProfile.id}/playlists`).then(({ data }) => {
        setPlaylist(data);
        handleShow();
      });
    }
  };

  const addTrackToPlaylist = (e) => {
    e.preventDefault();
    if (axios.defaults.headers.common["Authorization"] && token) {
      axios
        .post(`/playlists/${selected}/tracks`, {
          uris: [selectedTrack.uri],
          position: 0,
        })
        .then(({ data }) => {
          handleClose();
          navigate(`/playlist/${selected}`, { replace: true });
        });
    }
  };

  return (
    <div className="container mt-5">
      <Row xs={12} className="mb-2">
        <Col>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={addTrackToPlaylist}>
                <Form.Control
                  required
                  as="select"
                  type="select"
                  aria-label="Default select example"
                  className="mb-2"
                  onChange={(e) => setSelected(e.target.value)}
                >
                  <option value="">Select playlist</option>
                  {playlist?.items?.map((_, idx) => (
                    <option key={_.id} value={_.id}>
                      {_.name}
                    </option>
                  ))}
                </Form.Control>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button type="submit" variant="primary" className="ms-1">
                  Add
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Form onSubmit={searchMusic}>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Music name"
                aria-label="Music name"
                aria-describedby="Music name"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                type="submit"
                variant="outline-secondary"
                id="button-addon2"
              >
                Search
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
      <Row xs={2} md={4} className="g-4">
        {musicList?.tracks?.items.map((_, idx) => (
          <Col key={idx}>
            <Card>
              <Card.Img
                height={180}
                variant="top"
                src={_.album.images[0].url}
              />
              <Card.Body>
                <Card.Title>{_.album.name}</Card.Title>
                {/* <Card.Text>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit
                  longer.
                </Card.Text> */}
                <Button
                  className="ms-1"
                  variant="success"
                  onClick={() => getPlaylist(_)}
                >
                  Add to playlist
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Music;
