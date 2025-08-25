import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Users, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

const Login = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("admin"); // "admin" or "masyarakat"
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nik: "",
    nama: "",
  });
  const [loading, setLoading] = useState(false);
  const { login, loginMasyarakat } = useAuth();

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
      let result;

      if (loginType === "admin") {
        result = await login(formData.username, formData.password);
      } else {
        result = await loginMasyarakat(formData.nik, formData.nama);
      }

      console.log("Login result:", result);

      if (result.success) {
        console.log("Login successful, user:", result.user);
        toast.success(`Selamat datang, ${result.user.username || result.user.masyarakat_nama}!`);

        if (loginType === "masyarakat") {
          // Simpan data user di localStorage
          localStorage.setItem("userName", result.user.masyarakat_nama || result.user.username);
          localStorage.setItem("userNIK", result.user.masyarakat_nik || formData.nik);

          console.log("🚀 Masyarakat login - going to /user");
          // Gunakan SPA navigation agar context state (user/token) langsung terbaca oleh ProtectedRoute
          setTimeout(() => {
            navigate("/user", { replace: true });
          }, 0);
        } else {
          console.log("Admin/User login - going to /dashboard");
          setTimeout(() => {
            navigate("/dashboard");
          }, 100);
        }
      } else {
        console.log("Login failed:", result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="shadow-xl border border-border/60">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-semibold tracking-tight">Login</CardTitle>
            <p className="text-muted-foreground">Sistem Data Masyarakat RT</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Login Type Selector */}
            <div className="mb-6">
              <div className="flex w-full rounded-lg border border-input bg-background p-1 shadow-sm gap-1">
                <Button type="button" variant={loginType === "admin" ? "default" : "ghost"} className="flex-1" onClick={() => setLoginType("admin")} disabled={loading}>
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Button>
                <Button type="button" variant={loginType === "masyarakat" ? "default" : "ghost"} className="flex-1" onClick={() => setLoginType("masyarakat")} disabled={loading}>
                  <Users className="mr-2 h-4 w-4" />
                  Masyarakat
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {loginType === "admin" ? (
                <>
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">
                      Username atau Email
                    </label>
                    <Input type="text" id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Masukkan username atau email" required disabled={loading} className="h-12" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Masukkan password" required disabled={loading} className="h-12" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label htmlFor="nik" className="text-sm font-medium">
                      NIK
                    </label>
                    <Input type="text" id="nik" name="nik" value={formData.nik} onChange={handleChange} placeholder="Masukkan NIK Anda" required disabled={loading} className="h-12" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="nama" className="text-sm font-medium">
                      Nama Lengkap
                    </label>
                    <Input type="text" id="nama" name="nama" value={formData.nama} onChange={handleChange} placeholder="Masukkan nama lengkap sesuai KTP" required disabled={loading} className="h-12" />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full h-12 shadow-md hover:shadow-lg transition-shadow" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>

            <div className="border-t pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  <strong>Demo Accounts:</strong>
                  <br />
                  {loginType === "admin" ? (
                    <>
                      Admin: admin / password123
                    </>
                  ) : (
                    <>
                      Gunakan NIK dan nama dari data masyarakat yang sudah terdaftar
                      <br />
                      Contoh: NIK dan nama sesuai data di sistem
                    </>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
