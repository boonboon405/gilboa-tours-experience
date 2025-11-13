import { Mail, Phone } from 'lucide-react';

export const Footer = () => {
  const email = 'davidisraeltours@gmail.com';
  const phoneNumber = '0537314235';

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
              דוד טורס
            </h3>
            <p className="text-muted-foreground">
              יום חווייתי, מהנה ומשמעותי שמשלב היסטוריה, טבע, גיבוש, והרבה זיכרונות טובים לחברה שלכם.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              צור קשר
            </h4>
            <div className="space-y-3">
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center space-x-2 space-x-reverse text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{phoneNumber}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center space-x-2 space-x-reverse text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              קישורים מהירים
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#choose-your-day" className="text-muted-foreground hover:text-primary transition-colors">
                  ביחרו את יום הכייף שלכם
                </a>
              </li>
              <li>
                <a href="#vip-tours" className="text-muted-foreground hover:text-primary transition-colors">
                  טיולי VIP
                </a>
              </li>
              <li>
                <a href="#odt" className="text-muted-foreground hover:text-primary transition-colors">
                  פעילויות גיבוש ODT
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                  צור קשר
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>© 2025 דוד טורס. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
};
