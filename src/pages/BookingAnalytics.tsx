import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Calendar, Users, TrendingUp, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BookingStats {
  totalBookings: number;
  totalParticipants: number;
  pendingBookings: number;
  confirmedBookings: number;
  byTourType: { name: string; value: number }[];
  byMonth: { month: string; bookings: number; participants: number }[];
  avgParticipants: number;
}

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

const BookingAnalytics = () => {
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate stats
      const totalBookings = bookings?.length || 0;
      const totalParticipants = bookings?.reduce((sum, b) => sum + (b.participants_count || 0), 0) || 0;
      const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
      const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;

      // By tour type
      const tourTypeCounts: Record<string, number> = {};
      bookings?.forEach(b => {
        tourTypeCounts[b.tour_type] = (tourTypeCounts[b.tour_type] || 0) + 1;
      });
      const byTourType = Object.entries(tourTypeCounts).map(([name, value]) => ({ name, value }));

      // By month
      const monthCounts: Record<string, { bookings: number; participants: number }> = {};
      bookings?.forEach(b => {
        const month = new Date(b.created_at).toLocaleDateString('he-IL', { month: 'short', year: 'numeric' });
        if (!monthCounts[month]) {
          monthCounts[month] = { bookings: 0, participants: 0 };
        }
        monthCounts[month].bookings++;
        monthCounts[month].participants += b.participants_count || 0;
      });
      const byMonth = Object.entries(monthCounts).map(([month, data]) => ({ month, ...data }));

      const avgParticipants = totalBookings > 0 ? Math.round(totalParticipants / totalBookings) : 0;

      setStats({
        totalBookings,
        totalParticipants,
        pendingBookings,
        confirmedBookings,
        byTourType,
        byMonth,
        avgParticipants,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
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
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">אנליטיקת הזמנות</h1>
              <p className="text-muted-foreground">נתונים וסטטיסטיקות על ההזמנות שלך</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">סך הכל הזמנות</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">כל ההזמנות במערכת</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">סך משתתפים</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalParticipants}</div>
                  <p className="text-xs text-muted-foreground">ממוצע {stats?.avgParticipants} למסלול</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ממתינות לאישור</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.pendingBookings}</div>
                  <p className="text-xs text-muted-foreground">טעון טיפול</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">הזמנות מאושרות</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.confirmedBookings}</div>
                  <p className="text-xs text-muted-foreground">ממסך ההזמנות</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="types" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                <TabsTrigger value="types">לפי סוג טיול</TabsTrigger>
                <TabsTrigger value="trends">מגמות</TabsTrigger>
              </TabsList>

              <TabsContent value="types" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>הזמנות לפי סוג טיול</CardTitle>
                      <CardDescription>התפלגות ההזמנות לפי קטגוריות</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats?.byTourType}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#667eea" name="הזמנות" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>פילוח לפי סוג</CardTitle>
                      <CardDescription>אחוזי ההזמנות</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={stats?.byTourType}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => entry.name}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {stats?.byTourType.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>מגמות לאורך זמן</CardTitle>
                    <CardDescription>הזמנות ומשתתפים לפי חודש</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={stats?.byMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="bookings" stroke="#667eea" name="הזמנות" strokeWidth={2} />
                        <Line type="monotone" dataKey="participants" stroke="#764ba2" name="משתתפים" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingAnalytics;
