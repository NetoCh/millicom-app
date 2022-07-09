import React, { useEffect, useState } from 'react';

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
  Button,
  Spinner,
  // Carousel,
  Card,
  Pagination,
} from 'react-bootstrap';

let request = "";
function App() {
  const [loading, setLoading] = useState(true);
  const [dataId, setDataId] = useState(1);
  const [data, setData] = useState({});

  const getData = async function (id = 1) {
    try {
      setLoading(true);
      const api = `/api/data?id=${id}`;

      if (request === api) return;
      request = api;

      const { data } = await axios.get(api);
      if (data.success) {
        setData(data.data);
        setDataId(data.data.num);
      }

    } catch (error) {
      console.log("getData error: ", error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData(dataId);
  }, [])

  return (
    <>
      <Container>
        <Row className='my-5 center d-flex justify-content-center align-item-center'>
          <Col xl="6" md="10" xs="12">
            <Card className="shadow mx-auto">
              {!loading ?
                <>
                  <Card.Header><h3 className='text-center'>{data.num} - {data.title}</h3></Card.Header>
                  <Card.Img variant="top" className='p-3 my-3 mx-auto shadow' style={{ maxWidth: '25rem' }} src={data.img} onClick={() => { if (data.link) window.location.open(data.link) }} />
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
                    <span>{data.day}/{data.month}/{data.year}</span> {' '}
                    <Card.Link href={data.news}><small>View More</small></Card.Link>
                  </Card.Footer>
                </>
                :
                <Spinner className="mx-auto m-2" animation="border" role="status" size="lg" style={{ width: "25rem", height: "25rem" }}>
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              }
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
