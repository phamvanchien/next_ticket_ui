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
      <Head>
        <title>Next Tech - Quản lý dự án chuyên nghiệp</title>
      </Head>

      <header className="fixed-top bg-white shadow-sm py-2 transition">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light">
            <a href="/" className="navbar-brand fw-bold d-flex align-items-center">
              <img src="/logo.png" width={40} height={40} className="me-2" alt="Next Tech logo" />
              Next Tech
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a href="#features" className="nav-link">Tính Năng</a>
                </li>
                <li className="nav-item">
                  <a href="#pricing" className="nav-link">Bảng Giá</a>
                </li>
                <li className="nav-item">
                  <a href="#about" className="nav-link">Giới Thiệu</a>
                </li>
                <li className="nav-item">
                  <a href="/login" className="btn btn-outline-primary ms-3">Đăng Nhập</a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>

      <section className="hero-section py-5 bg-light">
  <div className="container">
    <div className="row align-items-center">
      {/* LEFT: TEXT + BUTTON */}
      <div className="col-md-6 mb-4 mb-md-0">
        <h1 className="display-5 fw-bold mb-3">
          Kết nối mọi nhóm, công việc và dự án với <span className="text-primary">Next Tech</span>
        </h1>
        <p className="lead mb-4">
          Quản lý mọi khía cạnh công việc nhóm với công cụ tối ưu dành cho doanh nghiệp hiện đại.
        </p>
        <button className="btn btn-primary w-100 px-4">Bắt đầu ngay</button>
      </div>

      {/* RIGHT: IMAGE MOCKUP */}
      <div className="col-md-6 text-center">
        <img
          src="/images/hero-mockup.png"
          className="img-fluid rounded shadow"
          alt="Giao diện project board"
        />
      </div>
    </div>
  </div>
</section>


      <section id="features" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Tính Năng Nổi Bật</h2>
          <div className="row g-5">
            <div className="col-md-6">
              <img src="/banners/project-manage.png" className="img-fluid rounded shadow-sm" alt="Quản lý dự án" />
            </div>
            <div className="col-md-6">
              <h4 className="fw-bold mb-3">Quản Lý Dự Án Toàn Diện</h4>
              <p>Tối ưu hóa quy trình làm việc với công cụ quản lý dự án mạnh mẽ.</p>
              <ul className="list-unstyled">
                <li><FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" /> Lập kế hoạch và phân chia công việc</li>
                <li><FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" /> Theo dõi tiến độ theo thời gian thực</li>
                <li><FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" /> Thiết lập mức độ ưu tiên linh hoạt</li>
              </ul>
            </div>

            <div className="col-md-6 order-md-2">
              <img src="/banners/project-board.png" className="img-fluid rounded shadow-sm" alt="Báo cáo tiến độ" />
            </div>
            <div className="col-md-6 order-md-1">
              <h4 className="fw-bold mb-3">Theo Dõi & Báo Cáo Trực Quan</h4>
              <p>Biểu đồ sinh động giúp dễ dàng nắm bắt hiệu suất.</p>
              <ul className="list-unstyled">
                <li><FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" /> Báo cáo thời gian thực</li>
                <li><FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" /> Biểu đồ, bảng biểu sinh động</li>
                <li><FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" /> Dễ dàng chia sẻ với team</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Bảng Giá</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="card h-100 shadow text-center">
                <div className="card-header bg-light py-3">
                  <h4>Gói Miễn Phí</h4>
                </div>
                <div className="card-body">
                  <h3 className="mb-3">₫0</h3>
                  <ul className="list-unstyled">
                    <li>1 Dự án</li>
                    <li>5 Thành viên</li>
                    <li>Tính năng cơ bản</li>
                  </ul>
                  <a href="#" className="btn btn-outline-primary mt-3">Bắt đầu</a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-lg text-center border-primary">
                <div className="card-header bg-primary text-white py-3">
                  <h4>Gói Chuyên Nghiệp</h4>
                </div>
                <div className="card-body">
                  <h3 className="mb-3">₫500,000</h3>
                  <ul className="list-unstyled">
                    <li>10 Dự án</li>
                    <li>50 Thành viên</li>
                    <li>Báo cáo nâng cao</li>
                  </ul>
                  <a href="#" className="btn btn-primary mt-3">Đăng ký</a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow text-center">
                <div className="card-header bg-dark text-white py-3">
                  <h4>Gói Doanh Nghiệp</h4>
                </div>
                <div className="card-body">
                  <h3 className="mb-3">₫1,500,000</h3>
                  <ul className="list-unstyled">
                    <li>Không giới hạn dự án</li>
                    <li>Không giới hạn thành viên</li>
                    <li>Công cụ phân tích nâng cao</li>
                  </ul>
                  <a href="#" className="btn btn-dark mt-3">Liên hệ</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p>© 2025 Next Tech. Mọi quyền được bảo lưu.</p>
          <p>Liên hệ: <a href="mailto:support@nexttech.com" className="text-white">support@nexttech.com</a></p>
        </div>
      </footer>

      <style jsx global>{`
        body {
          padding-top: 70px;
        }
        header.scrolled {
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          background-color: #fff !important;
        }
      `}</style>
    </>
  );
};

export default HomeView;