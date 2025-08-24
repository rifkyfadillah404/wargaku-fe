import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { toast } from "react-hot-toast";
import api from "../services/api";
import PaymentDetailModal from "./PaymentDetailModal";

const DataPembayaranContent = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/payments");
      setPayments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Gagal memuat data pembayaran");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentAction = async (paymentId, status, notes = "") => {
    try {
      await api.put(`/payments/${paymentId}/status`, { status, notes });
      toast.success(`Pembayaran berhasil ${status === "approved" ? "disetujui" : "ditolak"}`);
      setShowDetailModal(false);
      fetchPayments();
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Gagal memperbarui status pembayaran");
    }
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
      minimumFractionDigits: 0,
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
    switch (status) {
      case "approved":
        return <Badge variant="success">Disetujui</Badge>;
      case "rejected":
        return <Badge variant="destructive">Ditolak</Badge>;
      case "pending":
        return <Badge variant="warning">Menunggu</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Filter payments based on status and search term
  const filteredPayments = payments.filter((payment) => {
    const matchesFilter = filter === "all" || payment.status === filter;
    const matchesSearch =
      (payment.user_username || payment.masyarakat_nama)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payment_type_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payment_month?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const counts = {
    total: payments.length,
    pending: payments.filter((p) => p.status === "pending").length,
    approved: payments.filter((p) => p.status === "approved").length,
    rejected: payments.filter((p) => p.status === "rejected").length,
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1">Data Pembayaran</h2>
          <p className="text-muted mb-0">Kelola semua data pembayaran masyarakat</p>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <span className="badge bg-secondary-subtle text-secondary-emphasis">
            Total: {counts.total}
          </span>
          <button
            className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setFilter("all")}
          >
            Semua <span className="badge bg-light text-dark ms-1">{counts.total}</span>
          </button>
          <button
            className={`btn btn-sm ${filter === "pending" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setFilter("pending")}
          >
            Menunggu <span className="badge bg-light text-dark ms-1">{counts.pending}</span>
          </button>
          <button
            className={`btn btn-sm ${filter === "approved" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setFilter("approved")}
          >
            Disetujui <span className="badge bg-light text-dark ms-1">{counts.approved}</span>
          </button>
          <button
            className={`btn btn-sm ${filter === "rejected" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setFilter("rejected")}
          >
            Ditolak <span className="badge bg-light text-dark ms-1">{counts.rejected}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-4 border-0 shadow-sm card-hover">
        <CardContent className="p-4">
          <div className="row g-3">
            <div className="col-lg-8">
              <label className="form-label">Cari Pembayaran</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari berdasarkan nama, jenis pembayaran, atau bulan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-4">
              <label className="form-label">Filter Status</label>
              <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="approved">Disetujui</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="border-0 shadow-sm card-hover">
        <CardHeader>
          <CardTitle className="d-flex align-items-center">
            <i className="bi bi-credit-card-2-front me-2 text-primary"></i>
            Data Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox display-4 text-muted mb-3"></i>
              <p className="text-muted">{searchTerm || filter !== "all" ? "Tidak ada pembayaran yang sesuai dengan filter" : "Belum ada data pembayaran"}</p>
            </div>
          ) : (
            <div className="table-responsive table-fixed">
              <table className="table table-striped table-hover align-middle table-nowrap">
                <thead className="table-light">
                  <tr>
                    <th>Nama</th>
                    <th>Jenis Pembayaran</th>
                    <th>Bulan</th>
                    <th>Jumlah</th>
                    <th>Status</th>
                    <th>Tanggal Submit</th>
                    <th>Bukti</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        <div className="fw-semibold">{payment.masyarakat_nama || payment.user_username}</div>
                        <small className="text-muted">{payment.masyarakat_nik || payment.user_username}</small>
                      </td>
                      <td>{payment.payment_type_name}</td>
                      <td>{payment.payment_month}</td>
                      <td className="fw-semibold">{formatCurrency(payment.amount)}</td>
                      <td>{getStatusBadge(payment.status)}</td>
                      <td>{formatDate(payment.created_at)}</td>
                      <td>
                        {payment.payment_proof ? (
                          <a href={`http://localhost:5000${payment.payment_proof}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-eye me-1"></i>Lihat
                          </a>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <Button variant="outline" size="sm" onClick={() => handleShowDetail(payment.id)} title="Lihat Detail">
                            <i className="bi bi-eye"></i>
                          </Button>
                          {payment.status === "pending" && (
                            <>
                              <Button variant="default" size="sm" onClick={() => handlePaymentAction(payment.id, "approved")} title="Setujui">
                                <i className="bi bi-check-lg"></i>
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handlePaymentAction(payment.id, "rejected")} title="Tolak">
                                <i className="bi bi-x-lg"></i>
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Detail Modal */}
      {showDetailModal && selectedPayment && <PaymentDetailModal payment={selectedPayment} onClose={() => setShowDetailModal(false)} onAction={handlePaymentAction} />}
    </>
  );
};

export default DataPembayaranContent;
