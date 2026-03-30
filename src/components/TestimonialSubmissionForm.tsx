import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const getSchema = (isHe: boolean) => z.object({
  customer_name: z.string().min(2, isHe ? "שם חייב להכיל לפחות 2 תווים" : "Name must be at least 2 characters").max(100),
  customer_email: z.string().email(isHe ? "כתובת אימייל לא תקינה" : "Invalid email address").optional().or(z.literal("")),
  customer_company: z.string().max(100).optional(),
  testimonial_text: z.string().min(10, isHe ? "המלצה חייבת להכיל לפחות 10 תווים" : "Testimonial must be at least 10 characters").max(1000),
  tour_type: z.string().optional(),
  rating: z.number().min(1).max(5),
});

type TestimonialFormData = z.infer<ReturnType<typeof getSchema>>;

export const TestimonialSubmissionForm = () => {
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const isHe = language === 'he';

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TestimonialFormData>({
    resolver: zodResolver(getSchema(isHe)),
    defaultValues: {
      rating: 5,
    }
  });

  const onSubmit = async (data: TestimonialFormData) => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('testimonials')
        .insert([{
          customer_name: data.customer_name,
          customer_email: data.customer_email || null,
          customer_company: data.customer_company || null,
          testimonial_text: data.testimonial_text,
          tour_type: data.tour_type || null,
          rating,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: isHe ? "תודה רבה!" : "Thank you!",
        description: isHe ? "ההמלצה נשלחה בהצלחה ותתפרסם לאחר אישור." : "Your testimonial was submitted successfully and will be published after approval.",
      });

      reset();
      setRating(5);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: isHe ? "שגיאה" : "Error",
        description: isHe ? "אירעה שגיאה בשליחת ההמלצה. אנא נסה שוב." : "An error occurred while submitting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{isHe ? 'שתף את החוויה שלך' : 'Share Your Experience'}</CardTitle>
        <CardDescription>{isHe ? 'נשמח לשמוע על הטיול שלך איתנו' : "We'd love to hear about your tour with us"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="customer_name">{isHe ? 'שם מלא *' : 'Full Name *'}</Label>
            <Input
              id="customer_name"
              {...register("customer_name")}
              placeholder={isHe ? "שם מלא" : "Full name"}
            />
            {errors.customer_name && (
              <p className="text-sm text-destructive">{errors.customer_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_email">{isHe ? 'אימייל' : 'Email'}</Label>
            <Input
              id="customer_email"
              type="email"
              {...register("customer_email")}
              placeholder="email@example.com"
            />
            {errors.customer_email && (
              <p className="text-sm text-destructive">{errors.customer_email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_company">{isHe ? 'חברה' : 'Company'}</Label>
            <Input
              id="customer_company"
              {...register("customer_company")}
              placeholder={isHe ? "שם החברה" : "Company name"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tour_type">{isHe ? 'סוג הטיול' : 'Tour Type'}</Label>
            <Input
              id="tour_type"
              {...register("tour_type")}
              placeholder={isHe ? "לדוגמה: טיול גיבוש, VIP, ODT" : "e.g. Team Building, VIP, ODT"}
            />
          </div>

          <div className="space-y-2">
            <Label>{isHe ? 'דירוג *' : 'Rating *'}</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testimonial_text">{isHe ? 'המלצה *' : 'Testimonial *'}</Label>
            <Textarea
              id="testimonial_text"
              {...register("testimonial_text")}
              placeholder={isHe ? "ספר לנו על החוויה שלך..." : "Tell us about your experience..."}
              rows={6}
              className="resize-none"
            />
            {errors.testimonial_text && (
              <p className="text-sm text-destructive">{errors.testimonial_text.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full"
          >
            {submitting ? (isHe ? "שולח..." : "Submitting...") : (isHe ? "שלח המלצה" : "Submit Testimonial")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
