import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { toast } from "react-hot-toast";
import api from "../services/api";

const PaymentApprovalTable = ({ payments, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(""); // 'approve' or 'reject'
  const [notes, setNotes] = useState("");

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

  const handleAction = (payment, action) => {
    setSelectedPayment(payment);
    setActionType(action);
    setShowModal(true);
    setNotes("");
  };

  const submitAction = async () => {
    if (!selectedPayment) return;

    try {
      setLoading(true);

      await api.put(`/payments/${selectedPayment.id}/status`, {
        status: actionType === "approve" ? "approved" : "rejected",
        notes: notes.trim() || undefined,
      });

      toast.success(`Pembayaran berhasil ${actionType === "approve" ? "disetujui" : "ditolak"}`);

      setShowModal(false);
      onRefresh();
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Gagal memperbarui status pembayaran");
    } finally {
      setLoading(false);
    }
  };

  if (!payments || payments.length === 0) {
    return (
      <Card className="border-0 shadow-sm card-hover">
        <CardHeader>
          <CardTitle className="d-flex align-items-center">
            <i className="bi bi-clock-history me-2 text-warning"></i>
            Pembayaran Menunggu Persetujuan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-5">
            <i className="bi bi-check-circle display-4 text-muted mb-3"></i>
            <p className="text-muted">Tidak ada pembayaran yang menunggu persetujuan</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-sm card-hover">
        <CardHeader>
          <CardTitle className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <i className="bi bi-clock-history me-2 text-warning"></i>
              Pembayaran Menunggu Persetujuan
            </div>
            <Badge variant="warning">{payments.length} pending</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="table-responsive table-fixed">
            <table className="table table-striped table-hover align-middle table-nowrap">
              <thead className="table-light">
                <tr>
                  <th>Nama</th>
                  <th>Jenis Pembayaran</th>
                  <th>Bulan</th>
                  <th>Jumlah</th>
                  <th>Tanggal Upload</th>
                  <th>Bukti</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <div className="fw-semibold">{payment.masyarakat_nama || payment.user_username}</div>
                      <small className="text-muted">{payment.masyarakat_nik || payment.user_username}</small>
                    </td>
                    <td>{payment.payment_type_name}</td>
                    <td>{payment.payment_month}</td>
                    <td className="fw-semibold">{formatCurrency(payment.amount)}</td>
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
                        <Button variant="default" size="sm" onClick={() => handleAction(payment, "approve")} className="btn-sm">
                          <i className="bi bi-check-lg me-1"></i>
                          Setujui
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleAction(payment, "reject")} className="btn-sm">
                          <i className="bi bi-x-lg me-1"></i>
                          Tolak
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{actionType === "approve" ? "Setujui" : "Tolak"} Pembayaran</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>
                  Apakah Anda yakin ingin {actionType === "approve" ? "menyetujui" : "menolak"} pembayaran dari <strong>{selectedPayment?.masyarakat_nama || selectedPayment?.user_username}</strong> sebesar{" "}
                  <strong>{formatCurrency(selectedPayment?.amount)}</strong>?
                </p>

                <div className="mb-3">
                  <label className="form-label">Catatan {actionType === "reject" ? "(Wajib)" : "(Opsional)"}</label>
                  <textarea className="form-control" rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={`Masukkan catatan ${actionType === "approve" ? "persetujuan" : "penolakan"}...`} />
                </div>
              </div>
              <div className="modal-footer">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Batal
                </Button>
                <Button variant={actionType === "approve" ? "default" : "destructive"} onClick={submitAction} loading={loading} disabled={actionType === "reject" && !notes.trim()}>
                  {actionType === "approve" ? "Setujui" : "Tolak"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentApprovalTable;
