import React, { useState, useEffect } from "react";
import { User, Plus, LogOut, CreditCard, Clock, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { toast } from "react-hot-toast";
import PaymentDetailModal from "./PaymentDetailModal";
import { Button } from "./ui/Button";
import { Input, Select } from "./ui/Input";
import { Badge } from "./ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";

const UserDashboard = () => {
  const { user, logout } = useAuth();

  // Pake data dari localStorage kalo user ga ada (untuk masyarakat login)
  const currentUser = user || {
    id: "masyarakat_" + localStorage.getItem("userNIK"),
    username: localStorage.getItem("userName"),
    masyarakat_nama: localStorage.getItem("userName"),
    masyarakat_nik: localStorage.getItem("userNIK"),
    role: "user",
  };

  console.log("UserDashboard - Current user:", currentUser);

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
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      {/* Top Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center">
            <div className="bg-white bg-opacity-20 rounded-3 p-2 me-3">
              <i className="bi bi-person-circle text-white fs-4"></i>
            </div>
            <div>
              <h5 className="mb-0 text-white fw-bold">User Dashboard</h5>
              <small className="text-white-50">RT Management System</small>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-white/70 hidden md:block">
              <User className="inline mr-2 h-4 w-4" />
              {currentUser?.masyarakat_nama || currentUser?.username}
            </div>
            <Button variant="default" className="bg-white text-gray-900 hover:bg-gray-100" onClick={() => setShowPaymentModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Bayar Iuran
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900"
              onClick={() => {
                // Clear localStorage untuk masyarakat login
                localStorage.removeItem("userName");
                localStorage.removeItem("userNIK");

                // Logout dari auth context juga
                if (logout) {
                  logout();
                }

                // Redirect ke login
                window.location.href = "/login";
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid px-4 pb-5">
        {/* Welcome Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="text-center text-white py-4">
              <h1 className="display-5 fw-bold mb-3">Selamat Datang, {currentUser?.masyarakat_nama || currentUser?.username}! 👋</h1>
              <p className="lead mb-4">Kelola pembayaran iuran RT Anda dengan mudah dan praktis</p>
              <div className="d-flex justify-content-center align-items-center gap-4 text-white-50">
                <div className="d-flex align-items-center">
                  <i className="bi bi-calendar3 me-2"></i>
                  <span>{new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-clock me-2"></i>
                  <span>{new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row g-4 mb-5">
          <div className="col-lg-3 col-md-6">
            <Card className="border-0 h-100 shadow-lg" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
              <CardContent className="text-white p-4">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-white bg-opacity-20 rounded-3 p-3">
                      <i className="bi bi-receipt text-white fs-3"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <CardDescription className="text-white-50 text-uppercase fw-bold mb-1 small">Total Pembayaran</CardDescription>
                    <CardTitle className="text-white fs-1 mb-1 fw-bold">{stats.total}</CardTitle>
                    <div className="text-white-50 small">
                      <i className="bi bi-arrow-up me-1"></i>Semua transaksi
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-lg-3 col-md-6">
            <Card className="border-0 h-100 shadow-lg" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
              <CardContent className="text-white p-4">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-white bg-opacity-20 rounded-3 p-3">
                      <i className="bi bi-clock text-white fs-3"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <CardDescription className="text-white-50 text-uppercase fw-bold mb-1 small">Menunggu</CardDescription>
                    <CardTitle className="text-white fs-1 mb-1 fw-bold">{stats.pending}</CardTitle>
                    <div className="text-white-50 small">
                      <i className="bi bi-clock me-1"></i>Perlu persetujuan
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-lg-3 col-md-6">
            <Card className="border-0 h-100 shadow-lg" style={{ background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }}>
              <CardContent className="text-white p-4">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-white bg-opacity-20 rounded-3 p-3">
                      <i className="bi bi-check-circle text-white fs-3"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <CardDescription className="text-white-50 text-uppercase fw-bold mb-1 small">Disetujui</CardDescription>
                    <CardTitle className="text-white fs-1 mb-1 fw-bold">{stats.approved}</CardTitle>
                    <div className="text-white-50 small">
                      <i className="bi bi-check me-1"></i>Sudah disetujui
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-lg-3 col-md-6">
            <Card className="border-0 h-100 shadow-lg" style={{ background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" }}>
              <CardContent className="text-white p-4">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-white bg-opacity-20 rounded-3 p-3">
                      <i className="bi bi-x-circle text-white fs-3"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <CardDescription className="text-white-50 text-uppercase fw-bold mb-1 small">Ditolak</CardDescription>
                    <CardTitle className="text-white fs-1 mb-1 fw-bold">{stats.rejected}</CardTitle>
                    <div className="text-white-50 small">
                      <i className="bi bi-x me-1"></i>Perlu diperbaiki
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment History */}
        <div className="row">
          <div className="col-12">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="bg-white border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <CardTitle className="d-flex align-items-center mb-0">
                    <div className="bg-primary rounded-3 p-2 me-3">
                      <i className="bi bi-clock-history text-white"></i>
                    </div>
                    <div>
                      <h5 className="mb-0">Riwayat Pembayaran</h5>
                      <small className="text-muted">Kelola dan pantau pembayaran iuran Anda</small>
                    </div>
                  </CardTitle>
                  <Button variant="default" className="btn-primary" onClick={() => setShowPaymentModal(true)}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Bayar Iuran
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {payments.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-4">
                      <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                        <i className="bi bi-receipt display-4 text-muted"></i>
                      </div>
                    </div>
                    <h5 className="text-muted mb-3">Belum ada riwayat pembayaran</h5>
                    <p className="text-muted mb-4">Mulai bayar iuran RT Anda untuk melihat riwayat pembayaran di sini</p>
                    <Button variant="default" className="btn-primary btn-lg" onClick={() => setShowPaymentModal(true)}>
                      <i className="bi bi-plus-circle me-2"></i>
                      Bayar Iuran Pertama
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th className="border-0 fw-semibold">Jenis Pembayaran</th>
                          <th className="border-0 fw-semibold">Bulan</th>
                          <th className="border-0 fw-semibold">Jumlah</th>
                          <th className="border-0 fw-semibold">Status</th>
                          <th className="border-0 fw-semibold">Tanggal Submit</th>
                          <th className="border-0 fw-semibold">Tanggal Bayar</th>
                          <th className="border-0 fw-semibold">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment.id} className="align-middle">
                            <td className="fw-medium">{payment.payment_type_name}</td>
                            <td>{payment.payment_month}</td>
                            <td className="fw-semibold text-primary">{formatCurrency(payment.amount)}</td>
                            <td>{getStatusBadge(payment.status)}</td>
                            <td>{formatDate(payment.created_at)}</td>
                            <td>{payment.payment_date ? formatDate(payment.payment_date) : <span className="text-muted">-</span>}</td>
                            <td>
                              <Button variant="outline" size="sm" onClick={() => handleShowDetail(payment.id)} title="Lihat Detail">
                                <i className="bi bi-eye me-1"></i>
                                Detail
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
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
