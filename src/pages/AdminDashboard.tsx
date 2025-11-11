import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, MessageSquare, Key, Database, Users, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminTools = [
    {
      title: "מאגר ידע",
      description: "ניהול שאלות ותשובות עבור צ'אט AI",
      icon: Database,
      path: "/admin/knowledge",
      color: "text-blue-500"
    },
    {
      title: "מילות מפתח",
      description: "ניהול מילות מפתח SEO",
      icon: Key,
      path: "/admin/keywords",
      color: "text-green-500"
    },
    {
      title: "צ'אט מנהל",
      description: "ניהול שיחות עם לקוחות",
      icon: MessageSquare,
      path: "/admin/chat",
      color: "text-purple-500"
    },
    {
      title: "ניהול לידים",
      description: "צפייה וניהול לידים",
      icon: Users,
      path: "/leads",
      color: "text-orange-500"
    },
    {
      title: "אנליטיקס צ'אט",
      description: "סטטיסטיקות ודוחות",
      icon: BarChart,
      path: "/chat-analytics",
      color: "text-pink-500"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4">לוח בקרה - מנהל</h1>
              <p className="text-muted-foreground text-lg">
                ניהול מערכת הבקאנד והתוכן של האתר
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminTools.map((tool) => (
                <Card 
                  key={tool.path}
                  className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50"
                  onClick={() => navigate(tool.path)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-muted ${tool.color}`}>
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      פתח
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  גישה לבקאנד
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  דרך לוח הבקרה תוכל לנהל את כל המערכת כולל:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mr-4">
                  <li>מסד נתונים ו-RLS policies</li>
                  <li>Edge Functions לתקשורת עם APIs חיצוניים</li>
                  <li>אחסון קבצים ותמונות</li>
                  <li>מערכת האימות והמשתמשים</li>
                  <li>לוגים ומעקב אחר ביצועים</li>
                </ul>
                <Button 
                  onClick={() => window.open('https://docs.lovable.dev/features/backend', '_blank')}
                  variant="outline"
                  className="w-full mt-4"
                >
                  מדריך Lovable Cloud
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
