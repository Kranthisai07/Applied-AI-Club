import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Initiatives from './components/Initiatives';
import Events from './components/Events';
import Members from './components/Members';
import Faculty from './components/Faculty';
import Resources from './components/Resources';
import JoinUs from './components/JoinUs';
import Footer from './components/Footer';
import ProjectsPage from './pages/ProjectsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import PNWResourcesPage from './pages/PNWResourcesPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/* ===== HOMEPAGE ===== */
function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Initiatives />
      <Events />
      <Members />
      <Faculty />
      <Resources />
      <JoinUs />
    </>
  );
}

/* ===== APP ===== */
function App() {
  return (
    <Router basename="/Applied-AI-Club">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/resources/pnw" element={<PNWResourcesPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
