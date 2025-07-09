import { useState } from "react";
import { masyarakatAPI } from "../services/api";
import toast from "react-hot-toast";

const DataMasyarakatTable = ({ data, loading, onEdit, onRefresh }) => {
  const [deleting, setDeleting] = useState(null);

  // Function untuk format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function untuk handle delete
  const handleDelete = async (id, nama) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus data ${nama}?`)) {
      return;
    }

    try {
      setDeleting(id);
      await masyarakatAPI.delete(id);
      toast.success("Data berhasil dihapus");
      onRefresh();
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Gagal menghapus data");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <div className="spinner-border text-primary me-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="text-muted">Memuat data...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="text-muted h5 mb-2">Tidak ada data</div>
        <p className="text-muted">Belum ada data masyarakat yang tersimpan</p>
      </div>
    );
  }

  return (
    <div className="table-responsive table-responsive-custom">
      <table className="table table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col" className="text-center">
              No
            </th>
            <th scope="col">NIK</th>
            <th scope="col">Nama</th>
            <th scope="col">Tempat, Tanggal Lahir</th>
            <th scope="col">Jenis Kelamin</th>
            <th scope="col">Alamat</th>
            <th scope="col">Kelurahan</th>
            <th scope="col" className="text-center">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td className="text-center">{index + 1}</td>
              <td className="font-monospace small">{item.nik}</td>
              <td>
                <div className="fw-medium">{item.nama}</div>
                <div className="text-muted small">{item.pekerjaan}</div>
              </td>
              <td>
                {item.tempat_lahir}, {formatDate(item.tanggal_lahir)}
              </td>
              <td>{item.jenis_kelamin}</td>
              <td className="text-truncate" style={{ maxWidth: "200px" }}>
                {item.alamat}, RT {item.rt}/RW {item.rw}
              </td>
              <td>
                <div>{item.kelurahan}</div>
                <div className="text-muted small">{item.kecamatan}</div>
              </td>
              <td className="text-center">
                <div className="btn-group" role="group">
                  <button onClick={() => onEdit(item)} className="btn btn-sm btn-outline-primary" title="Edit">
                    <i className="bi bi-pencil"></i>
                  </button>

                  <button onClick={() => handleDelete(item.id, item.nama)} disabled={deleting === item.id} className="btn btn-sm btn-outline-danger" title="Hapus">
                    {deleting === item.id ? <div className="spinner-border spinner-border-sm" role="status"></div> : <i className="bi bi-trash"></i>}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataMasyarakatTable;
