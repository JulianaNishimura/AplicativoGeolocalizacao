import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Walk {
  id: string;
  distance: number;
  date: string;
  route: { latitude: number; longitude: number }[];
}

export interface PinnedLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface WalksState {
  history: Walk[];
  pinnedLocations: PinnedLocation[];
  destination: PinnedLocation | null;
}

const initialState: WalksState = {
  history: [],
  pinnedLocations: [],
  destination: null,
};

const walksSlice = createSlice({
  name: "walks",
  initialState,
  reducers: {
    addWalk: (state, action: PayloadAction<Walk>) => {
      state.history.push(action.payload);
    },
    addPin: (state, action: PayloadAction<PinnedLocation>) => {
      state.pinnedLocations.push(action.payload);
    },
    removePin: (state, action: PayloadAction<string>) => {
      state.pinnedLocations = state.pinnedLocations.filter(
        (pin) => pin.id !== action.payload,
      );
    },
    setDestination: (state, action: PayloadAction<PinnedLocation | null>) => {
      state.destination = action.payload;
    },
  },
});

export const { addWalk, addPin, removePin, setDestination } =
  walksSlice.actions;
export default walksSlice.reducer;
