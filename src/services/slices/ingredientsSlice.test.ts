import reducer, { fetchIngredients } from './ingredientsSlice';

describe('ingredientsSlice reducer', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  const mockIngredients = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      price: 100,
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      image: '',
      image_mobile: '',
      image_large: ''
    }
  ];

  test('should return initial state', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  test('should handle fetchIngredients.pending', () => {
    const state = reducer(initialState, {
      type: fetchIngredients.pending.type
    });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('should handle fetchIngredients.fulfilled', () => {
    const state = reducer(initialState, {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  test('should handle fetchIngredients.rejected', () => {
    const state = reducer(initialState, {
      type: fetchIngredients.rejected.type,
      error: { message: 'Error' }
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Error');
  });
});
