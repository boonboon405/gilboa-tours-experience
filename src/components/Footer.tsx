import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="py-12 bg-foreground text-primary-foreground/70">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="text-xl font-bold text-primary-foreground">Simcha</Link>
          <div className="flex items-center gap-6 text-sm">
            <a href="#home" className="hover:text-primary-foreground transition-colors">בית</a>
            <a href="#services" className="hover:text-primary-foreground transition-colors">שירותים</a>
            <a href="#faq" className="hover:text-primary-foreground transition-colors">שאלות נפוצות</a>
            <a href="#contact" className="hover:text-primary-foreground transition-colors">צור קשר</a>
          </div>
          <p className="text-xs text-primary-foreground/50">© {new Date().getFullYear()} Simcha. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
};
