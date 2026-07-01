"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { Heart, Battery, Activity, Droplets, CheckCircle, ArrowRight } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState("");
  
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 1000], [0, 200]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Vui lòng nhập email hợp lệ!");
      return;
    }
    // Simulate webhook/API call
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Đang xử lý...',
        success: <b>Đăng ký thành công! Chào mừng bạn.</b>,
        error: <b>Đã có lỗi xảy ra.</b>,
      }
    );
    setEmail("");
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <main className={styles.main}>
      <Toaster position="top-center" />

      {/* Navbar */}
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.logo}>Aura Watch</div>
        <div className={styles.navLinks}>
          <a href="#features">Tính năng</a>
          <a href="#health">Sức khoẻ</a>
          <a href="#design">Thiết kế</a>
          <a href="#specs">Thông số</a>
        </div>
        <button className={styles.ctaBtn}>Mua Ngay</button>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.badge}>NEW • AI HEALTH SERIES</div>
          <h1>Sự hoàn mỹ trên cổ tay bạn.</h1>
          <p>
            Định hình lại phong cách sống với Aura Watch. Thiết kế nguyên khối Titanium, theo dõi sức khỏe AI 24/7 và năng lượng bền bỉ suốt 14 ngày. Trải nghiệm công nghệ vượt giới hạn.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.primaryBtn}>Đặt hàng trước</button>
            <button className={styles.ctaBtn} style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
              Xem Video
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.heroImageContainer}
          style={{ y: heroImageY }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className={styles.heroGlow}></div>
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, -2, 2, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <Image
              src="/hero.png"
              alt="Aura Smartwatch"
              width={650}
              height={650}
              priority
              className={styles.heroImage}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.section}>
        <motion.div 
          className={styles.sectionHeader}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <h2 className={styles.sectionTitle}>Quyền năng vô hạn</h2>
          <p className={styles.sectionSubtitle}>Mọi thứ bạn cần, giờ đây hội tụ hoàn hảo trong một thiết kế duy nhất.</p>
        </motion.div>
        
        <div className={styles.featuresGrid}>
          {[
            { icon: <Heart size={40} />, title: "Cảm biến quang học Pro", desc: "Theo dõi nhịp tim, SpO2 và ECG liên tục với độ chính xác chuẩn y tế." },
            { icon: <Battery size={40} />, title: "Năng lượng 14 ngày", desc: "Kiến trúc chip Dual-Core mới giúp tối ưu hoá năng lượng vượt trội." },
            { icon: <Activity size={40} />, title: "Huấn luyện viên AI", desc: "Tự động nhận diện 100+ bài tập và đề xuất lộ trình dựa trên thể trạng." },
            { icon: <Droplets size={40} />, title: "Chống nước 5ATM", desc: "Thoải mái bơi lội, lặn tự do với thiết kế kín tuyệt đối." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx} 
              className={styles.featureCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Health Tracking Section */}
      <section id="health" className={styles.section}>
        <div className={styles.splitSection}>
          <motion.div 
            className={styles.splitContent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2>Lắng nghe từng nhịp đập.</h2>
            <p>
              Hệ thống cảm biến sinh học đa kênh liên tục phân tích dữ liệu cơ thể bạn 24/7. 
              Từ chất lượng giấc ngủ đến mức độ căng thẳng, Aura Watch luôn thấu hiểu để đưa ra những lời khuyên tốt nhất cho sức khỏe của bạn.
            </p>
          </motion.div>
          <motion.div 
            className={styles.splitImage}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <Image src="/health.png" alt="Health Tracking" width={600} height={400} />
          </motion.div>
        </div>
      </section>

      {/* Design Section */}
      <section id="design" className={styles.section}>
        <div className={`${styles.splitSection} ${styles.splitReverse}`}>
          <motion.div 
            className={styles.splitContent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2>Chế tác từ Titanium.<br/>Đẹp không tì vết.</h2>
            <p>
              Vượt qua hàng trăm giờ gia công CNC, khung viền Titanium Aerospace kết hợp cùng mặt kính Sapphire nguyên khối mang lại độ bền vô đối và vẻ đẹp vượt thời gian.
            </p>
          </motion.div>
          <motion.div 
            className={styles.splitImage}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <Image src="/design.png" alt="Titanium Design" width={600} height={400} />
          </motion.div>
        </div>
      </section>

      {/* Technical Specs */}
      <section id="specs" className={styles.section}>
        <motion.div 
          className={styles.sectionHeader}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className={styles.sectionTitle}>Sức mạnh ẩn sâu bên trong</h2>
        </motion.div>
        
        <div className={styles.specsGrid}>
          {[
            { label: "Màn hình", value: '1.43" AMOLED' },
            { label: "Độ sáng tối đa", value: "2000 nits" },
            { label: "Vật liệu", value: "Titanium" },
            { label: "Trọng lượng", value: "35g" },
            { label: "Thời lượng pin", value: "14 Ngày" },
            { label: "Kết nối", value: "GPS & 5G" },
          ].map((spec, idx) => (
            <motion.div 
              key={idx} 
              className={styles.specCard}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className={styles.specValue}>{spec.value}</div>
              <div className={styles.specLabel}>{spec.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className={styles.section} style={{ paddingTop: '2rem' }}>
        <div className={styles.galleryGrid}>
          <div className={styles.galleryItem}>
             <Image src="/hero.png" alt="Gallery 1" width={500} height={500} />
          </div>
          <div className={styles.galleryItem}>
             <Image src="/health.png" alt="Gallery 2" width={500} height={500} />
          </div>
          <div className={styles.galleryItem}>
             <Image src="/design.png" alt="Gallery 3" width={500} height={500} />
          </div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className={styles.section}>
        <motion.div 
          className={styles.statsContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className={styles.statItem}>
            <h4>4.9/5</h4>
            <p>Đánh giá từ người dùng</p>
          </div>
          <div className={styles.statItem}>
            <h4>12.000+</h4>
            <p>Khách hàng tin dùng</p>
          </div>
          <div className={styles.statItem}>
            <h4>#1</h4>
            <p>Giải thưởng Thiết Kế 2026</p>
          </div>
        </motion.div>
      </section>

      {/* Newsletter Section */}
      <section className={styles.section}>
        <motion.div 
          className={styles.newsletterSection}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.sectionTitle}>Tham gia cùng chúng tôi</h2>
          <p className={styles.sectionSubtitle}>Đăng ký ngay để nhận thông báo sớm nhất về ngày ra mắt và ưu đãi độc quyền 20%.</p>
          
          <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Nhập email của bạn..." 
              className={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className={styles.submitBtn}>
              Đăng ký ngay <ArrowRight size={18} style={{ display: 'inline', marginLeft: '8px', verticalAlign: 'middle' }}/>
            </button>
          </form>
        </motion.div>
      </section>

      {/* CTA End */}
      <section className={styles.ctaEnd}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2>Ready to upgrade your lifestyle?</h2>
          <button className={styles.primaryBtn} style={{ fontSize: '1.2rem', padding: '1.2rem 3rem' }}>
            Mua Ngay
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <h3>Aura Watch</h3>
            <p>Công nghệ đột phá, thiết kế vượt thời gian. Kiến tạo chuẩn mực mới cho thiết bị đeo thông minh.</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.linkGroup}>
              <h4>Sản phẩm</h4>
              <ul>
                <li><a href="#">Aura Watch Pro</a></li>
                <li><a href="#">Aura Watch SE</a></li>
                <li><a href="#">Phụ kiện</a></li>
              </ul>
            </div>
            <div className={styles.linkGroup}>
              <h4>Hỗ trợ</h4>
              <ul>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Bảo hành</a></li>
                <li><a href="#">Liên hệ</a></li>
              </ul>
            </div>
            <div className={styles.linkGroup}>
              <h4>Công ty</h4>
              <ul>
                <li><a href="#">Về chúng tôi</a></li>
                <li><a href="#">Tuyển dụng</a></li>
                <li><a href="#">Tin tức</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 Aura Inc. Bảo lưu mọi quyền.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
