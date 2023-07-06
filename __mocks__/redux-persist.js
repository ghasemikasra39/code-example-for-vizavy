export const persistStore = jest.fn()
export const persistReducer = jest.fn().mockImplementation((config, reducers) => reducers)
