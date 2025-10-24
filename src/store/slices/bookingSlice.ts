import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BookingFormData {
  customer_name: string;
  email: string;
  phone: string;
  company_name: string;
  num_participants: string;
  tour_duration: string;
  preferred_language: string;
  special_requests: string;
}

interface BookingState {
  formData: BookingFormData;
  tourDate: Date | undefined;
  isSubmitting: boolean;
}

const initialState: BookingState = {
  formData: {
    customer_name: "",
    email: "",
    phone: "",
    company_name: "",
    num_participants: "",
    tour_duration: "",
    preferred_language: "",
    special_requests: "",
  },
  tourDate: undefined,
  isSubmitting: false
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    updateFormField: (state, action: PayloadAction<{ field: keyof BookingFormData; value: string }>) => {
      state.formData[action.payload.field] = action.payload.value;
    },
    setTourDate: (state, action: PayloadAction<Date | undefined>) => {
      state.tourDate = action.payload;
    },
    setIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    resetBookingForm: (state) => {
      state.formData = initialState.formData;
      state.tourDate = undefined;
      state.isSubmitting = false;
    }
  }
});

export const { updateFormField, setTourDate, setIsSubmitting, resetBookingForm } = bookingSlice.actions;

export default bookingSlice.reducer;
