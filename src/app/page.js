import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>Aura Watch</div>
        <div className={styles.navLinks}>
          <a href="#features">Tính năng</a>
          <a href="#specs">Thông số</a>
          <a href="#newsletter">Đăng ký</a>
        </div>
        <button className={styles.ctaBtn}>Mua Ngay</button>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Công nghệ tương lai trên cổ tay bạn.</h1>
          <p>
            Trải nghiệm Aura Watch với màn hình OLED sắc nét, theo dõi sức khỏe chuyên sâu 24/7 và thiết kế khung viền Titanium siêu nhẹ.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.primaryBtn}>Khám phá ngay</button>
            <button className={styles.secondaryBtn}>Xem video</button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/hero.png"
            alt="Aura Smartwatch"
            width={500}
            height={500}
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <h2>Tính năng vượt trội</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.icon}>❤️</div>
            <h3>Đo nhịp tim 24/7</h3>
            <p>Cảm biến quang học thế hệ mới giúp theo dõi chính xác nhịp tim và cảnh báo bất thường.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>🔋</div>
            <h3>Pin 14 ngày</h3>
            <p>Chip xử lý tiết kiệm năng lượng cho phép bạn sử dụng liên tục lên đến 14 ngày chỉ với 1 lần sạc.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>🏃‍♂️</div>
            <h3>100+ Chế độ tập luyện</h3>
            <p>Tự động nhận diện bài tập và phân tích chi tiết dữ liệu tập luyện của bạn.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>🌊</div>
            <h3>Kháng nước 5ATM</h3>
            <p>Thoải mái bơi lội và hoạt động dưới nước với khả năng chịu áp lực nước ở độ sâu 50m.</p>
          </div>
        </div>
      </section>

      {/* Specs Section */}
      <section id="specs" className={styles.specs}>
        <div className={styles.specsImage}>
           <Image
            src="/hero.png"
            alt="Aura Watch Specs"
            width={400}
            height={400}
          />
        </div>
        <div className={styles.specsContent}>
          <h2>Thông số kỹ thuật</h2>
          <ul className={styles.specList}>
            <li>
              <span className={styles.specLabel}>Màn hình</span>
              <span className={styles.specValue}>1.43" AMOLED, 60Hz</span>
            </li>
            <li>
              <span className={styles.specLabel}>Chất liệu</span>
              <span className={styles.specValue}>Titanium & Kính Sapphire</span>
            </li>
            <li>
              <span className={styles.specLabel}>Trọng lượng</span>
              <span className={styles.specValue}>35g (không tính dây)</span>
            </li>
            <li>
              <span className={styles.specLabel}>Kết nối</span>
              <span className={styles.specValue}>Bluetooth 5.3, GPS độc lập</span>
            </li>
            <li>
              <span className={styles.specLabel}>Cảm biến</span>
              <span className={styles.specValue}>SpO2, Nhịp tim, Gia tốc kế</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className={styles.newsletter}>
        <h2>Trở thành người đầu tiên sở hữu</h2>
        <p>Đăng ký email để nhận thông tin sớm nhất về Aura Watch cùng ưu đãi lên đến 20%.</p>
        <form className={styles.form}>
          <input 
            type="email" 
            placeholder="Nhập email của bạn..." 
            className={styles.input} 
            required 
          />
          <button type="submit" className={styles.submitBtn}>
            Đăng ký nhận tin
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 Aura Watch. Bảo lưu mọi quyền.</p>
      </footer>
    </main>
  );
}
