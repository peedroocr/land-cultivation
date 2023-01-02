import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import axios from 'axios';

const POST_URL = 'http://162.19.66.62:3001/'

const initialState = {
    markers: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
};

export const fetchMarkers = createAsyncThunk('posts/fetchMarkers', async () => {
    const response = await axios.get(POST_URL + 'allMarkers');
    return response.data
});


export const updateOldPost = createAsyncThunk('posts/updatePost', async (updatedPost) => {
    await axios.post(POST_URL + 'updatePost', updatedPost)
    /*.then(res => {
    })*/
    return updatedPost;

});

const markersSlice = createSlice({
    name: 'markers',
    initialState,
    reducers: {
        updateMarker: {
            reducer(state, action) {
                const allMarkers = state.markers.map((marker) => {
                    if (marker.id !== action.payload.markerId) {
                        return marker
                    } else {

                        return {
                            ...marker,
                            information: {
                                email: action.payload.emailtLand,
                                name: action.payload.nameLand,
                                price: action.payload.priceLand,
                                hectares: action.payload.hectaresLand,
                                number: action.payload.numberLand,
                                type: action.payload.typeLand
                            }
                        }
                    }

                });

                state.markers = allMarkers;
            },
            preapre(marker) {
                console.log(marker);
                return {
                    payload: {
                        marker
                    }
                }
            }
        },
        markerShow: {
            reducer(state, action) {
                const editMarkers = current(state.markers).map((markers, index) => {
                    return markers.id === action.payload.id.id ? { ...markers, show: !markers.show } : markers;
                });
                state.markers = editMarkers
            },
            prepare(id) {
                return {
                    payload: { id }
                }
            }
        },
        removeShowAll: {
            reducer(state) {
                const editMarkers = current(state.markers).map((markers, index) => {
                    return { ...markers, show: false }
                });
                state.markers = editMarkers
            }

        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchMarkers.pending, (state, action) => {
                state.status = 'pending'
            })

            .addCase(fetchMarkers.fulfilled, (state, action) => {
                state.status = 'succeeded';

                let arrayMarkers = {}

                action.payload.data.map((position, index) => {
                    arrayMarkers[position.LAND_ID + position.NAME] = {};
                    arrayMarkers[position.LAND_ID + position.NAME].path = [];
                    arrayMarkers[position.LAND_ID + position.NAME].information = {};
                })

                action.payload.data.map((position, index) => {
                    arrayMarkers[position.LAND_ID + position.NAME].path.push({ lat: parseFloat(position.LAT), lng: parseFloat(position.LNG) })
                    arrayMarkers[position.LAND_ID + position.NAME].id = position.LAND_ID;
                    arrayMarkers[position.LAND_ID + position.NAME].information.email = position.EMAIL;
                    arrayMarkers[position.LAND_ID + position.NAME].information.name = position.NAME;
                    arrayMarkers[position.LAND_ID + position.NAME].information.price = position.PRICE;
                    arrayMarkers[position.LAND_ID + position.NAME].information.hectares = position.HECTARES;
                    arrayMarkers[position.LAND_ID + position.NAME].information.number = position.NUMBER;
                    arrayMarkers[position.LAND_ID + position.NAME].information.type = position.TYPE;
                    arrayMarkers[position.LAND_ID + position.NAME].userId = position.USER_ID;
                });

                let arrayMarkersAux = []
                for (let i in arrayMarkers) {
                    arrayMarkers[i].marker = arrayMarkers[i].path[0];
                    arrayMarkers[i].show = false;
                    arrayMarkersAux.push(arrayMarkers[i])
                }

                state.markers = arrayMarkersAux
            })

    }
});

export const selectAllMarkers = (state) => state.markers.markers;

export const { markerShow, removeShowAll, updateMarker } = markersSlice.actions;


export default markersSlice.reducer;