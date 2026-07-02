"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { m as motion, LazyMotion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import { Heart, Battery, Activity, Droplets, ArrowRight, Star, ShoppingBag, Moon, Sun, MessageSquare, Send } from "lucide-react";

const Toaster = dynamic(() => import("react-hot-toast").then(c => c.Toaster), { ssr: false });
import styles from "./page.module.css";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState("light");

  // Mini E-commerce State
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: "bot", text: "Xin chào! Mình là trợ lý ảo Aura. Mình có thể giúp gì cho bạn?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 1000], [0, 150]);

  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Vui lòng nhập email hợp lệ!");
      return;
    }

    toast.promise(
      (async () => {
        const { db } = await import("../lib/firebase");
        const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
        return addDoc(collection(db, "subscribers"), {
          email: email,
          timestamp: serverTimestamp()
        });
      })(),
      {
        loading: 'Đang xử lý...',
        success: <b>Đăng ký thành công! Chào mừng bạn.</b>,
        error: <b>Đã có lỗi xảy ra.</b>,
      }
    );
    setEmail("");
  };

  const addToCart = () => {
    setCartCount(prev => prev + 1);
    toast.success("Đã thêm Aura Watch vào giỏ hàng!", {
      icon: '🛍️',
    });
  };

  const addToWishlist = () => {
    setWishlistCount(prev => prev + 1);
    toast("Đã lưu vào danh sách yêu thích!", {
      icon: '❤️',
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const message = chatInput.trim();
    if (!message) return;

    const newMessages = [...chatMessages, { role: "user", text: message }];
    setChatMessages(newMessages);
    setChatInput("");

    try {
      const { db } = await import("../lib/firebase");
      const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

      // Lưu tin nhắn user vào Firebase
      await addDoc(collection(db, "chat_messages"), {
        text: message,
        role: "user",
        timestamp: serverTimestamp()
      });

      // Gọi API Gemini
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (response.ok && data.text) {
        setChatMessages(prev => [...prev, { role: "bot", text: data.text }]);
        // Lưu phản hồi của bot vào Firebase
        await addDoc(collection(db, "chat_messages"), {
          text: data.text,
          role: "bot",
          timestamp: serverTimestamp()
        });
      } else {
        setChatMessages(prev => [...prev, { role: "bot", text: "Xin lỗi, Aura đang gặp sự cố kết nối. Vui lòng thử lại sau!" }]);
      }
    } catch (error) {
      console.error("Error saving message:", error);
      setChatMessages(prev => [...prev, { role: "bot", text: "Xin lỗi, đã có lỗi kết nối mạng. Vui lòng thử lại!" }]);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <LazyMotion features={() => import("framer-motion").then((res) => res.domAnimation)}>
      <main className={styles.main}>
        <Toaster position="top-center" />

        {/* Navbar */}
        <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
          <div className={styles.logo}>Aura Watch</div>
          <div className={styles.navLinks}>
            <a href="#features">Tính năng</a>
            <a href="#health">Sức khoẻ</a>
            <a href="#specs">Thông số</a>
          </div>
          <div className={styles.navTools}>
            <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className={styles.iconBtn} onClick={() => setIsWishlistOpen(true)} aria-label="Mở danh sách yêu thích">
              <Heart size={20} />
              {wishlistCount > 0 && <span className={styles.badgeCount}>{wishlistCount}</span>}
            </button>
            <button className={styles.iconBtn} onClick={() => setIsCartOpen(true)} aria-label="Mở giỏ hàng">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className={styles.badgeCount}>{cartCount}</span>}
            </button>
            <button className={styles.ctaBtn} onClick={addToCart} style={{ display: 'none' }}>
              Mua Ngay
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className={styles.hero}>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.badge}>NEW • AI HEALTH SERIES</div>
            <h1>Sự hoàn mỹ trên cổ tay bạn.</h1>
            <p>
              Định hình lại phong cách sống với Aura Watch. Thiết kế nguyên khối Titanium, theo dõi sức khỏe AI 24/7 và năng lượng bền bỉ suốt 14 ngày.
            </p>
            <div className={styles.heroButtons}>
              <button className={styles.primaryBtn} onClick={addToCart}>Thêm vào giỏ</button>
              <button className={styles.ctaBtn} onClick={addToWishlist} style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
                <Heart size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} /> Yêu thích
              </button>
            </div>
          </motion.div>

          <motion.div
            className={styles.heroImageContainer}
            style={{ y: heroImageY }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className={styles.heroGlow}></div>
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, -1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <Image
                src="/hero.png"
                alt="Aura Smartwatch"
                width={550}
                height={550}
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
            <h2 className={styles.sectionTitle}>Mọi thứ bạn cần.</h2>
            <p className={styles.sectionSubtitle}>Hội tụ hoàn hảo trong một thiết kế duy nhất.</p>
          </motion.div>

          <div className={styles.featuresGrid}>
            {[
              { icon: <Heart size={32} strokeWidth={1.5} />, title: "Cảm biến quang học", desc: "Theo dõi nhịp tim và SpO2 liên tục với độ chính xác chuẩn y tế." },
              { icon: <Battery size={32} strokeWidth={1.5} />, title: "Năng lượng 14 ngày", desc: "Kiến trúc chip Dual-Core tối ưu hoá năng lượng vượt trội." },
              { icon: <Activity size={32} strokeWidth={1.5} />, title: "Huấn luyện viên AI", desc: "Tự động nhận diện bài tập và đề xuất lộ trình." },
              { icon: <Droplets size={32} strokeWidth={1.5} />, title: "Chống nước 5ATM", desc: "Thoải mái bơi lội với thiết kế nguyên khối kín hoàn toàn." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
              >
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Health Tracking (Compact) */}
        <section id="health" className={styles.section} style={{ paddingTop: '2rem' }}>
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
                Hệ thống cảm biến sinh học đa kênh phân tích dữ liệu 24/7. Từ giấc ngủ đến mức độ căng thẳng, Aura Watch luôn thấu hiểu để đưa ra lời khuyên tốt nhất.
              </p>
            </motion.div>
            <motion.div
              className={styles.splitImage}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <Image src="/health.png" alt="Health Tracking Focus" width={400} height={400} loading="lazy" sizes="(max-width: 768px) 100vw, 400px" />
            </motion.div>
          </div>
        </section>

        {/* Technical Specs (Compact) */}
        <section id="specs" className={styles.section} style={{ paddingTop: '2rem' }}>
          <motion.div
            className={styles.sectionHeader}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className={styles.sectionTitle}>Sức mạnh ẩn sâu.</h2>
          </motion.div>

          <div className={styles.specsGrid}>
            {[
              { label: "Màn hình", value: '1.43" AMOLED' },
              { label: "Vật liệu", value: "Titanium" },
              { label: "Trọng lượng", value: "35g" },
              { label: "Pin", value: "14 Ngày" }
            ].map((spec, idx) => (
              <motion.div
                key={idx}
                className={styles.specCard}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={styles.specValue}>{spec.value}</div>
                <div className={styles.specLabel}>{spec.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Social Proof (Redesigned) */}
        <section className={styles.section} style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <motion.div
            className={styles.statsContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className={styles.statItem}>
              <div className={styles.stars}>
                <Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} />
              </div>
              <h3>4.9/5</h3><p>Hàng ngàn đánh giá tích cực</p>
            </div>
            <div className={styles.statItem}>
              <h3>12.000+</h3><p>Khách hàng tin dùng</p>
            </div>
            <div className={styles.statItem}>
              <h3>#1</h3><p>Giải thưởng Thiết Kế 2026</p>
            </div>
          </motion.div>
        </section>

        {/* Newsletter Section */}
        <section className={styles.section} style={{ paddingBottom: '2rem' }}>
          <motion.div
            className={styles.newsletterSection}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>Tham gia cùng chúng tôi.</h2>
            <p className={styles.sectionSubtitle}>Đăng ký ngay để nhận thông báo sớm nhất về ngày ra mắt.</p>

            <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className={styles.submitBtn}>
                Đăng ký ngay
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
            <button className={styles.primaryBtn} style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }} onClick={addToCart}>
              Mua Ngay <ArrowRight size={18} style={{ display: 'inline', marginLeft: '8px', verticalAlign: 'middle' }} />
            </button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <h3>Aura Watch</h3>
              <p>Công nghệ đột phá, thiết kế vượt thời gian.</p>
            </div>
            <div className={styles.footerLinks}>
              <div className={styles.linkGroup}>
                <h4>Sản phẩm</h4>
                <ul>
                  <li><a href="#">Aura Watch Pro</a></li>
                  <li><a href="#">Aura Watch SE</a></li>
                </ul>
              </div>
              <div className={styles.linkGroup}>
                <h4>Hỗ trợ</h4>
                <ul>
                  <li><a href="#">FAQ</a></li>
                  <li><a href="#">Bảo hành</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© 2026 Aura Inc. Bảo lưu mọi quyền.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </footer>

        {/* Chatbot Widget */}
        <button className={styles.chatbotBtn} onClick={() => setIsChatOpen(!isChatOpen)} aria-label="Mở Chatbot">
          <MessageSquare size={24} />
        </button>

        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              className={styles.chatWindow}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.chatHeader}>
                <span>Hỗ trợ trực tuyến</span>
                <button className={styles.chatClose} onClick={() => setIsChatOpen(false)}>×</button>
              </div>
              <div className={styles.chatBody}>
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`${styles.message} ${msg.role === 'bot' ? styles.bot : styles.user}`}>
                    {msg.text}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form className={styles.chatInputContainer} onSubmit={handleSendMessage}>
                <input
                  type="text"
                  className={styles.chatInput}
                  placeholder="Nhập tin nhắn..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className={styles.chatSend}>
                  <Send size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drawers */}
        <AnimatePresence>
          {(isCartOpen || isWishlistOpen) && (
            <motion.div
              className={styles.drawerOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsCartOpen(false); setIsWishlistOpen(false); }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCartOpen && (
            <motion.div
              className={styles.drawer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className={styles.drawerHeader}>
                <h3>Giỏ hàng</h3>
                <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)} aria-label="Đóng giỏ hàng">×</button>
              </div>
              <div className={styles.drawerBody}>
                {cartCount === 0 ? (
                  <div className={styles.emptyState}>Giỏ hàng của bạn đang trống.</div>
                ) : (
                  <>
                    {Array.from({ length: cartCount }).map((_, i) => (
                      <div key={i} className={styles.cartItem}>
                        <Image src="/hero.png" alt="Aura Watch" width={70} height={70} />
                        <div className={styles.cartItemInfo}>
                          <h4>Aura Watch</h4>
                          <p>Titanium - 45mm</p>
                          <button className={styles.removeBtn} onClick={() => setCartCount(c => c - 1)}>Xoá</button>
                        </div>
                        <div style={{ fontWeight: 600 }}>$499</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
              {cartCount > 0 && (
                <div className={styles.drawerFooter}>
                  <div className={styles.totalRow}>
                    <span>Tổng cộng:</span>
                    <span>${cartCount * 499}</span>
                  </div>
                  <button className={styles.checkoutBtn} onClick={() => { toast.success("Đang chuyển đến thanh toán..."); setIsCartOpen(false); }}>Thanh toán</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isWishlistOpen && (
            <motion.div
              className={styles.drawer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className={styles.drawerHeader}>
                <h3>Yêu thích</h3>
                <button className={styles.closeBtn} onClick={() => setIsWishlistOpen(false)} aria-label="Đóng danh sách yêu thích">×</button>
              </div>
              <div className={styles.drawerBody}>
                {wishlistCount === 0 ? (
                  <div className={styles.emptyState}>Chưa có sản phẩm yêu thích.</div>
                ) : (
                  <>
                    {Array.from({ length: wishlistCount }).map((_, i) => (
                      <div key={i} className={styles.cartItem}>
                        <Image src="/hero.png" alt="Aura Watch" width={70} height={70} />
                        <div className={styles.cartItemInfo}>
                          <h4>Aura Watch</h4>
                          <p>Titanium - 45mm</p>
                          <button className={styles.removeBtn} onClick={() => setWishlistCount(c => c - 1)}>Bỏ thích</button>
                        </div>
                        <button
                          className={styles.primaryBtn}
                          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                          onClick={() => {
                            setWishlistCount(c => c - 1);
                            addToCart();
                          }}
                        >Thêm</button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </LazyMotion>
  );
}
