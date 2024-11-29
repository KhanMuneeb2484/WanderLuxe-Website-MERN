import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Container, Alert, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const AdminCities = () => {
  const [cities, setCities] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ name: "", id: null });
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    fetchCities(token);
  }, []);

  const fetchCities = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/api/cities", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCities(data.cities || []);
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to fetch cities.");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (cityId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/api/cities/${cityId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setCities(cities.filter((city) => city.id !== cityId));
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to delete city.");
      }
    } catch (error) {
      console.error("Error deleting city:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleShowModal = (city = { name: "", id: null }) => {
    setModalData(city);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData({ name: "", id: null });
  };

  const handleSaveCity = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const method = modalData.id ? "PUT" : "POST";
    const url = modalData.id
      ? `http://localhost:3000/api/cities/${modalData.id}`
      : "http://localhost:3000/api/cities";
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: modalData.name }),
      });

      if (response.ok) {
        const data = await response.json();
        if (modalData.id) {
          setCities(
            cities.map((city) =>
              city.id === modalData.id ? { ...city, name: modalData.name } : city
            )
          );
        } else {
          setCities([...cities, data.city]);
        }
        handleCloseModal();
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to save city.");
      }
    } catch (error) {
      console.error("Error saving city:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">City Management</h2>
      {errorMessage && (
        <Alert variant="danger" className="text-center">
          {errorMessage}
        </Alert>
      )}
      <Button className="mb-3" onClick={() => handleShowModal()}>
        Add City
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cities && cities.length > 0 ? (
            cities.map((city) => (
              <tr key={city.id}>
                <td>{city.id}</td>
                <td>{city.name}</td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleShowModal(city)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(city.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No cities found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData.id ? "Edit City" : "Add City"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCityName">
              <Form.Label>City Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city name"
                value={modalData.name}
                onChange={(e) =>
                  setModalData({ ...modalData, name: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveCity}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminCities;
