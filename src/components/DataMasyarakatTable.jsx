import { useState } from "react";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { masyarakatAPI } from "../services/api";
import { Button } from "./ui/Button";
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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-center p-3 text-sm font-medium text-muted-foreground">No</th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">NIK</th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Nama</th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Tempat, Tanggal Lahir</th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Jenis Kelamin</th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Alamat</th>
            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Kelurahan</th>
            <th className="text-center p-3 text-sm font-medium text-muted-foreground">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className="border-b hover:bg-muted/25 transition-colors">
              <td className="text-center p-3 text-sm">{index + 1}</td>
              <td className="p-3 text-sm font-mono">{item.nik}</td>
              <td className="p-3">
                <div className="font-medium text-sm">{item.nama}</div>
                <div className="text-muted-foreground text-xs">{item.pekerjaan}</div>
              </td>
              <td className="p-3 text-sm">
                {item.tempat_lahir}, {formatDate(item.tanggal_lahir)}
              </td>
              <td className="p-3 text-sm">{item.jenis_kelamin}</td>
              <td className="p-3 text-sm max-w-[200px] truncate">
                {item.alamat}, RT {item.rt}/RW {item.rw}
              </td>
              <td className="p-3">
                <div className="text-sm">{item.kelurahan}</div>
                <div className="text-muted-foreground text-xs">{item.kecamatan}</div>
              </td>
              <td className="text-center p-3">
                <div className="flex gap-1 justify-center">
                  <Button onClick={() => onEdit(item)} variant="outline" size="sm" title="Edit">
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button onClick={() => handleDelete(item.id, item.nama)} disabled={deleting === item.id} variant="outline" size="sm" title="Hapus" className="text-destructive hover:text-destructive">
                    {deleting === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
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
