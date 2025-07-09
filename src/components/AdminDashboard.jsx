import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { toast } from "react-hot-toast";
import PaymentDetailModal from "./PaymentDetailModal";
import DataMasyarakatContent from "./DataMasyarakatContent";
import DataPembayaranContent from "./DataPembayaranContent";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { PaymentStatusChart, MonthlyPaymentChart } from "./DashboardChart";
import PaymentApprovalTable from "./PaymentApprovalTable";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    masyarakat: 0,
    users: 0,
    payments: { total: 0, pending: 0, approved: 0, rejected: 0, totalAmount: 0 },
  });
  const [pendingPayments, setPendingPayments] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, masyarakat, pembayaran

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const generateMonthlyData = (payments) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const currentYear = new Date().getFullYear();

    const monthlyStats = months.map((month, index) => {
      const monthPayments = payments.filter((payment) => {
        const paymentDate = new Date(payment.created_at);
        return paymentDate.getFullYear() === currentYear && paymentDate.getMonth() === index && payment.status === "approved";
      });

      const totalAmount = monthPayments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);

      return {
        month,
        amount: totalAmount,
      };
    });

    return monthlyStats;
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch statistics
      const [masyarakatRes, paymentsRes, pendingRes, allPaymentsRes] = await Promise.all([api.get("/masyarakat"), api.get("/payments/stats"), api.get("/payments?status=pending"), api.get("/payments")]);

      // Hitung total amount dari semua pembayaran yang approved
      const allPayments = allPaymentsRes.data.data || [];
      const totalAmount = allPayments.filter((p) => p.status === "approved").reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

      // Generate monthly data untuk chart
      const monthlyStats = generateMonthlyData(allPayments);

      setStats({
        masyarakat: masyarakatRes.data.data.length,
        users: 0,
        payments: {
          ...paymentsRes.data.data,
          totalAmount,
        },
      });

      setPendingPayments(pendingRes.data.data);
      setMonthlyData(monthlyStats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentAction = async (paymentId, status, notes = "") => {
    try {
      await api.put(`/payments/${paymentId}/status`, { status, notes });
      toast.success(`Pembayaran berhasil ${status === "approved" ? "disetujui" : "ditolak"}`);
      setShowDetailModal(false);
      fetchDashboardData();
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...s</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className="sidebar bg-dark text-white">
        {/* Sidebar Header */}
        <div className="p-4 border-bottom border-secondary">
          <div className="d-flex align-items-center">
            <div className="bg-primary rounded-3 p-3 me-3" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }}>
              <i className="bi bi-shield-check text-white fs-5"></i>
            </div>
            <div>
              <h5 className="mb-0 text-white fw-bold">Admin Panel</h5>
              <small className="text-white-50">RT Management System</small>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="sidebar-nav">
          <div className="nav flex-column">
            <button className={`nav-link text-start border-0 rounded mb-2 p-3 d-flex align-items-center ${activeTab === "dashboard" ? "bg-primary text-white" : "text-light bg-transparent"}`} onClick={() => setActiveTab("dashboard")}>
              <i className="bi bi-house-door me-3 fs-5"></i>
              <span className="fw-medium">Dashboard</span>
            </button>
            <button className={`nav-link text-start border-0 rounded mb-2 p-3 d-flex align-items-center ${activeTab === "masyarakat" ? "bg-primary text-white" : "text-light bg-transparent"}`} onClick={() => setActiveTab("masyarakat")}>
              <i className="bi bi-people-fill me-3 fs-5"></i>
              <span className="fw-medium">Data Masyarakat</span>
            </button>
            <button className={`nav-link text-start border-0 rounded mb-2 p-3 d-flex align-items-center ${activeTab === "pembayaran" ? "bg-primary text-white" : "text-light bg-transparent"}`} onClick={() => setActiveTab("pembayaran")}>
              <i className="bi bi-credit-card-2-front me-3 fs-5"></i>
              <span className="fw-medium">Data Pembayaran</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              <i className="bi bi-person-circle fs-5"></i>
            </div>
            <div className="flex-grow-1">
              <div className="text-white fw-semibold">{user?.username}</div>
              <small className="text-white-50">
                <i className="bi bi-shield-check me-1"></i>
                Administrator
              </small>
            </div>
          </div>
          <button className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center" onClick={logout}>
            <i className="bi bi-box-arrow-right me-2"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ background: "#f8fafc" }}>
        {/* Top Header */}
        <div className="bg-white shadow-sm border-bottom p-3 d-lg-none">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Dashboard</h5>
            <button className="btn mobile-menu-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarOffcanvas">
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4">
          {activeTab === "dashboard" && (
            <>
              {/* Page Header */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="h3 mb-1">Dashboard Overview</h2>
                  <p className="text-muted mb-0">Monitor sistem dan kelola pembayaran</p>
                </div>
                <div className="d-flex align-items-center text-muted">
                  <i className="bi bi-circle-fill text-success me-2" style={{ fontSize: "0.5rem" }}></i>
                  <span className="me-3">Online</span>
                  <i className="bi bi-calendar3 me-2"></i>
                  <span>{new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="row g-4 mb-5">
                <div className="col-xl-3 col-md-6">
                  <Card className="border-0 h-100" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                    <CardContent className="text-white">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="bg-white bg-opacity-20 rounded-3 p-3">
                            <i className="bi bi-people text-white fs-4"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <CardDescription className="text-white-50 text-uppercase fw-bold mb-1 small">Total Masyarakat</CardDescription>
                          <CardTitle className="text-white fs-2 mb-1">{stats.masyarakat}</CardTitle>
                          <div className="text-white-50 small">
                            <i className="bi bi-arrow-up me-1"></i>Data terdaftar
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="col-xl-3 col-md-6">
                  <Card className="border-0 h-100" style={{ background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }}>
                    <CardContent className="text-white">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="bg-white bg-opacity-20 rounded-3 p-3">
                            <i className="bi bi-check-circle text-white fs-4"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <CardDescription className="text-white-50 text-uppercase fw-bold mb-1 small">Disetujui</CardDescription>
                          <CardTitle className="text-white fs-2 mb-1">{stats.payments.approved}</CardTitle>
                          <div className="text-white-50 small">
                            <i className="bi bi-arrow-up me-1"></i>Pembayaran approved
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="col-xl-3 col-md-6">
                  <Card className="border-0 h-100" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
                    <CardContent className="text-white">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="bg-white bg-opacity-20 rounded-3 p-3">
                            <i className="bi bi-clock text-white fs-4"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <CardDescription className="text-white-50 text-uppercase fw-bold mb-1 small">Menunggu</CardDescription>
                          <CardTitle className="text-white fs-2 mb-1">{stats.payments.pending}</CardTitle>
                          <div className="text-white-50 small">
                            <i className="bi bi-clock me-1"></i>Perlu persetujuan
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="col-xl-3 col-md-6">
                  <Card className="border-0 h-100" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
                    <CardContent className="text-white">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="bg-white bg-opacity-20 rounded-3 p-3">
                            <i className="bi bi-cash-stack text-white fs-4"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <CardDescription className="text-white-50 text-uppercase fw-bold mb-1 small">Total Pemasukan</CardDescription>
                          <CardTitle className="text-white fs-2 mb-1">Rp {stats.payments.totalAmount?.toLocaleString("id-ID") || "0"}</CardTitle>
                          <div className="text-white-50 small">
                            <i className="bi bi-arrow-up me-1"></i>Total pembayaran
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Charts Row */}
              <div className="row g-4 mb-5">
                <div className="col-lg-6">
                  <PaymentStatusChart stats={stats} />
                </div>
                <div className="col-lg-6">
                  <MonthlyPaymentChart monthlyData={monthlyData} />
                </div>
              </div>

              {/* Pending Payments */}
              <div className="row">
                <div className="col-12">
                  <PaymentApprovalTable payments={pendingPayments} onRefresh={fetchDashboardData} />
                </div>
              </div>
            </>
          )}

          {/* Data Masyarakat Tab */}
          {activeTab === "masyarakat" && <DataMasyarakatContent />}

          {/* Data Pembayaran Tab */}
          {activeTab === "pembayaran" && <DataPembayaranContent />}
        </div>
      </div>

      {/* Mobile Offcanvas Sidebar */}
      <div className="offcanvas offcanvas-start bg-dark text-white" tabIndex="-1" id="sidebarOffcanvas">
        <div className="offcanvas-header border-bottom border-secondary">
          <div className="d-flex align-items-center">
            <div className="bg-primary rounded-3 p-3 me-3" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }}>
              <i className="bi bi-shield-check text-white fs-5"></i>
            </div>
            <div>
              <h5 className="mb-0 text-white fw-bold">Admin Panel</h5>
              <small className="text-white-50">RT Management System</small>
            </div>
          </div>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>

        <div className="offcanvas-body p-3">
          <div className="nav flex-column">
            <button
              className={`nav-link text-start border-0 rounded mb-2 p-3 d-flex align-items-center ${activeTab === "dashboard" ? "bg-primary text-white" : "text-light bg-transparent"}`}
              onClick={() => setActiveTab("dashboard")}
              data-bs-dismiss="offcanvas"
            >
              <i className="bi bi-house-door me-3 fs-5"></i>
              <span className="fw-medium">Dashboard</span>
            </button>
            <button
              className={`nav-link text-start border-0 rounded mb-2 p-3 d-flex align-items-center ${activeTab === "masyarakat" ? "bg-primary text-white" : "text-light bg-transparent"}`}
              onClick={() => setActiveTab("masyarakat")}
              data-bs-dismiss="offcanvas"
            >
              <i className="bi bi-people-fill me-3 fs-5"></i>
              <span className="fw-medium">Data Masyarakat</span>
            </button>
            <button
              className={`nav-link text-start border-0 rounded mb-2 p-3 d-flex align-items-center ${activeTab === "pembayaran" ? "bg-primary text-white" : "text-light bg-transparent"}`}
              onClick={() => setActiveTab("pembayaran")}
              data-bs-dismiss="offcanvas"
            >
              <i className="bi bi-credit-card-2-front me-3 fs-5"></i>
              <span className="fw-medium">Data Pembayaran</span>
            </button>
          </div>

          <div className="mt-auto pt-4 border-top border-secondary">
            <div className="d-flex align-items-center mb-3">
              <div className="sidebar-user-avatar me-3">
                <i className="bi bi-person-circle fs-5"></i>
              </div>
              <div className="flex-grow-1">
                <div className="fw-bold text-white">{user?.username}</div>
                <small className="text-white-50">
                  <i className="bi bi-shield-check me-1"></i>
                  Administrator
                </small>
              </div>
            </div>
            <button className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center" onClick={logout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payment Detail Modal */}
      {showDetailModal && selectedPayment && <PaymentDetailModal payment={selectedPayment} onClose={() => setShowDetailModal(false)} onAction={handlePaymentAction} />}
    </div>
  );
};

export default AdminDashboard;
