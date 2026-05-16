import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Emptied out, using index.css

const useTypewriter = (text, speed = 100, delay = 1000) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout;
    if (isTyping && displayedText.length < text.length) {
      timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
    } else if (isTyping && displayedText.length === text.length) {
      setIsTyping(false);
      timeout = setTimeout(() => {
        setIsTyping(true);
        setDisplayedText('');
      }, delay);
    }
    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, text, speed, delay]);

  return displayedText;
};

const MagneticButton = ({ children, className, href }) => {
  const btnRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.3;
    const y = (e.clientY - top - height / 2) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div 
      className="magnetic-btn-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      <a href={href} className={`btn ${className}`} ref={btnRef}>
        {children}
      </a>
    </div>
  );
};

const GlassCard = ({ children, className = '' }) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s ease',
  });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    // Calculate glare position
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'none',
    });
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease',
    });
  };

  return (
    <div
      ref={cardRef}
      className={`glass-card ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="glossy-reflection" 
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`
        }}
      />
      {children}
    </div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo">DEEPA.</div>
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#journey">Journey</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
};

const Section = ({ id, children }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (id === 'home') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [id]);

  const sectionStyle = id === 'home' ? {} : {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
    transition: 'all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1)'
  };

  return (
    <section id={id} ref={sectionRef} style={sectionStyle}>
      {children}
    </section>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const updateHoverState = (e) => {
      const isClickable = e.target.tagName.toLowerCase() === 'a' || 
                          e.target.tagName.toLowerCase() === 'button' || 
                          e.target.closest('.glass-card') || 
                          e.target.closest('.tag') ||
                          e.target.closest('.btn');
      setIsHovering(isClickable);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', updateHoverState);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHoverState);
    };
  }, []);

  return (
    <>
      <div className={`custom-cursor-dot ${isHovering ? 'hovering' : ''}`} style={{ left: `${position.x}px`, top: `${position.y}px` }}></div>
      <div className={`custom-cursor ${isHovering ? 'hovering' : ''}`} style={{ left: `${position.x}px`, top: `${position.y}px` }}></div>
    </>
  );
};

function App() {
  const typedTitle = useTypewriter('Aspiring Software Engineer & Full Stack Developer', 70, 3000);

  return (
    <>
      <CustomCursor />
      
      {/* Aurora Background */}
      <div className="aurora-bg">
        <div className="noise-overlay"></div>
        <div className="aurora-orb orb-1"></div>
        <div className="aurora-orb orb-2"></div>
        <div className="aurora-orb orb-3"></div>
      </div>

      <Navbar />

      <main>
        {/* Hero Section */}
        <Section id="home">
          <div className="hero">
            <div className="hero-content">
              <p className="greeting">Hello, I am</p>
              <h1 className="name">Deepa D J</h1>
              <h2 className="title">
                {typedTitle}
                <span className="cursor-blink"></span>
              </h2>
              <p className="summary">
                Aspiring to contribute to innovative projects with a balance of creativity and problem-solving, 
                while continuously learning new technologies.
              </p>
              <div className="hero-buttons">
                <MagneticButton href="#projects" className="primary-btn">
                  View My Work
                </MagneticButton>
              </div>
            </div>
            <div className="hero-image-container">
              <div className="hero-shape"></div>
            </div>
          </div>
        </Section>

        {/* About & Education Section */}
        <Section id="about">
          <div className="about">
            <h2 className="section-title">About Me</h2>
            <div className="about-grid">
              <GlassCard className="about-text">
                <p>
                  Hi, my name is Deepa D J! I am growing into a well-rounded professional who adds value to both the team and the organization.
                </p>
                <div className="education">
                  <h3><i className="fas fa-graduation-cap"></i> Education</h3>
                  <div className="edu-item">
                    <h4>B.E. - Computer Science and Engineering</h4>
                    <p className="institution">P E S College of Engineering, Mandya</p>
                    <span className="badge">Expected Graduation: 2027</span>
                    <span className="badge highlight">CGPA: 8.8/10</span>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard className="info-list">
                <ul>
                  <li><span className="label">Location</span> Turuvekere, Tumkur - 572227</li>
                  <li><span className="label">Email</span> deepagowdadj14@gmail.com</li>
                  <li><span className="label">Phone</span> +91 9036532728</li>
                </ul>
              </GlassCard>
            </div>
          </div>
        </Section>

        {/* Services Section */}
        <Section id="services">
          <div className="services">
            <h2 className="section-title">What I Do</h2>
            <div className="services-grid">
              <GlassCard className="service-card">
                <div className="service-icon">💻</div>
                <h3>Frontend Development</h3>
                <p>Building responsive, interactive, and beautifully designed user interfaces using HTML, CSS, JavaScript, and React.</p>
              </GlassCard>
              <GlassCard className="service-card">
                <div className="service-icon">⚙️</div>
                <h3>Backend Integration</h3>
                <p>Developing robust server-side logic and database schemas using Node.js, Express, and SQL databases.</p>
              </GlassCard>
              <GlassCard className="service-card">
                <div className="service-icon">🤖</div>
                <h3>Machine Learning</h3>
                <p>Creating predictive models and applying data science techniques using Python and Scikit-Learn.</p>
              </GlassCard>
            </div>
          </div>
        </Section>

        {/* Journey Timeline Section */}
        <Section id="journey">
          <div className="journey">
            <h2 className="section-title">My Journey</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-date">2023 - Present</span>
                  <h3>B.E. Computer Science</h3>
                  <p>Pursuing my Bachelor's degree at P.E.S College of Engineering, maintaining an excellent 8.8 CGPA.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-date">2024</span>
                  <h3>Full Stack Projects</h3>
                  <p>Developed multiple applications including a Resume Analyzer and Real Estate platforms, mastering the MERN stack.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-date">2025</span>
                  <h3>Data Science Exploration</h3>
                  <p>Built a Cancer Cell Prediction model using Random Forest and Python, expanding into AI/ML concepts.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-date">Future</span>
                  <h3>Continuous Growth</h3>
                  <p>Looking forward to internships and full-time opportunities to apply my skills to real-world software engineering challenges.</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Tech Stack Marquee */}
        <div className="marquee-wrapper">
          <div className="marquee-content">
            <span className="marquee-item">REACT</span>
            <span className="marquee-item">NODE.JS</span>
            <span className="marquee-item">PYTHON</span>
            <span className="marquee-item">MONGODB</span>
            <span className="marquee-item">EXPRESS</span>
            <span className="marquee-item">JAVA</span>
            <span className="marquee-item">C++</span>
            <span className="marquee-item">SQL</span>
            {/* Duplicate for infinite loop effect */}
            <span className="marquee-item">REACT</span>
            <span className="marquee-item">NODE.JS</span>
            <span className="marquee-item">PYTHON</span>
            <span className="marquee-item">MONGODB</span>
            <span className="marquee-item">EXPRESS</span>
            <span className="marquee-item">JAVA</span>
            <span className="marquee-item">C++</span>
            <span className="marquee-item">SQL</span>
          </div>
        </div>

        {/* Skills Section */}
        <Section id="skills">
          <div className="skills">
            <h2 className="section-title">My Skills</h2>
            <div className="skills-container">
              <GlassCard className="skill-category">
                <h3>Programming</h3>
                <div className="tags">
                  <span className="tag">C</span>
                  <span className="tag">C++</span>
                  <span className="tag">Java</span>
                  <span className="tag">SQL</span>
                </div>
              </GlassCard>
              <GlassCard className="skill-category">
                <h3>Web Technologies</h3>
                <div className="tags">
                  <span className="tag">HTML</span>
                  <span className="tag">CSS</span>
                  <span className="tag">JavaScript</span>
                  <span className="tag">MERN Stack</span>
                </div>
              </GlassCard>
              <GlassCard className="skill-category">
                <h3>Tools & Core</h3>
                <div className="tags">
                  <span className="tag">Tinkercad</span>
                  <span className="tag">Excel</span>
                  <span className="tag">Canva</span>
                  <span className="tag">DSA</span>
                </div>
              </GlassCard>
            </div>
          </div>
        </Section>

        {/* Projects Section */}
        <Section id="projects">
          <div className="projects">
            <h2 className="section-title">Featured Projects</h2>
            <div className="projects-grid">
              {/* Project 1 */}
              <GlassCard className="project-card">
                <div className="project-content">
                  <h3>Resume Analyzer</h3>
                  <p className="subtitle">Full Stack Web Application</p>
                  <p className="desc">
                    Developed a full-stack Resume Analyzer using the MERN stack. Implemented resume upload, skill extraction, job match analysis, and skill recommendation features.
                  </p>
                  <div className="project-tags">
                    <span>MongoDB</span><span>Express</span><span>React</span><span>Node.js</span>
                  </div>
                </div>
              </GlassCard>

              {/* Project 2 */}
              <GlassCard className="project-card">
                <div className="project-content">
                  <h3>RealEstatePro</h3>
                  <p className="subtitle">Real Estate Website</p>
                  <p className="desc">
                    Developed a responsive web platform for property listings and user interactions using HTML, CSS, and JavaScript. Implemented property search, filters, and interactive UI.
                  </p>
                  <div className="project-tags">
                    <span>HTML</span><span>CSS</span><span>JS</span>
                  </div>
                </div>
              </GlassCard>

              {/* Project 3 */}
              <GlassCard className="project-card">
                <div className="project-content">
                  <h3>Cancer Cell Prediction</h3>
                  <p className="subtitle">Machine Learning Project</p>
                  <p className="desc">
                    Built a cancer prediction model using Python and Machine Learning. Used data cleaning and Random Forest algorithm to predict cancer.
                  </p>
                  <div className="project-tags">
                    <span>Python</span><span>Machine Learning</span><span>Random Forest</span>
                  </div>
                </div>
              </GlassCard>

              {/* Project 4 */}
              <GlassCard className="project-card">
                <div className="project-content">
                  <h3>Student DBMS</h3>
                  <p className="subtitle">Management System</p>
                  <p className="desc">
                    Created a system using Java and SQL to manage student records, including registration, updating details, and generating reports.
                  </p>
                  <div className="project-tags">
                    <span>Java</span><span>SQL</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </Section>

        {/* Contact Section */}
        <Section id="contact">
          <div className="contact">
            <h2 className="section-title">Get In Touch</h2>
            <div className="contact-container">
              <div className="contact-info">
                <GlassCard style={{ height: '100%' }}>
                  <h3>Let's build something!</h3>
                  <p>Whether you have a question, a project idea, or just want to say hi, I'll try my best to get back to you!</p>
                  
                  <div className="info-list" style={{ marginTop: '2rem' }}>
                    <ul>
                      <li><span className="label">Email</span> deepagowdadj14@gmail.com</li>
                      <li><span className="label">Phone</span> +91 9036532728</li>
                      <li><span className="label">Location</span> Tumkur, Karnataka</li>
                    </ul>
                  </div>

                  <div className="social-links">
                    <a href="#" className="social-btn" title="GitHub">GH</a>
                    <a href="#" className="social-btn" title="LinkedIn">IN</a>
                    <a href="#" className="social-btn" title="Twitter">TW</a>
                  </div>
                </GlassCard>
              </div>

              <div className="contact-form">
                <GlassCard style={{ height: '100%' }}>
                  <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input type="text" id="name" className="glass-input" placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input type="email" id="email" className="glass-input" placeholder="john@example.com" />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="message">Message</label>
                      <textarea id="message" className="glass-input" placeholder="Your message here..." style={{ height: '100%' }}></textarea>
                    </div>
                    <button type="submit" className="btn primary-btn" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
                      Send Message
                    </button>
                  </form>
                </GlassCard>
              </div>
            </div>
          </div>
        </Section>

      </main>

      <footer>
        <p>&copy; 2026 Deepa D J. Designed with <span className="heart">♥</span></p>
      </footer>
    </>
  );
}

export default App;
