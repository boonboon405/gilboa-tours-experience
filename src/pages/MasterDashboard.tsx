import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, TrendingUp, Mail, Star, CheckCircle, Clock, AlertCircle, Send } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardMetrics {
  activeLeads: number;
  totalLeads: number;
  conversionRate: number;
  totalBookings: number;
  pendingTestimonials: number;
  approvedTestimonials: number;
  emailsSentToday: number;
  emailsPending: number;
  emailsFailed: number;
  avgResponseTime: number;
}

interface LeadsBySource {
  source: string;
  count: number;
}

interface ConversionFunnel {
  stage: string;
  count: number;
  percentage: number;
}

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

const MasterDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [leadsBySource, setLeadsBySource] = useState<LeadsBySource[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [realtimeCount, setRealtimeCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up realtime subscription for leads
    const channel = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads'
        },
        () => {
          setRealtimeCount(prev => prev + 1);
          fetchDashboardData();
        }
      )
      .subscribe();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Fetch all data in parallel
      const [
        leadsRes,
        bookingsRes,
        testimonialsRes,
        emailQueueRes,
      ] = await Promise.all([
        supabase.from('leads').select('*'),
        supabase.from('bookings').select('*'),
        supabase.from('testimonials').select('*'),
        supabase.from('email_queue').select('*'),
      ]);

      if (leadsRes.error) throw leadsRes.error;
      if (bookingsRes.error) throw bookingsRes.error;
      if (testimonialsRes.error) throw testimonialsRes.error;
      if (emailQueueRes.error) throw emailQueueRes.error;

      const leads = leadsRes.data || [];
      const bookings = bookingsRes.data || [];
      const testimonials = testimonialsRes.data || [];
      const emailQueue = emailQueueRes.data || [];

      // Calculate metrics
      const activeLeads = leads.filter(l => l.contact_status === 'new' || l.contact_status === 'contacted').length;
      const totalLeads = leads.length;
      const totalBookings = bookings.length;
      const conversionRate = totalLeads > 0 ? (totalBookings / totalLeads) * 100 : 0;

      const pendingTestimonials = testimonials.filter(t => t.status === 'pending').length;
      const approvedTestimonials = testimonials.filter(t => t.status === 'approved').length;

      const emailsSentToday = emailQueue.filter(e => 
        e.status === 'sent' && new Date(e.sent_at) >= todayStart
      ).length;
      const emailsPending = emailQueue.filter(e => e.status === 'pending').length;
      const emailsFailed = emailQueue.filter(e => e.status === 'failed').length;

      // Calculate average response time (mock for now)
      const avgResponseTime = 2.5; // hours

      setMetrics({
        activeLeads,
        totalLeads,
        conversionRate,
        totalBookings,
        pendingTestimonials,
        approvedTestimonials,
        emailsSentToday,
        emailsPending,
        emailsFailed,
        avgResponseTime,
      });

      // Leads by source
      const sourceCounts: Record<string, number> = {};
      leads.forEach(lead => {
        const source = lead.source_platform || 'other';
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      });
      setLeadsBySource(
        Object.entries(sourceCounts).map(([source, count]) => ({ source, count }))
      );

      // Conversion funnel
      const funnel: ConversionFunnel[] = [
        { stage: 'לידים', count: totalLeads, percentage: 100 },
        { stage: 'יצרו קשר', count: leads.filter(l => l.contact_status !== 'new').length, percentage: 0 },
        { stage: 'הזמנות', count: totalBookings, percentage: 0 },
        { stage: 'אושרו', count: bookings.filter(b => b.status === 'confirmed').length, percentage: 0 },
      ];
      funnel.forEach((stage, idx) => {
        stage.percentage = totalLeads > 0 ? (stage.count / totalLeads) * 100 : 0;
      });
      setConversionFunnel(funnel);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">לוח בקרה מרכזי</h1>
                <p className="text-muted-foreground">מדדים בזמן אמת ואנליטיקס מקיפה</p>
              </div>
              {realtimeCount > 0 && (
                <Badge variant="outline" className="animate-pulse">
                  🔴 Live - {realtimeCount} עדכונים
                </Badge>
              )}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">לידים פעילים</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics?.activeLeads}</div>
                  <p className="text-xs text-muted-foreground">מתוך {metrics?.totalLeads} סך הכל</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">שיעור המרה</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics?.conversionRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">{metrics?.totalBookings} הזמנות</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">אימיילים היום</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics?.emailsSentToday}</div>
                  <p className="text-xs text-muted-foreground">
                    {metrics?.emailsPending} ממתינים | {metrics?.emailsFailed} נכשלו
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">המלצות</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics?.approvedTestimonials}</div>
                  <p className="text-xs text-muted-foreground">
                    {metrics?.pendingTestimonials} ממתינות לאישור
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">זמן תגובה ממוצע</CardTitle>
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{metrics?.avgResponseTime}h</div>
                  <p className="text-sm text-muted-foreground mt-2">ממוצע זמן תגובה ללידים</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">סטטוס אימיילים</CardTitle>
                    <Send className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">נשלחו</span>
                      </div>
                      <span className="font-bold">{metrics?.emailsSentToday}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">ממתינים</span>
                      </div>
                      <span className="font-bold">{metrics?.emailsPending}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm">נכשלו</span>
                      </div>
                      <span className="font-bold">{metrics?.emailsFailed}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">המלצות לקוחות</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">מאושרות</span>
                      <Badge variant="default">{metrics?.approvedTestimonials}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ממתינות</span>
                      <Badge variant="secondary">{metrics?.pendingTestimonials}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="funnel" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                <TabsTrigger value="funnel">משפך המרה</TabsTrigger>
                <TabsTrigger value="sources">מקורות לידים</TabsTrigger>
              </TabsList>

              <TabsContent value="funnel">
                <Card>
                  <CardHeader>
                    <CardTitle>משפך המרה</CardTitle>
                    <CardDescription>מעקב אחר מסע הלקוח</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={conversionFunnel} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="stage" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#667eea" name="כמות" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sources">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>לידים לפי מקור</CardTitle>
                      <CardDescription>התפלגות מקורות הלידים</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={leadsBySource}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.source}: ${entry.count}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {leadsBySource.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>ביצועים לפי מקור</CardTitle>
                      <CardDescription>כמות לידים</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={leadsBySource}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="source" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#764ba2" name="לידים" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MasterDashboard;
