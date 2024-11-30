import React, { useEffect, useState } from "react";

const AdminHotels = () => {
  const [hotels, setHotels] = useState([]); // List of hotels
  const [newHotel, setNewHotel] = useState({ name: "", countryId: "", pricePerNight: 0 }); // New hotel details
  const [editingHotel, setEditingHotel] = useState(null); // Hotel being edited
  const [countries, setCountries] = useState([]); // List of countries
  const token = localStorage.getItem("token");

  // Fetch all hotels
  const fetchHotels = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/hotels/get-all-hotels", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setHotels(data);
      } else {
        console.error("Failed to fetch hotels");
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  // Fetch countries
  const fetchCountries = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/countries/get-all-countries", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCountries(data);
      } else {
        console.error("Failed to fetch countries");
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  // Add a new hotel
  const addHotel = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/hotels/create-hotel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newHotel),
      });
      if (response.ok) {
        alert("Hotel added successfully!");
        setNewHotel({ name: "", countryId: "", pricePerNight: 0 });
        fetchHotels();
      } else {
        console.error("Failed to add hotel");
      }
    } catch (error) {
      console.error("Error adding hotel:", error);
    }
  };

  // Update an existing hotel
  const updateHotel = async (hotelId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/hotels/update-hotel/${hotelId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingHotel),
      });
      if (response.ok) {
        alert("Hotel updated successfully!");
        setEditingHotel(null);
        fetchHotels();
      } else {
        console.error("Failed to update hotel");
      }
    } catch (error) {
      console.error("Error updating hotel:", error);
    }
  };

  // Delete a hotel
  const deleteHotel = async (hotelId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/hotels/delete-hotel/${hotelId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        alert("Hotel deleted successfully!");
        fetchHotels();
      } else {
        console.error("Failed to delete hotel");
      }
    } catch (error) {
      console.error("Error deleting hotel:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchHotels();
    fetchCountries();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Admin: Manage Hotels</h2>

      {/* Add Hotel Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Add New Hotel</h5>
          <div className="mb-3">
            <label>Hotel Name:</label>
            <input
              type="text"
              className="form-control"
              value={newHotel.name}
              onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label>Country:</label>
            <select
              className="form-select"
              value={newHotel.countryId}
              onChange={(e) => setNewHotel({ ...newHotel, countryId: e.target.value })}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.country_id} value={country.country_id}>
                  {country.country_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label>Price Per Night ($):</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={newHotel.pricePerNight}
              onChange={(e) => setNewHotel({ ...newHotel, pricePerNight: e.target.valueAsNumber })}
            />
          </div>
          <button className="btn btn-primary" onClick={addHotel}>
            Add Hotel
          </button>
        </div>
      </div>

      {/* Hotels List */}
      <h4>Existing Hotels</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Price Per Night</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel.hotel_id}>
              <td>
                {editingHotel && editingHotel.hotel_id === hotel.hotel_id ? (
                  <input
                    type="text"
                    value={editingHotel.name}
                    onChange={(e) => setEditingHotel({ ...editingHotel, name: e.target.value })}
                  />
                ) : (
                  hotel.hotel_name
                )}
              </td>
              <td>
                {editingHotel && editingHotel.hotel_id === hotel.hotel_id ? (
                  <select
                    value={editingHotel.countryId}
                    onChange={(e) => setEditingHotel({ ...editingHotel, countryId: e.target.value })}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.country_id} value={country.country_id}>
                        {country.country_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  countries.find((c) => c.country_id === hotel.country_id)?.country_name
                )}
              </td>
              <td>
                {editingHotel && editingHotel.hotel_id === hotel.hotel_id ? (
                  <input
                    type="number"
                    min="0"
                    value={editingHotel.pricePerNight}
                    onChange={(e) =>
                      setEditingHotel({ ...editingHotel, pricePerNight: e.target.valueAsNumber })
                    }
                  />
                ) : (
                  `$${hotel.price_per_night}`
                )}
              </td>
              <td>
                {editingHotel && editingHotel.hotel_id === hotel.hotel_id ? (
                  <>
                    <button className="btn btn-success me-2" onClick={() => updateHotel(hotel.hotel_id)}>
                      Save
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditingHotel(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => setEditingHotel({ ...hotel, countryId: hotel.country_id })}
                    >
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => deleteHotel(hotel.hotel_id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHotels;
