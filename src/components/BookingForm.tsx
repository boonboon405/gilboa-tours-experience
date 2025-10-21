import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const bookingSchema = z.object({
  customer_name: z.string().trim().min(2, "השם חייב להכיל לפחות 2 תווים").max(100),
  customer_email: z.string().trim().email("כתובת אימייל לא תקינה").max(255),
  customer_phone: z.string().trim().min(9, "מספר טלפון לא תקין").max(20),
  customer_company: z.string().max(100).optional(),
  participants_count: z.number().min(1, "חייב להיות לפחות משתתף אחד").max(100),
  tour_duration: z.string().min(1, "נא לבחור משך סיור"),
  preferred_language: z.string().min(1, "נא לבחור שפה"),
  special_requests: z.string().max(1000).optional(),
});

interface BookingFormProps {
  tourType?: string;
  preselectedDestinations?: string[];
}

export const BookingForm = ({ tourType = "general", preselectedDestinations = [] }: BookingFormProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tourDate, setTourDate] = useState<Date>();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_company: "",
    participants_count: "",
    tour_duration: "",
    preferred_language: language,
    special_requests: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tourDate) {
      toast({
        title: "שגיאה",
        description: "נא לבחור תאריך לסיור",
        variant: "destructive",
      });
      return;
    }

    try {
      const validatedData = bookingSchema.parse({
        ...formData,
        participants_count: parseInt(formData.participants_count),
      });

      setIsSubmitting(true);

      const bookingData = {
        tour_type: tourType,
        tour_date: format(tourDate, "yyyy-MM-dd"),
        participants_count: validatedData.participants_count,
        tour_duration: validatedData.tour_duration,
        preferred_language: validatedData.preferred_language,
        customer_name: validatedData.customer_name,
        customer_email: validatedData.customer_email,
        customer_phone: validatedData.customer_phone,
        customer_company: validatedData.customer_company || null,
        special_requests: validatedData.special_requests || null,
        selected_destinations: preselectedDestinations.length > 0 ? preselectedDestinations : null,
        status: "pending",
      };

      const { data, error } = await supabase.from("bookings").insert([bookingData]).select();

      if (error) throw error;

      // Send notification email in the background
      if (data && data[0]) {
        try {
          await supabase.functions.invoke('send-booking-notification', {
            body: { booking: data[0] }
          });
        } catch (emailError) {
          console.error('Error sending notification email:', emailError);
          // Don't fail the booking if email fails
        }
      }

      toast({
        title: "ההזמנה נשלחה בהצלחה!",
        description: "נציג יצור איתך קשר בהקדם",
      });

      // Reset form
      setFormData({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        customer_company: "",
        participants_count: "",
        tour_duration: "",
        preferred_language: language,
        special_requests: "",
      });
      setTourDate(undefined);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "שגיאת אימות",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        console.error("Error submitting booking:", error);
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה בשליחת ההזמנה. נסה שוב.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-lg">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">הזמנת סיור</h2>
        <p className="text-muted-foreground">מלא את הפרטים ונציג יצור איתך קשר</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer_name">שם מלא *</Label>
          <Input
            id="customer_name"
            value={formData.customer_name}
            onChange={(e) => handleInputChange("customer_name", e.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer_email">אימייל *</Label>
          <Input
            id="customer_email"
            type="email"
            value={formData.customer_email}
            onChange={(e) => handleInputChange("customer_email", e.target.value)}
            required
            maxLength={255}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer_phone">טלפון *</Label>
          <Input
            id="customer_phone"
            type="tel"
            value={formData.customer_phone}
            onChange={(e) => handleInputChange("customer_phone", e.target.value)}
            required
            maxLength={20}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer_company">חברה (אופציונלי)</Label>
          <Input
            id="customer_company"
            value={formData.customer_company}
            onChange={(e) => handleInputChange("customer_company", e.target.value)}
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="participants_count">מספר משתתפים *</Label>
          <Input
            id="participants_count"
            type="number"
            min="1"
            max="100"
            value={formData.participants_count}
            onChange={(e) => handleInputChange("participants_count", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tour_date">תאריך הסיור *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-right font-normal"
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                {tourDate ? format(tourDate, "dd/MM/yyyy") : "בחר תאריך"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={tourDate}
                onSelect={setTourDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tour_duration">משך הסיור *</Label>
          <Select value={formData.tour_duration} onValueChange={(value) => handleInputChange("tour_duration", value)}>
            <SelectTrigger>
              <SelectValue placeholder="בחר משך" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="half-day">חצי יום (4 שעות)</SelectItem>
              <SelectItem value="full-day">יום מלא (8 שעות)</SelectItem>
              <SelectItem value="2-days">יומיים</SelectItem>
              <SelectItem value="3-days">3 ימים</SelectItem>
              <SelectItem value="custom">מותאם אישית</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferred_language">שפה מועדפת *</Label>
          <Select value={formData.preferred_language} onValueChange={(value) => handleInputChange("preferred_language", value)}>
            <SelectTrigger>
              <SelectValue placeholder="בחר שפה" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="he">עברית</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ru">Русский</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="special_requests">בקשות מיוחדות (אופציונלי)</Label>
        <Textarea
          id="special_requests"
          value={formData.special_requests}
          onChange={(e) => handleInputChange("special_requests", e.target.value)}
          placeholder="מה ברצונכם לחוות, לראות, לצפות בסיור?"
          maxLength={1000}
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "שולח..." : "שלח הזמנה"}
      </Button>
    </form>
  );
};
