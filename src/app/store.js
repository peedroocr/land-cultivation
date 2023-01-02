import { configureStore } from '@reduxjs/toolkit';

import markersReducer from '../features/markers/markersSlice';

export const store = configureStore({
    reducer: {
        markers: markersReducer,
    }
})