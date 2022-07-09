import React, { useEffect, useState } from 'react';
import qs from 'query-string';

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
  Card,
  Pagination,
} from 'react-bootstrap';

let request = "";
function App() {
  const [loading, setLoading] = useState(true);
  const [dataId, setDataId] = useState(1);
  const [data, setData] = useState({});
  const { id } = qs.parse(window.location.search);

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
        const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?id=${data.data.num}`;
        window.history.pushState({path:newurl},'',newurl);
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
                  {data.link && <i className='text-center text-muted'><small>Info: <a href={data.link} target="_blank">{data.link}</a></small></i>}
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
                        <Col className='d-flex justify-content-end'><Card.Link href={data.news}><small>View More</small></Card.Link></Col>
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
    </>
  );
}

export default App;
