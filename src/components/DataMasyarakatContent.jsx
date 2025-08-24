import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import DataMasyarakatTable from "./DataMasyarakatTable";
import FormMasyarakat from "./FormMasyarakat";
import SearchBar from "./SearchBar";
import { masyarakatAPI } from "../services/api";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";

function DataMasyarakatContent() {
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
      console.error("Error loading masyarakat data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function untuk handle search
  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  // Function untuk handle tambah data
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

  // Function untuk handle success form (setelah save)
  const handleFormSuccess = () => {
    handleCloseForm();
    loadData(); // Reload data setelah berhasil save
  };

  // Filter data berdasarkan search keyword
  const filteredData = data.filter((item) => {
    if (!searchKeyword) return true;

    const keyword = searchKeyword.toLowerCase();
    return item.nama?.toLowerCase().includes(keyword) || item.nik?.toLowerCase().includes(keyword) || item.alamat?.toLowerCase().includes(keyword) || item.rt?.toLowerCase().includes(keyword) || item.rw?.toLowerCase().includes(keyword);
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchBar onSearch={handleSearch} />
        </div>
        <Button onClick={handleAdd} variant="default">
          <Plus className="h-4 w-4 mr-2" />
          <span>Tambah Data</span>
        </Button>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent>
          <DataMasyarakatTable data={filteredData} loading={loading} onEdit={handleEdit} onRefresh={loadData} />
        </CardContent>
      </Card>

      {/* Form Modal */}
      {showForm && <FormMasyarakat data={editingData} onClose={handleCloseForm} onSuccess={handleFormSuccess} />}
    </div>
  );
}

export default DataMasyarakatContent;
