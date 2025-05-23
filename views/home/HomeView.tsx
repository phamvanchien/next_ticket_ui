"use client"
import Head from 'next/head';
import { useState } from 'react';

const HomeView = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="next-tech-landing">
      <Head>
        <title>Next Tech - Modern Project Management Platform</title>
        <meta name="description" content="Next Tech is an all-in-one project management platform with AI capabilities for modern teams." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <span className="next-tech-logo me-2">Next Tech</span>
          </a>
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#about">Giới thiệu</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#features">Tính năng</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#ai">AI Features</a>
              </li>
              <li className="nav-item me-2">
                <a className="btn btn-outline-primary" href="#signup">Đăng ký</a>
              </li>
              <li className="nav-item">
                <a className="btn btn-primary" href="#login">Đăng nhập</a>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="hero-banner py-5 bg-light">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">Quản lý dự án thế hệ mới</h1>
              <p className="lead mb-4">Next Tech kết hợp quản lý dự án truyền thống với AI để giúp team của bạn làm việc hiệu quả hơn bao giờ hết.</p>
              <div className="d-flex gap-3">
                <a href="#signup" className="btn btn-primary btn-lg px-4">Bắt đầu miễn phí</a>
                <a href="#demo" className="btn btn-outline-secondary btn-lg px-4">Xem demo</a>
              </div>
            </div>
            <div className="col-lg-6">
              <img 
                src="/project-management-dashboard.png" 
                alt="Next Tech Dashboard" 
                className="img-fluid rounded shadow" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Tính năng nổi bật</h2>
            <p className="text-muted lead">Tất cả công cụ bạn cần để quản lý dự án thành công</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-kanban fs-1 text-primary"></i>
                  </div>
                  <h3 className="h5">Quản lý dự án linh hoạt</h3>
                  <p className="text-muted">Task board, task list, timeline view và nhiều chế độ xem khác phù hợp với mọi phong cách làm việc.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-shield-lock fs-1 text-primary"></i>
                  </div>
                  <h3 className="h5">Phân quyền chi tiết</h3>
                  <p className="text-muted">Kiểm soát truy cập theo workspace, dự án và từng tài liệu để bảo mật thông tin.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-bar-chart fs-1 text-primary"></i>
                  </div>
                  <h3 className="h5">Báo cáo & Phân tích</h3>
                  <p className="text-muted">Chấm công, thống kê hiệu suất và biểu đồ tiến độ giúp bạn luôn nắm bắt tình hình dự án.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-translate fs-1 text-primary"></i>
                  </div>
                  <h3 className="h5">Đa ngôn ngữ</h3>
                  <p className="text-muted">Hỗ trợ tiếng Việt, Anh, Nhật và nhiều ngôn ngữ khác cho team đa quốc gia.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-currency-exchange fs-1 text-primary"></i>
                  </div>
                  <h3 className="h5">Miễn phí 100%</h3>
                  <p className="text-muted">Sử dụng tất cả tính năng cơ bản hoàn toàn miễn phí, không giới hạn thời gian.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-cloud-arrow-up fs-1 text-primary"></i>
                  </div>
                  <h3 className="h5">Đồng bộ đám mây</h3>
                  <p className="text-muted">Truy cập dự án mọi lúc, mọi nơi trên tất cả thiết bị của bạn.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section id="ai" className="py-5 bg-light">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Sức mạnh AI trong Next Tech</h2>
            <p className="text-muted lead">Công nghệ AI giúp bạn làm việc thông minh hơn</p>
          </div>
          
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="pe-lg-5">
                <div className="d-flex mb-4">
                  <div className="me-4">
                    <div className="ai-icon rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
                      <i className="bi bi-lightbulb fs-4"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="h5">Gợi ý task tiếp theo</h3>
                    <p className="text-muted mb-0">AI phân tích tiến độ và đề xuất các task quan trọng cần thực hiện tiếp theo.</p>
                  </div>
                </div>
                
                <div className="d-flex mb-4">
                  <div className="me-4">
                    <div className="ai-icon rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
                      <i className="bi bi-people fs-4"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="h5">Gợi ý người phù hợp</h3>
                    <p className="text-muted mb-0">Tự động đề xuất thành viên phù hợp nhất cho từng task dựa trên kỹ năng và khối lượng công việc.</p>
                  </div>
                </div>
                
                <div className="d-flex mb-4">
                  <div className="me-4">
                    <div className="ai-icon rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
                      <i className="bi bi-chat-left-text fs-4"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="h5">Trợ lý chatbot</h3>
                    <p className="text-muted mb-0">Hỏi đáp tự nhiên để tạo, tìm kiếm task và nhận hỗ trợ ngay lập tức.</p>
                  </div>
                </div>
                
                <div className="d-flex">
                  <div className="me-4">
                    <div className="ai-icon rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
                      <i className="bi bi-file-text fs-4"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="h5">Tóm tắt tài liệu</h3>
                    <p className="text-muted mb-0">Tự động tóm tắt và highlight các điểm quan trọng trong tài liệu dự án.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <img 
                src="/ai-assistant-demo.png" 
                alt="Next Tech AI Assistant" 
                className="img-fluid rounded shadow" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container py-5 text-center">
          <h2 className="display-5 fw-bold mb-4">Sẵn sàng trải nghiệm Next Tech?</h2>
          <p className="lead mb-5 opacity-75">Đăng ký ngay để bắt đầu quản lý dự án thông minh hơn với AI</p>
          <a href="#signup" className="btn btn-light btn-lg px-5 py-3 fw-bold">Dùng thử miễn phí</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <div className="container py-4">
          <div className="row g-4">
            <div className="col-lg-4">
              <h3 className="h5 mb-3">Next Tech</h3>
              <p className="text-muted">Nền tảng quản lý dự án thế hệ mới kết hợp sức mạnh AI cho team làm việc hiệu quả.</p>
              <div className="social-icons mt-4">
                <a href="#" className="text-white me-3"><i className="bi bi-facebook fs-5"></i></a>
                <a href="#" className="text-white me-3"><i className="bi bi-twitter fs-5"></i></a>
                <a href="#" className="text-white me-3"><i className="bi bi-linkedin fs-5"></i></a>
                <a href="#" className="text-white"><i className="bi bi-youtube fs-5"></i></a>
              </div>
            </div>
            
            <div className="col-lg-2 col-md-4">
              <h4 className="h6 mb-3">Sản phẩm</h4>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-muted">Tính năng</a></li>
                <li className="mb-2"><a href="#" className="text-muted">Bảng giá</a></li>
                <li className="mb-2"><a href="#" className="text-muted">API</a></li>
                <li><a href="#" className="text-muted">Tích hợp</a></li>
              </ul>
            </div>
            
            <div className="col-lg-2 col-md-4">
              <h4 className="h6 mb-3">Tài nguyên</h4>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-muted">Tài liệu</a></li>
                <li className="mb-2"><a href="#" className="text-muted">Hướng dẫn</a></li>
                <li className="mb-2"><a href="#" className="text-muted">Blog</a></li>
                <li><a href="#" className="text-muted">FAQ</a></li>
              </ul>
            </div>
            
            <div className="col-lg-2 col-md-4">
              <h4 className="h6 mb-3">Công ty</h4>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-muted">Về chúng tôi</a></li>
                <li className="mb-2"><a href="#" className="text-muted">Tuyển dụng</a></li>
                <li className="mb-2"><a href="#" className="text-muted">Liên hệ</a></li>
                <li><a href="#" className="text-muted">Đối tác</a></li>
              </ul>
            </div>
            
            <div className="col-lg-2">
              <h4 className="h6 mb-3">Pháp lý</h4>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-muted">Điều khoản</a></li>
                <li className="mb-2"><a href="#" className="text-muted">Bảo mật</a></li>
                <li><a href="#" className="text-muted">Cookie</a></li>
              </ul>
            </div>
          </div>
          
          <hr className="my-4 border-secondary" />
          
          <div className="row">
            <div className="col-md-6 text-center text-md-start">
              <p className="small text-muted mb-0">© 2023 Next Tech. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <p className="small text-muted mb-0">Made with ❤️ for productive teams</p>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .next-tech-landing {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .next-tech-logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0d6efd;
          background: linear-gradient(90deg, #0d6efd 0%, #6610f2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .hero-banner {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        
        .feature-icon {
          color: #0d6efd;
        }
        
        .ai-icon {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
        }
        
        .card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        @media (max-width: 768px) {
          .hero-banner {
            text-align: center;
          }
          
          .display-4 {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}
export default HomeView;