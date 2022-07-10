import React, { useCallback, useEffect, useState } from 'react';
import qs from 'query-string';
import parse from 'html-react-parser';

// Styles
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Libraries
import axios from "axios";

// Components
import {
  Container,
  Col,
  Row,
  Spinner,
  Card,
  Pagination,
  Popover,
  OverlayTrigger,
  Button,
  Accordion,
  Modal,
} from 'react-bootstrap';

let request = "";
let audio;
function App() {
  const [loading, setLoading] = useState(true);
  const [dataId, setDataId] = useState(1);
  const [data, setData] = useState({});
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [show, setShow] = useState(false);
  const { id } = qs.parse(window.location.search);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        {parse(`${data.news}`)}
      </Popover.Body>
    </Popover>
  );


  const extras = useCallback(() => {
    if (!data?.extra_parts || !typeof data?.extra_parts === "object") return [];
    return Object.values(data.extra_parts).map((value) => {
      if (!value === "") return undefined;
      return <>
        {parse(`${value.replaceAll('href=\"', 'href=\"https://xkcd.com').replaceAll('src=\"', 'src=\"https://xkcd.com')}`)}
      </>
    }).filter(x => x !== undefined);
  }, [data])



  const handleExtraParts = function () {
    handleShow();
    // if (!audio) {
    //   const audioURL = data.extra_parts.post.split("'")[3];
    //   audio = new Audio(audioURL);
    // }

    // if (isAudioPlaying) {
    //   audio.pause();
    //   setIsAudioPlaying(false);
    // } else {
    //   audio.currentTime = 0;
    //   audio.play();
    //   setIsAudioPlaying(true);
    // }
  }

  const getData = async function (id = 1) {
    try {
      if (audio) audio.pause();
      setLoading(true);
      const api = `/api/data?id=${id}`;

      if (request === api) return;
      request = api;

      const { data } = await axios.get(api);
      if (data.success) {
        setData(data.data);
        setDataId(data.data.num);
        const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?id=${data.data.num}`;
        window.history.pushState({ path: newurl }, '', newurl);
      }

    } catch (error) {
      console.log("getData error: ", error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData(id || dataId);
  }, [])

  return (
    <>
      <Container>
        <Row className='my-5 center d-flex justify-content-center align-item-center'>
          <Col xl="6" md="10" xs="12">
            <Card className="shadow mx-auto">
              {!loading ?
                <>
                  <Card.Header><h3 className='text-center'>#{data.num} - {data.title}</h3></Card.Header>
                  <Card.Img variant="top" className='p-3 my-3 mx-auto shadow' style={{ maxWidth: '25rem', cursor: 'pointer' }} src={data.img} onClick={() => { if (data.link) window.open(data.link, '_blank') }} />
                  {data.link && <i className='text-center text-muted'><small>Info: <a href={data.link} target="_blank" rel="noreferrer">{data.link}</a></small></i>}
                  {data.extra_parts &&
                    <>
                      <Row>
                        <Col className='text-center'>
                          <Button size="sm" variant={isAudioPlaying ? "danger" : "success"} onClick={() => {
                            handleExtraParts();
                          }}>Show Extras</Button>
                        </Col>
                      </Row>
                    </>
                  }
                  <Card.Body>
                    <Card.Title>{data.safe_title}</Card.Title>
                    <Card.Text><small className='text-muted'>{data.alt}</small></Card.Text>
                    <Card.Text>
                      {data.transcript && data.transcript}
                    </Card.Text>

                    <Pagination size="lg" className="mt-2 d-flex justify-content-center">
                      <Pagination.First title="First" onClick={() => {
                        getData(1)
                      }} />
                      <Pagination.Prev title="Previous" onClick={() => {
                        getData(dataId - 1)
                      }} />
                      <Pagination.Next title="Next" onClick={() => {
                        getData(dataId + 1)
                      }} />
                      <Pagination.Last title="Last" onClick={() => {
                        getData(0)
                      }} />
                    </Pagination>

                  </Card.Body>
                  <Card.Footer className="text-muted">
                    <Row>
                      <Col><span>{data.day}/{data.month}/{data.year}</span> {' '}</Col>
                      {data.news &&
                        <Col className='d-flex justify-content-end'>
                          <OverlayTrigger trigger="click" placement="left" overlay={popover}>
                            <Card.Link href="#"><small>View More</small></Card.Link>
                          </OverlayTrigger>
                        </Col>
                      }
                    </Row>
                  </Card.Footer>
                </>
                :
                <Spinner className="mx-auto m-2" animation="border" role="status" size="lg" style={{ width: "20rem", height: "20rem" }}>
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              }
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal size="lg" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Extra Parts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              {data.extra_parts &&
                <>
                  {extras().map((item) => {
                    return item;
                  })
                  }
                  <div id="comic"></div>
                  <h5 className='mt-3'>JSON Data:</h5>
                  <textarea className="w-100" rows={8} value={JSON.stringify(data.extra_parts, null, 2)} readOnly={true}></textarea>
                </>
              }
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default App;
