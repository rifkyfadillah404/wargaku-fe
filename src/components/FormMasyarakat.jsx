import { useState, useEffect } from "react";
import { masyarakatAPI } from "../services/api";
import toast from "react-hot-toast";
import { Input, Select } from "./ui/Input";
import { Button } from "./ui/Button";

const FormMasyarakat = ({ data, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nik: "",
    nama: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    alamat: "",
    rt: "",
    rw: "",
    kelurahan: "",
    kecamatan: "",
    agama: "",
    status_perkawinan: "",
    pekerjaan: "",
    kewarganegaraan: "WNI",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Set form data jika editing
  useEffect(() => {
    if (data) {
      setFormData({
        nik: data.nik || "",
        nama: data.nama || "",
        tempat_lahir: data.tempat_lahir || "",
        tanggal_lahir: data.tanggal_lahir ? data.tanggal_lahir.split("T")[0] : "",
        jenis_kelamin: data.jenis_kelamin || "",
        alamat: data.alamat || "",
        rt: data.rt || "",
        rw: data.rw || "",
        kelurahan: data.kelurahan || "",
        kecamatan: data.kecamatan || "",
        agama: data.agama || "",
        status_perkawinan: data.status_perkawinan || "",
        pekerjaan: data.pekerjaan || "",
        kewarganegaraan: data.kewarganegaraan || "WNI",
      });
    }
  }, [data]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nik.trim()) newErrors.nik = "NIK wajib diisi";
    else if (!/^\d{16}$/.test(formData.nik)) newErrors.nik = "NIK harus 16 digit angka";

    if (!formData.nama.trim()) newErrors.nama = "Nama wajib diisi";
    if (!formData.tempat_lahir.trim()) newErrors.tempat_lahir = "Tempat lahir wajib diisi";
    if (!formData.tanggal_lahir) newErrors.tanggal_lahir = "Tanggal lahir wajib diisi";
    if (!formData.jenis_kelamin) newErrors.jenis_kelamin = "Jenis kelamin wajib dipilih";
    if (!formData.alamat.trim()) newErrors.alamat = "Alamat wajib diisi";
    if (!formData.rt.trim()) newErrors.rt = "RT wajib diisi";
    if (!formData.rw.trim()) newErrors.rw = "RW wajib diisi";
    if (!formData.kelurahan.trim()) newErrors.kelurahan = "Kelurahan wajib diisi";
    if (!formData.kecamatan.trim()) newErrors.kecamatan = "Kecamatan wajib diisi";
    if (!formData.agama.trim()) newErrors.agama = "Agama wajib diisi";
    if (!formData.status_perkawinan) newErrors.status_perkawinan = "Status perkawinan wajib dipilih";
    if (!formData.pekerjaan.trim()) newErrors.pekerjaan = "Pekerjaan wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    try {
      setLoading(true);

      if (data) {
        // Update existing data
        await masyarakatAPI.update(data.id, formData);
        toast.success("Data berhasil diupdate");
      } else {
        // Create new data
        await masyarakatAPI.create(formData);
        toast.success("Data berhasil ditambahkan");
      }

      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Terjadi kesalahan saat menyimpan data");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center justify-content-center bg-primary rounded me-3" style={{ width: "40px", height: "40px" }}>
                <i className="bi bi-person-fill text-white"></i>
              </div>
              <div>
                <h5 className="modal-title mb-0">{data ? "Edit Data Masyarakat" : "Tambah Data Masyarakat"}</h5>
                <p className="text-muted small mb-0">{data ? "Perbarui informasi data masyarakat" : "Masukkan informasi data masyarakat baru"}</p>
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                {/* NIK */}
                <div className="col-md-6">
                  <Input label="NIK" type="text" name="nik" value={formData.nik} onChange={handleChange} maxLength="16" placeholder="Masukkan 16 digit NIK" error={errors.nik} required />
                </div>

                {/* Nama */}
                <div className="col-md-6">
                  <Input label="Nama Lengkap" type="text" name="nama" value={formData.nama} onChange={handleChange} placeholder="Masukkan nama lengkap" error={errors.nama} required />
                </div>

                {/* Tempat Lahir */}
                <div className="col-md-6">
                  <label className="form-label">
                    Tempat Lahir <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} className={`form-control ${errors.tempat_lahir ? "is-invalid" : ""}`} placeholder="Masukkan tempat lahir" />
                  {errors.tempat_lahir && <div className="invalid-feedback">{errors.tempat_lahir}</div>}
                </div>

                {/* Tanggal Lahir */}
                <div className="col-md-6">
                  <label className="form-label">
                    Tanggal Lahir <span className="text-danger">*</span>
                  </label>
                  <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} className={`form-control ${errors.tanggal_lahir ? "is-invalid" : ""}`} />
                  {errors.tanggal_lahir && <div className="invalid-feedback">{errors.tanggal_lahir}</div>}
                </div>

                {/* Jenis Kelamin */}
                <div className="col-md-6">
                  <label className="form-label">
                    Jenis Kelamin <span className="text-danger">*</span>
                  </label>
                  <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} className={`form-select ${errors.jenis_kelamin ? "is-invalid" : ""}`}>
                    <option value="">Pilih jenis kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  {errors.jenis_kelamin && <div className="invalid-feedback">{errors.jenis_kelamin}</div>}
                </div>

                {/* Agama */}
                <div className="col-md-6">
                  <label className="form-label">
                    Agama <span className="text-danger">*</span>
                  </label>
                  <select name="agama" value={formData.agama} onChange={handleChange} className={`form-select ${errors.agama ? "is-invalid" : ""}`}>
                    <option value="">Pilih agama</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                  {errors.agama && <div className="invalid-feedback">{errors.agama}</div>}
                </div>

                {/* Alamat */}
                <div className="col-12">
                  <label className="form-label">
                    Alamat <span className="text-danger">*</span>
                  </label>
                  <textarea name="alamat" value={formData.alamat} onChange={handleChange} rows="3" className={`form-control ${errors.alamat ? "is-invalid" : ""}`} placeholder="Masukkan alamat lengkap"></textarea>
                  {errors.alamat && <div className="invalid-feedback">{errors.alamat}</div>}
                </div>

                {/* RT */}
                <div className="col-md-3">
                  <label className="form-label">
                    RT <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="rt" value={formData.rt} onChange={handleChange} maxLength="3" className={`form-control ${errors.rt ? "is-invalid" : ""}`} placeholder="001" />
                  {errors.rt && <div className="invalid-feedback">{errors.rt}</div>}
                </div>

                {/* RW */}
                <div className="col-md-3">
                  <label className="form-label">
                    RW <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="rw" value={formData.rw} onChange={handleChange} maxLength="3" className={`form-control ${errors.rw ? "is-invalid" : ""}`} placeholder="001" />
                  {errors.rw && <div className="invalid-feedback">{errors.rw}</div>}
                </div>

                {/* Kelurahan */}
                <div className="col-md-3">
                  <label className="form-label">
                    Kelurahan <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="kelurahan" value={formData.kelurahan} onChange={handleChange} className={`form-control ${errors.kelurahan ? "is-invalid" : ""}`} placeholder="Masukkan kelurahan" />
                  {errors.kelurahan && <div className="invalid-feedback">{errors.kelurahan}</div>}
                </div>

                {/* Kecamatan */}
                <div className="col-md-3">
                  <label className="form-label">
                    Kecamatan <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="kecamatan" value={formData.kecamatan} onChange={handleChange} className={`form-control ${errors.kecamatan ? "is-invalid" : ""}`} placeholder="Masukkan kecamatan" />
                  {errors.kecamatan && <div className="invalid-feedback">{errors.kecamatan}</div>}
                </div>

                {/* Status Perkawinan */}
                <div className="col-md-6">
                  <label className="form-label">
                    Status Perkawinan <span className="text-danger">*</span>
                  </label>
                  <select name="status_perkawinan" value={formData.status_perkawinan} onChange={handleChange} className={`form-select ${errors.status_perkawinan ? "is-invalid" : ""}`}>
                    <option value="">Pilih status perkawinan</option>
                    <option value="Belum Kawin">Belum Kawin</option>
                    <option value="Kawin">Kawin</option>
                    <option value="Cerai Hidup">Cerai Hidup</option>
                    <option value="Cerai Mati">Cerai Mati</option>
                  </select>
                  {errors.status_perkawinan && <div className="invalid-feedback">{errors.status_perkawinan}</div>}
                </div>

                {/* Pekerjaan */}
                <div className="col-md-6">
                  <label className="form-label">
                    Pekerjaan <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="pekerjaan" value={formData.pekerjaan} onChange={handleChange} className={`form-control ${errors.pekerjaan ? "is-invalid" : ""}`} placeholder="Masukkan pekerjaan" />
                  {errors.pekerjaan && <div className="invalid-feedback">{errors.pekerjaan}</div>}
                </div>

                {/* Kewarganegaraan */}
                <div className="col-md-6">
                  <label className="form-label">Kewarganegaraan</label>
                  <select name="kewarganegaraan" value={formData.kewarganegaraan} onChange={handleChange} className="form-select">
                    <option value="WNI">WNI</option>
                    <option value="WNA">WNA</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer d-flex justify-content-between">
              <div>
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Field dengan tanda <span className="text-danger">*</span> wajib diisi
                </small>
              </div>

              <div>
                <button type="button" className="btn btn-secondary me-2" onClick={onClose} disabled={loading}>
                  <i className="bi bi-x-circle me-1"></i>
                  Batal
                </button>

                <button type="submit" disabled={loading} className="btn btn-custom-primary d-flex align-items-center">
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      <span>{data ? "Update Data" : "Simpan Data"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormMasyarakat;
