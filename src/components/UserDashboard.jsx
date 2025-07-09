import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { toast } from "react-hot-toast";
import PaymentDetailModal from "./PaymentDetailModal";
import { Button } from "./ui/Button";
import { Input, Select } from "./ui/Input";
import { Badge } from "./ui/Badge";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [payments, setPayments] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [paymentMonth, setPaymentMonth] = useState("");
  const [proofImage, setProofImage] = useState(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const [paymentsRes, typesRes, statsRes] = await Promise.all([api.get("/payments"), api.get("/payments/types/all"), api.get("/payments/stats")]);

      setPayments(paymentsRes.data.data);
      setPaymentTypes(typesRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    if (!selectedPaymentType || !paymentMonth) {
      toast.error("Pilih jenis pembayaran dan bulan");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      const selectedType = paymentTypes.find((t) => t.id === parseInt(selectedPaymentType));

      formData.append("payment_type_id", selectedPaymentType);
      formData.append("amount", selectedType.amount);
      formData.append("payment_month", paymentMonth);
      formData.append("notes", notes);

      if (proofImage) {
        formData.append("proof_image", proofImage);
      }

      await api.post("/payments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Pembayaran berhasil disubmit");
      setShowPaymentModal(false);
      resetForm();
      fetchUserData();
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error(error.response?.data?.message || "Gagal submit pembayaran");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedPaymentType("");
    setPaymentMonth("");
    setProofImage(null);
    setNotes("");
  };

  const handleShowDetail = async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}`);
      setSelectedPayment(response.data.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error("Error fetching payment detail:", error);
      toast.error("Gagal memuat detail pembayaran");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      approved: "success",
      rejected: "destructive",
    };

    const labels = {
      pending: "Menunggu",
      approved: "Disetujui",
      rejected: "Ditolak",
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  // Get current month for default value
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-0">Dashboard User</h1>
              <p className="text-muted">Selamat datang, {user?.masyarakat_nama || user?.username}</p>
            </div>
            <div>
              <Button variant="default" className="me-2" onClick={() => setShowPaymentModal(true)}>
                <i className="bi bi-plus-circle me-2"></i>
                Bayar Iuran
              </Button>
              <Button variant="outline" onClick={logout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">{stats.total}</h4>
                  <p className="card-text">Total Pembayaran</p>
                </div>
                <i className="bi bi-receipt display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">{stats.pending}</h4>
                  <p className="card-text">Menunggu Persetujuan</p>
                </div>
                <i className="bi bi-clock display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">{stats.approved}</h4>
                  <p className="card-text">Disetujui</p>
                </div>
                <i className="bi bi-check-circle display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="card-title">{stats.rejected}</h4>
                  <p className="card-text">Ditolak</p>
                </div>
                <i className="bi bi-x-circle display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Riwayat Pembayaran
              </h5>
            </div>
            <div className="card-body">
              {payments.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-receipt display-4 text-muted mb-3"></i>
                  <p className="text-muted">Belum ada riwayat pembayaran</p>
                  <button className="btn btn-primary" onClick={() => setShowPaymentModal(true)}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Bayar Iuran Pertama
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Jenis Pembayaran</th>
                        <th>Bulan</th>
                        <th>Jumlah</th>
                        <th>Status</th>
                        <th>Tanggal Submit</th>
                        <th>Tanggal Bayar</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td>{payment.payment_type_name}</td>
                          <td>{payment.payment_month}</td>
                          <td>{formatCurrency(payment.amount)}</td>
                          <td>{getStatusBadge(payment.status)}</td>
                          <td>{formatDate(payment.created_at)}</td>
                          <td>{payment.payment_date ? formatDate(payment.payment_date) : "-"}</td>
                          <td>
                            <button className="btn btn-sm btn-info" onClick={() => handleShowDetail(payment.id)} title="Lihat Detail">
                              <i className="bi bi-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-credit-card me-2"></i>
                  Bayar Iuran
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowPaymentModal(false)}></button>
              </div>
              <form onSubmit={handleSubmitPayment}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Jenis Pembayaran *</label>
                    <select className="form-select" value={selectedPaymentType} onChange={(e) => setSelectedPaymentType(e.target.value)} required>
                      <option value="">Pilih jenis pembayaran</option>
                      {paymentTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name} - {formatCurrency(type.amount)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Bulan Pembayaran *</label>
                    <input type="month" className="form-control" value={paymentMonth} onChange={(e) => setPaymentMonth(e.target.value)} defaultValue={getCurrentMonth()} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Bukti Pembayaran</label>
                    <input type="file" className="form-control" accept="image/*" onChange={(e) => setProofImage(e.target.files[0])} />
                    <small className="text-muted">Upload foto bukti transfer/pembayaran</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Catatan</label>
                    <textarea className="form-control" rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan tambahan (opsional)"></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowPaymentModal(false)} disabled={submitting}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Submit Pembayaran
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Detail Modal */}
      {showDetailModal && selectedPayment && <PaymentDetailModal payment={selectedPayment} onClose={() => setShowDetailModal(false)} isAdmin={false} />}
    </div>
  );
};

export default UserDashboard;
