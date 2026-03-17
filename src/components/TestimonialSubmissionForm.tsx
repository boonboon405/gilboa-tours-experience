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

const testimonialSchema = z.object({
  customer_name: z.string().min(2).max(100),
  customer_email: z.string().email().optional().or(z.literal("")),
  customer_company: z.string().max(100).optional(),
  testimonial_text: z.string().min(10).max(1000),
  tour_type: z.string().optional(),
  rating: z.number().min(1).max(5),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

export const TestimonialSubmissionForm = () => {
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { rating: 5 }
  });

  const onSubmit = async (data: TestimonialFormData) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from('testimonials').insert([{
        customer_name: data.customer_name,
        customer_email: data.customer_email || null,
        customer_company: data.customer_company || null,
        testimonial_text: data.testimonial_text,
        tour_type: data.tour_type || null,
        rating,
        status: 'pending'
      }]);
      if (error) throw error;
      toast({ title: t('testimonialForm.success'), description: t('testimonialForm.successDesc') });
      reset();
      setRating(5);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({ title: t('testimonialForm.error'), description: t('testimonialForm.errorDesc'), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{t('testimonialForm.title')}</CardTitle>
        <CardDescription>{t('testimonialForm.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="customer_name">{t('testimonialForm.name')}</Label>
            <Input id="customer_name" {...register("customer_name")} placeholder={t('testimonialForm.namePlaceholder')} />
            {errors.customer_name && <p className="text-sm text-destructive">{errors.customer_name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer_email">{t('testimonialForm.email')}</Label>
            <Input id="customer_email" type="email" {...register("customer_email")} placeholder="email@example.com" />
            {errors.customer_email && <p className="text-sm text-destructive">{errors.customer_email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer_company">{t('testimonialForm.company')}</Label>
            <Input id="customer_company" {...register("customer_company")} placeholder={t('testimonialForm.companyPlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tour_type">{t('testimonialForm.tourType')}</Label>
            <Input id="tour_type" {...register("tour_type")} placeholder={t('testimonialForm.tourTypePlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label>{t('testimonialForm.rating')}</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                  <Star className={`h-8 w-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="testimonial_text">{t('testimonialForm.testimonial')}</Label>
            <Textarea id="testimonial_text" {...register("testimonial_text")} placeholder={t('testimonialForm.testimonialPlaceholder')} rows={6} className="resize-none" />
            {errors.testimonial_text && <p className="text-sm text-destructive">{errors.testimonial_text.message}</p>}
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? t('testimonialForm.submitting') : t('testimonialForm.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
