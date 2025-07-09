import React from 'react';

const PaymentDetailModal = ({ payment, onClose, onApprove, onReject, isAdmin = false }) => {
  if (!payment) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning',
      approved: 'bg-success',
      rejected: 'bg-danger'
    };
    
    const labels = {
      pending: 'Menunggu Persetujuan',
      approved: 'Disetujui',
      rejected: 'Ditolak'
    };

    return (
      <span className={`badge ${badges[status]} fs-6`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-receipt me-2"></i>
              Detail Pembayaran
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="row">
              {/* Payment Information */}
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header">
                    <h6 className="card-title mb-0">
                      <i className="bi bi-info-circle me-2"></i>
                      Informasi Pembayaran
                    </h6>
                  </div>
                  <div className="card-body">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>ID Pembayaran:</strong></td>
                          <td>#{payment.id}</td>
                        </tr>
                        <tr>
                          <td><strong>Nama:</strong></td>
                          <td>{payment.masyarakat_nama}</td>
                        </tr>
                        <tr>
                          <td><strong>NIK:</strong></td>
                          <td>{payment.masyarakat_nik}</td>
                        </tr>
                        <tr>
                          <td><strong>Jenis Pembayaran:</strong></td>
                          <td>{payment.payment_type_name}</td>
                        </tr>
                        <tr>
                          <td><strong>Bulan:</strong></td>
                          <td>{payment.payment_month}</td>
                        </tr>
                        <tr>
                          <td><strong>Jumlah:</strong></td>
                          <td><strong className="text-primary">{formatCurrency(payment.amount)}</strong></td>
                        </tr>
                        <tr>
                          <td><strong>Status:</strong></td>
                          <td>{getStatusBadge(payment.status)}</td>
                        </tr>
                        <tr>
                          <td><strong>Tanggal Submit:</strong></td>
                          <td>{formatDate(payment.created_at)}</td>
                        </tr>
                        {payment.payment_date && (
                          <tr>
                            <td><strong>Tanggal Disetujui:</strong></td>
                            <td>{formatDate(payment.payment_date)}</td>
                          </tr>
                        )}
                        {payment.approved_by_username && (
                          <tr>
                            <td><strong>Disetujui oleh:</strong></td>
                            <td>{payment.approved_by_username}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Proof Image */}
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header">
                    <h6 className="card-title mb-0">
                      <i className="bi bi-image me-2"></i>
                      Bukti Pembayaran
                    </h6>
                  </div>
                  <div className="card-body d-flex align-items-center justify-content-center">
                    {payment.proof_image ? (
                      <div className="text-center">
                        <img 
                          src={`http://localhost:5000/uploads/payments/${payment.proof_image}`}
                          alt="Bukti Pembayaran"
                          className="img-fluid rounded shadow"
                          style={{ maxHeight: '300px', maxWidth: '100%' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div style={{ display: 'none' }} className="text-muted">
                          <i className="bi bi-image display-4 mb-3"></i>
                          <p>Gambar tidak dapat dimuat</p>
                        </div>
                        <div className="mt-2">
                          <a 
                            href={`http://localhost:5000/uploads/payments/${payment.proof_image}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="bi bi-eye me-1"></i>
                            Lihat Full Size
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted">
                        <i className="bi bi-image display-4 mb-3"></i>
                        <p>Tidak ada bukti pembayaran</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {payment.notes && (
              <div className="row mt-3">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="card-title mb-0">
                        <i className="bi bi-chat-text me-2"></i>
                        Catatan
                      </h6>
                    </div>
                    <div className="card-body">
                      <p className="mb-0">{payment.notes}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
            >
              Tutup
            </button>
            
            {isAdmin && payment.status === 'pending' && (
              <>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => onReject(payment.id)}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Tolak
                </button>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={() => onApprove(payment.id)}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Setujui
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailModal;
