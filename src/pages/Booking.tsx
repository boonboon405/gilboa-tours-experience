import { BookingForm } from "@/components/BookingForm";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Booking = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <BookingForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
