import { useState, useEffect } from "react";
import DataMasyarakatTable from "./DataMasyarakatTable";
import FormMasyarakat from "./FormMasyarakat";
import SearchBar from "./SearchBar";
import { masyarakatAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

function DataMasyarakatApp() {
  const { logout, user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Load data saat komponen pertama kali dimount
  useEffect(() => {
    loadData();
  }, []);

  // Function untuk load data dari API
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await masyarakatAPI.getAll();
      setData(response.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function untuk handle search
  const handleSearch = async (keyword) => {
    try {
      setLoading(true);
      setSearchKeyword(keyword);

      if (keyword.trim() === "") {
        await loadData();
      } else {
        const response = await masyarakatAPI.search(keyword);
        setData(response.data || []);
      }
    } catch (error) {
      console.error("Error searching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function untuk handle tambah data baru
  const handleAdd = () => {
    setEditingData(null);
    setShowForm(true);
  };

  // Function untuk handle edit data
  const handleEdit = (item) => {
    setEditingData(item);
    setShowForm(true);
  };

  // Function untuk handle close form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingData(null);
  };

  // Function untuk handle success form submission
  const handleFormSuccess = () => {
    handleCloseForm();
    loadData(); // Reload data setelah berhasil submit
  };

  return (
    <div className="min-vh-100">
      {/* Header */}
      <header className="header-custom">
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between py-3">
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center justify-content-center bg-primary rounded me-3" style={{ width: "40px", height: "40px" }}>
                <i className="bi bi-database-fill text-white"></i>
              </div>
              <div>
                <h1 className="h4 mb-0 fw-semibold">Data Masyarakat</h1>
                <p className="text-muted small mb-0">Sistem Manajemen Data Kependudukan</p>
              </div>
            </div>

            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center text-muted small me-3">
                <i className="bi bi-people-fill me-2"></i>
                <span>{data.length} Data</span>
              </div>
              
              <div className="dropdown">
                <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle me-2"></i>
                  {user?.username}
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="/dashboard">
                    <i className="bi bi-speedometer2 me-2"></i>Dashboard
                  </a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={logout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-fluid py-4">
        {/* Action Bar */}
        <div className="row mb-4">
          <div className="col-md-8">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="col-md-4 d-flex justify-content-md-end">
            <button onClick={handleAdd} className="btn btn-custom-primary d-flex align-items-center">
              <i className="bi bi-plus-circle me-2"></i>
              <span>Tambah Data</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="card card-custom">
          <div className="card-body">
            <DataMasyarakatTable data={data} loading={loading} onEdit={handleEdit} onRefresh={loadData} />
          </div>
        </div>
      </main>

      {/* Form Modal */}
      {showForm && <FormMasyarakat data={editingData} onClose={handleCloseForm} onSuccess={handleFormSuccess} />}
    </div>
  );
}

export default DataMasyarakatApp;
