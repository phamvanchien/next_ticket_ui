"use client"
import Head from "next/head";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from "react";

const HomeView = () => {
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (window.scrollY > 50) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <>


      <header className="fixed-top bg-white shadow-sm">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light">
            <a href="/" className="navbar-brand fw-bold">
              <img src="/logo.png" width={50} height={50} style={{ marginRight: 7 }} />
              Next Tech
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item mr-2">
                  <a href="/" className="nav-link active">Trang Chủ</a>
                </li>
                <li className="nav-item mr-2">
                  <a href="#articles" className="nav-link">Bài Viết</a>
                </li>
                <li className="nav-item mr-2">
                  <a href="#pricing" className="nav-link">Bảng Giá</a>
                </li>
                <li className="nav-item mr-2">
                  <a href="#about" className="nav-link">Giới Thiệu</a>
                </li>
                <li className="nav-item">
                  <a href="/login" className="btn btn-primary text-white ms-3">Đăng Nhập</a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>

      <section className="hero-section bg-primary text-white d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundImage: 'url(https://www.example.com/your-image.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="text-center">
          <h1 className="display-4 fw-bold">Quản lý dự án thông minh với Next Tech</h1>
          <p className="lead mb-4">Nền tảng giúp bạn tối ưu quy trình làm việc, quản lý dự án hiệu quả, và nâng cao năng suất công việc.</p>
          <a href="#features" className="btn btn-light btn-lg">Khám Phá Ngay</a>
        </div>
      </section>

      <section id="features" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">✨ Tính Năng Nổi Bật ✨</h2>

          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <img
                src="/banners/project-manage.png"
                alt="Quản lý Dự Án"
                className="img-fluid rounded-3 shadow-sm"
              />
            </div>
            <div className="col-md-6">
              <h4>🚀 Quản Lý Dự Án Toàn Diện</h4>
              <p className="text-muted">
                Tối ưu hóa quy trình làm việc với công cụ quản lý dự án hiện đại, giúp bạn dễ dàng nắm bắt và kiểm soát mọi chi tiết!
              </p>
              <ul>
                <li><FontAwesomeIcon icon={faCheckCircle} /> Lên kế hoạch chi tiết và theo dõi tiến độ</li>
                <li><FontAwesomeIcon icon={faCheckCircle} /> Phân chia công việc rõ ràng theo từng giai đoạn</li>
                <li><FontAwesomeIcon icon={faCheckCircle} /> Thiết lập mức độ ưu tiên cho từng nhiệm vụ</li>
              </ul>
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-md-6 order-md-2">
              <img
                src="/banners/project-board.png"
                alt="Theo Dõi Tiến Độ"
                className="img-fluid rounded-3 shadow-sm"
              />
            </div>
            <div className="col-md-6 order-md-1">
              <h4>📊 Theo Dõi Tiến Độ Liên Tục</h4>
              <p className="text-muted">
                Cập nhật tức thời tiến độ công việc với biểu đồ trực quan và báo cáo chi tiết, giúp bạn luôn nắm bắt mọi thay đổi!
              </p>
              <ul>
                <li><FontAwesomeIcon icon={faCheckCircle} /> Theo dõi tiến độ công việc theo thời gian thực</li>
                <li><FontAwesomeIcon icon={faCheckCircle} /> Báo cáo biểu đồ sinh động và dễ hiểu</li>
                <li><FontAwesomeIcon icon={faCheckCircle} /> Nhận thông báo tự động khi có thay đổi</li>
              </ul>
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <img
                src="/banners/project-board.png"
                alt="Báo Cáo Trực Quan"
                className="img-fluid rounded-3 shadow-sm"
              />
            </div>
            <div className="col-md-6">
              <h4>📈 Báo Cáo Trực Quan & Thông Minh</h4>
              <p className="text-muted">
                Tạo báo cáo tự động với các chỉ số quan trọng và dễ dàng theo dõi hiệu suất làm việc qua các loại biểu đồ đa dạng.
              </p>
              <ul>
                <li><FontAwesomeIcon icon={faCheckCircle} /> Báo cáo trực quan với các chỉ số quan trọng</li>
                <li><FontAwesomeIcon icon={faCheckCircle} /> Đa dạng biểu đồ, bảng và danh sách dễ theo dõi</li>
                <li><FontAwesomeIcon icon={faCheckCircle} /> Tự động cập nhật dữ liệu theo thời gian thực</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Các Gói Dịch Vụ</h2>
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card shadow-lg border-0 rounded-3 pricing-card">
                <div className="card-header bg-primary text-white text-center py-4">
                  <h4 className="card-title">Gói Miễn Phí</h4>
                  <p>Giải pháp cơ bản cho nhóm nhỏ</p>
                </div>
                <div className="card-body text-center">
                  <h3 className="price mb-4"><span className="currency">₫</span>0</h3>
                  <ul className="list-unstyled">
                    <li><FontAwesomeIcon icon={faCheckCircle} /> 1 Dự án</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} /> 5 Thành viên</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} /> Tính năng cơ bản</li>
                  </ul>
                  <a href="#register" className="btn btn-primary btn-lg">Đăng Ký Ngay</a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-lg border-0 rounded-3 pricing-card">
                <div className="card-header bg-warning text-white text-center py-4">
                  <h4 className="card-title">Gói Chuyên Nghiệp</h4>
                  <p>Tối ưu cho đội ngũ chuyên nghiệp</p>
                </div>
                <div className="card-body text-center">
                  <h3 className="price mb-4"><span className="currency">₫</span>500,000</h3>
                  <ul className="list-unstyled">
                    <li><FontAwesomeIcon icon={faCheckCircle} /> 10 Dự án</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} /> 50 Thành viên</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} /> Báo cáo nâng cao</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} /> Hỗ trợ 24/7</li>
                  </ul>
                  <a href="#register" className="btn btn-warning btn-lg">Đăng Ký Ngay</a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-lg border-0 rounded-3 pricing-card">
                <div className="card-header bg-dark text-white text-center py-4">
                  <h4 className="card-title">Gói Doanh Nghiệp</h4>
                  <p>Giải pháp toàn diện cho doanh nghiệp lớn</p>
                </div>
                <div className="card-body text-center">
                  <h3 className="price mb-4"><span className="currency">₫</span>1,500,000</h3>
                  <ul className="list-unstyled">
                    <li><FontAwesomeIcon icon={faCheckCircle} /> Không giới hạn dự án</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} /> Không giới hạn thành viên</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} /> Các công cụ phân tích nâng cao</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} /> Quản lý tài chính tích hợp</li>
                  </ul>
                  <a href="#register" className="btn btn-dark btn-lg">Đăng Ký Ngay</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white py-5 text-center">
        <div className="container">
          <p>Liên hệ với chúng tôi qua email: <a href="mailto:support@nexttech.com">support@nexttech.com</a></p>
          <p>&copy; 2025 Next Tech. All rights reserved.</p>
        </div>
      </footer>

      <style jsx global>{`
        body {
          padding-top: 56px;
        }
      `}</style>
    </>
  );
}

export default HomeView;