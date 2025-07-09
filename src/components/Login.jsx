import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        toast.success(`Selamat datang, ${result.user.username}!`);
        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Login error:', error); // Tambahkan log error untuk debugging
      toast.error("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="bi bi-shield-lock display-4 text-primary mb-3"></i>
                  <h2 className="card-title mb-2">Login</h2>
                  <p className="text-muted">Sistem Data Masyarakat</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      <i className="bi bi-person me-2"></i>
                      Username atau Email
                    </label>
                    <input type="text" className="form-control form-control-lg" id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Masukkan username atau email" required disabled={loading} />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-lock me-2"></i>
                      Password
                    </label>
                    <input type="password" className="form-control form-control-lg" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Masukkan password" required disabled={loading} />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Masuk
                      </>
                    )}
                  </button>
                </form>

                <hr className="my-4" />

                <div className="text-center">
                  <small className="text-muted">
                    <strong>Demo Accounts:</strong>
                    <br />
                    Admin: admin / password123
                    <br />
                    User: ahmad.rizki / password123
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
