import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Container, Alert, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const AdminLocations = () => {
  const [locations, setLocations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ name: "", id: null, latitude: "", longitude: "" });
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    fetchLocations(token);
  }, []);

  const fetchLocations = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/api/locations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setLocations(data.locations || []);
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to fetch locations.");
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (locationId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/api/locations/${locationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setLocations(locations.filter((location) => location.id !== locationId));
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to delete location.");
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleShowModal = (location = { name: "", id: null, latitude: "", longitude: "" }) => {
    setModalData(location);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData({ name: "", id: null, latitude: "", longitude: "" });
  };

  const handleSaveLocation = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const method = modalData.id ? "PUT" : "POST";
    const url = modalData.id
      ? `http://localhost:3000/api/locations/${modalData.id}`
      : "http://localhost:3000/api/locations";
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: modalData.name,
          latitude: modalData.latitude,
          longitude: modalData.longitude
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (modalData.id) {
          setLocations(
            locations.map((location) =>
              location.id === modalData.id
                ? { ...location, name: modalData.name, latitude: modalData.latitude, longitude: modalData.longitude }
                : location
            )
          );
        } else {
          setLocations([...locations, data.location]);
        }
        handleCloseModal();
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Failed to save location.");
      }
    } catch (error) {
      console.error("Error saving location:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Location Management</h2>
      {errorMessage && (
        <Alert variant="danger" className="text-center">
          {errorMessage}
        </Alert>
      )}
      <Button className="mb-3" onClick={() => handleShowModal()}>
        Add Location
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations && locations.length > 0 ? (
            locations.map((location) => (
              <tr key={location.id}>
                <td>{location.id}</td>
                <td>{location.name}</td>
                <td>{location.latitude}</td>
                <td>{location.longitude}</td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleShowModal(location)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(location.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No locations found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData.id ? "Edit Location" : "Add Location"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formLocationName">
              <Form.Label>Location Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location name"
                value={modalData.name}
                onChange={(e) =>
                  setModalData({ ...modalData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formLatitude">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter latitude"
                value={modalData.latitude}
                onChange={(e) =>
                  setModalData({ ...modalData, latitude: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formLongitude">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter longitude"
                value={modalData.longitude}
                onChange={(e) =>
                  setModalData({ ...modalData, longitude: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveLocation}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminLocations;
