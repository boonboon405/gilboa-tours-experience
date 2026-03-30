import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateFormField, setTourDate, setIsSubmitting, resetBookingForm } from "@/store/slices/bookingSlice";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const bookingSchema = z.object({
  customer_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(9).max(20),
  company_name: z.string().max(100).optional(),
  num_participants: z.string().min(1),
  tour_duration: z.string().min(1),
  preferred_language: z.string().min(1),
  special_requests: z.string().max(1000).optional(),
});

export const BookingForm = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const language = useAppSelector(getLanguage);
  const isHe = language === 'he';
  const formData = useAppSelector((state) => state.booking.formData);
  const tourDate = useAppSelector((state) => state.booking.tourDate);
  const isSubmitting = useAppSelector((state) => state.booking.isSubmitting);
  const tourType = useAppSelector((state) => state.tour.tourType) || "general";
  const preselectedDestinations = useAppSelector((state) => state.tour.preselectedDestinations) || [];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    dispatch(updateFormField({ field, value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tourDate) {
      toast({
        title: isHe ? "שגיאה" : "Error",
        description: isHe ? "נא לבחור תאריך לסיור" : "Please select a tour date",
        variant: "destructive",
      });
      return;
    }

    try {
      const validatedData = bookingSchema.parse(formData);
      dispatch(setIsSubmitting(true));

      const bookingData = {
        tour_type: tourType,
        tour_date: format(tourDate, "yyyy-MM-dd"),
        participants_count: parseInt(validatedData.num_participants),
        tour_duration: validatedData.tour_duration,
        preferred_language: validatedData.preferred_language,
        customer_name: validatedData.customer_name,
        customer_email: validatedData.email,
        customer_phone: validatedData.phone,
        customer_company: validatedData.company_name || null,
        special_requests: validatedData.special_requests || null,
        selected_destinations: preselectedDestinations.length > 0 ? preselectedDestinations : null,
        status: "pending",
      };

      const { data, error } = await supabase.from("bookings").insert([bookingData]).select();

      if (error) throw error;

      if (data && data[0]) {
        try {
          await supabase.functions.invoke('send-booking-notification', {
            body: { booking: data[0] }
          });
        } catch (emailError) {
          console.error('Error sending notification email:', emailError);
        }
      }

      toast({
        title: isHe ? "ההזמנה נשלחה בהצלחה!" : "Booking submitted successfully!",
        description: isHe ? "נציג יצור איתך קשר בהקדם" : "A representative will contact you soon",
      });

      dispatch(resetBookingForm());
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: isHe ? "שגיאת אימות" : "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        console.error("Error submitting booking:", error);
        toast({
          title: isHe ? "שגיאה" : "Error",
          description: isHe ? "אירעה שגיאה בשליחת ההזמנה. נסו שוב." : "An error occurred while submitting. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      dispatch(setIsSubmitting(false));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-lg">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">{isHe ? 'הזמנת סיור' : 'Book a Tour'}</h2>
        <p className="text-muted-foreground">{isHe ? 'מלאו את הפרטים ונציג יצור איתכם קשר' : 'Fill in your details and a representative will contact you'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer_name">{isHe ? 'שם מלא' : 'Full Name'} *</Label>
          <Input
            id="customer_name"
            value={formData.customer_name}
            onChange={(e) => handleInputChange("customer_name", e.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{isHe ? 'אימייל' : 'Email'} *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
            maxLength={255}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{isHe ? 'טלפון' : 'Phone'} *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            required
            maxLength={20}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_name">{isHe ? 'חברה (אופציונלי)' : 'Company (optional)'}</Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) => handleInputChange("company_name", e.target.value)}
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="num_participants">{isHe ? 'מספר משתתפים' : 'Number of Participants'} *</Label>
          <Input
            id="num_participants"
            type="number"
            min="1"
            max="100"
            value={formData.num_participants}
            onChange={(e) => handleInputChange("num_participants", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tour_date">{isHe ? 'תאריך הסיור' : 'Tour Date'} *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-right font-normal"
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                {tourDate ? format(tourDate, "dd/MM/yyyy") : (isHe ? "בחרו תאריך" : "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={tourDate}
                onSelect={(date) => dispatch(setTourDate(date))}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tour_duration">{isHe ? 'משך הסיור' : 'Tour Duration'} *</Label>
          <Select value={formData.tour_duration} onValueChange={(value) => handleInputChange("tour_duration", value)}>
            <SelectTrigger>
              <SelectValue placeholder={isHe ? "בחרו משך" : "Select duration"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="half-day">{isHe ? 'חצי יום (4 שעות)' : 'Half Day (4 hours)'}</SelectItem>
              <SelectItem value="full-day">{isHe ? 'יום מלא (8 שעות)' : 'Full Day (8 hours)'}</SelectItem>
              <SelectItem value="2-days">{isHe ? 'יומיים' : '2 Days'}</SelectItem>
              <SelectItem value="3-days">{isHe ? '3 ימים' : '3 Days'}</SelectItem>
              <SelectItem value="custom">{isHe ? 'מותאם אישית' : 'Custom'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferred_language">{isHe ? 'שפה מועדפת' : 'Preferred Language'} *</Label>
          <Select value={formData.preferred_language} onValueChange={(value) => handleInputChange("preferred_language", value)}>
            <SelectTrigger>
              <SelectValue placeholder={isHe ? "בחרו שפה" : "Select language"} />
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
        <Label htmlFor="special_requests">{isHe ? 'בקשות מיוחדות (אופציונלי)' : 'Special Requests (optional)'}</Label>
        <Textarea
          id="special_requests"
          value={formData.special_requests}
          onChange={(e) => handleInputChange("special_requests", e.target.value)}
          placeholder={isHe ? "מה ברצונכם לחוות, לראות, לצפות בסיור?" : "What would you like to experience, see, or explore on the tour?"}
          maxLength={1000}
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? (
          <>
            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
            {isHe ? 'שולח...' : 'Submitting...'}
          </>
        ) : (
          isHe ? 'שלחו הזמנה' : 'Submit Booking'
        )}
      </Button>
    </form>
  );
};
