import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TourState {
  tourType?: string;
  preselectedDestinations?: string[];
}

const initialState: TourState = {
  tourType: undefined,
  preselectedDestinations: undefined
};

const tourSlice = createSlice({
  name: 'tour',
  initialState,
  reducers: {
    setTourType: (state, action: PayloadAction<string | undefined>) => {
      state.tourType = action.payload;
    },
    setPreselectedDestinations: (state, action: PayloadAction<string[] | undefined>) => {
      state.preselectedDestinations = action.payload;
    },
    resetTourPreferences: (state) => {
      state.tourType = undefined;
      state.preselectedDestinations = undefined;
    }
  }
});

export const { setTourType, setPreselectedDestinations, resetTourPreferences } = tourSlice.actions;

export default tourSlice.reducer;
