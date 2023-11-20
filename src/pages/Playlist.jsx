import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

function PlayList({ props }) {
  let { id } = useParams();
  const navigate = useNavigate();

  const { axios, token, profile } = useAuth();
  // const [search, setSearch] = useState("");
  const [musicList, setMusicList] = useState([]);

  const getTrack = () => {
    if (axios.defaults.headers.common["Authorization"] && token) {
      axios
        .get(`/playlists/${id}`)
        .then(({ data }) => {
          setMusicList(data);
        })
        .catch((e) => {
          navigate("/playlists", { replace: true });
        });
    }
  };
  const removeTrack = (snapshot_id, { track: { uri } }) => {
    if (axios.defaults.headers.common["Authorization"] && token) {
      axios
        .delete(`playlists/${id}/tracks`, {
          data: {
            tracks: [{ uri }],
            snapshot_id,
          },
        })
        .then(({ data }) => {
          if (data.snapshot_id) {
            getTrack();
          }
        });
    }
  };

  useEffect(() => {
    getTrack();
  }, []);

  return (
    <div className="container mt-5">
      <h1>{musicList.name}</h1>
      {musicList?.tracks?.items.length <= 0 ? (
        <Alert variant={"danger"}>No Track</Alert>
      ) : null}
      <Row xs={1} md={3} className="g-4">
        {musicList?.tracks?.items.map((_, idx) => (
          <Col key={idx}>
            <Card>
              <Card.Img
                height={180}
                variant="top"
                src={_.track.album.images[1].url}
              />
              <Card.Body>
                <Card.Title>{_.track.name}</Card.Title>
                {/* <Card.Text>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit
                  longer.
                </Card.Text> */}
                <Button
                  className="ms-1"
                  variant="danger"
                  onClick={() => removeTrack(musicList.snapshot_id, _)}
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

export default PlayList;
