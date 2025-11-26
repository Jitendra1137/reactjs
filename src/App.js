import DetailsCardComponent from "./components/DetailsCardComponent";
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [recordData, setRecordData] = useState([]);

  console.log("process.env:", process.env);
  console.log("process.env.REACT_APP_NODE_ENV:", process.env.REACT_APP_NODE_ENV);
  console.log("process.env.REACT_APP_SERVER_BASE_URL:", process.env.REACT_APP_SERVER_BASE_URL);

  /* -----------------------------------------------
     FIXED BASE URL HANDLING (IMPORTANT)
  ------------------------------------------------ */
  let base_url =
    process.env.REACT_APP_NODE_ENV === "development"
      ? process.env.REACT_APP_LOCAL_BASE_URL
      : process.env.REACT_APP_SERVER_BASE_URL;

  // Remove trailing slash if present to avoid //addUser issue
  if (base_url && base_url.endsWith("/")) {
    base_url = base_url.slice(0, -1);
  }

  /* -----------------------------------------------
     FETCH USERS WHEN COMPONENT LOADS
  ------------------------------------------------ */
  useEffect(() => {
    axios
      .get(`${base_url}/getUsers`)
      .then((res) => {
        setRecordData(res.data);
      })
      .catch((err) => {
        alert(`Some error occurred ==> ${err}`);
        console.error(err);
      });
  }, [base_url]);

  /* -----------------------------------------------
     HANDLE INPUT CHANGES
  ------------------------------------------------ */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  /* -----------------------------------------------
     HANDLE SUBMIT
  ------------------------------------------------ */
  const handleSubmit = async (event) => {
    event.preventDefault();

    axios
      .post(`${base_url}/addUser`, formData)
      .then((res) => {
        setFormData({ name: "", email: "" });
        alert("User created successfully");
      })
      .catch((err) => {
        alert(`Some error occurred ==> ${err}`);
        console.error(err);
      });
  };

  return (
    <div className="App">
      <nav className="navbar navbar-light bg-light mb-2">
        <a className="navbar-brand" href="https://www.youtube.com/@IntegrationNinjas">
          <img src="./logo_p.png" width="50" height="50" className="d-inline-block" alt="" />
          Integration Ninja
        </a>
      </nav>

      <div className="container">
        <div className="row">

          {/* Users List */}
          <div className="col">
            <h3 className="text-center">Users List</h3>
            <ul>
              {recordData.map((r, i) => (
                <li key={i}>
                  <DetailsCardComponent email={r.email} sn={i + 1} userN={r.name} />
                </li>
              ))}
            </ul>
          </div>

          {/* Add User Form */}
          <div className="col">
            <h2>Add Users</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="exampleInputUser">User Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  id="exampleInputUser"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter user name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="exampleInputEmail">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="exampleInputEmail"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>

              <button type="submit" className="btn btn-primary mt-2">
                Submit
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
