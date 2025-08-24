import { useState, useEffect } from "react";
import { User, Loader2 } from "lucide-react";
import { masyarakatAPI } from "../services/api";
import toast from "react-hot-toast";
import { FormField, Input, Select, Textarea } from "./ui/Input";
import { Button } from "./ui/Button";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "./ui/Modal";

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
    <Modal isOpen={true} onClose={onClose} className="w-full max-w-4xl">
      <ModalHeader onClose={onClose}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-primary rounded-lg w-10 h-10">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <ModalTitle>{data ? "Edit Data Masyarakat" : "Tambah Data Masyarakat"}</ModalTitle>
            <ModalDescription>{data ? "Perbarui informasi data masyarakat" : "Masukkan informasi data masyarakat baru"}</ModalDescription>
          </div>
        </div>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NIK */}
            <FormField label="NIK" required error={errors.nik}>
              <Input type="text" name="nik" value={formData.nik} onChange={handleChange} maxLength="16" placeholder="Masukkan 16 digit NIK" />
            </FormField>

            {/* Nama */}
            <FormField label="Nama Lengkap" required error={errors.nama}>
              <Input type="text" name="nama" value={formData.nama} onChange={handleChange} placeholder="Masukkan nama lengkap" />
            </FormField>

            {/* Tempat Lahir */}
            <FormField label="Tempat Lahir" required error={errors.tempat_lahir}>
              <Input type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} placeholder="Masukkan tempat lahir" />
            </FormField>

            {/* Tanggal Lahir */}
            <FormField label="Tanggal Lahir" required error={errors.tanggal_lahir}>
              <Input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} />
            </FormField>

            {/* Jenis Kelamin */}
            <FormField label="Jenis Kelamin" required error={errors.jenis_kelamin}>
              <Select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange}>
                <option value="">Pilih jenis kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </Select>
            </FormField>

            {/* Agama */}
            <FormField label="Agama" required error={errors.agama}>
              <Select name="agama" value={formData.agama} onChange={handleChange}>
                <option value="">Pilih agama</option>
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </Select>
            </FormField>

            {/* Alamat */}
            <div className="md:col-span-2">
              <FormField label="Alamat" required error={errors.alamat}>
                <Textarea name="alamat" value={formData.alamat} onChange={handleChange} rows="3" placeholder="Masukkan alamat lengkap" />
              </FormField>
            </div>

            {/* RT */}
            <FormField label="RT" required error={errors.rt}>
              <Input type="text" name="rt" value={formData.rt} onChange={handleChange} maxLength="3" placeholder="001" />
            </FormField>

            {/* RW */}
            <FormField label="RW" required error={errors.rw}>
              <Input type="text" name="rw" value={formData.rw} onChange={handleChange} maxLength="3" placeholder="001" />
            </FormField>

            {/* Kelurahan */}
            <FormField label="Kelurahan" required error={errors.kelurahan}>
              <Input type="text" name="kelurahan" value={formData.kelurahan} onChange={handleChange} placeholder="Masukkan kelurahan" />
            </FormField>

            {/* Kecamatan */}
            <FormField label="Kecamatan" required error={errors.kecamatan}>
              <Input type="text" name="kecamatan" value={formData.kecamatan} onChange={handleChange} placeholder="Masukkan kecamatan" />
            </FormField>

            {/* Status Perkawinan */}
            <FormField label="Status Perkawinan" required error={errors.status_perkawinan}>
              <Select name="status_perkawinan" value={formData.status_perkawinan} onChange={handleChange}>
                <option value="">Pilih status perkawinan</option>
                <option value="Belum Kawin">Belum Kawin</option>
                <option value="Kawin">Kawin</option>
                <option value="Cerai Hidup">Cerai Hidup</option>
                <option value="Cerai Mati">Cerai Mati</option>
              </Select>
            </FormField>

            {/* Pekerjaan */}
            <FormField label="Pekerjaan" required error={errors.pekerjaan}>
              <Input type="text" name="pekerjaan" value={formData.pekerjaan} onChange={handleChange} placeholder="Masukkan pekerjaan" />
            </FormField>

            {/* Kewarganegaraan */}
            <FormField label="Kewarganegaraan">
              <Select name="kewarganegaraan" value={formData.kewarganegaraan} onChange={handleChange}>
                <option value="WNI">WNI</option>
                <option value="WNA">WNA</option>
              </Select>
            </FormField>
          </div>
        </ModalBody>

        <ModalFooter className="justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Field dengan tanda <span className="text-destructive">*</span> wajib diisi
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>{data ? "Update Data" : "Simpan Data"}</span>
              )}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default FormMasyarakat;
