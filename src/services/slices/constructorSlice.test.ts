import reducer, {
  addIngredient,
  removeIngredient,
  clearConstructor
} from './constructorSlice';

describe('constructorSlice reducer', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockIngredient = {
    _id: '2',
    name: 'Мясная котлета',
    type: 'main',
    proteins: 20,
    fat: 20,
    carbohydrates: 20,
    calories: 200,
    price: 200,
    image: '',
    image_mobile: '',
    image_large: '',
    id: ''
  };

  test('should return initial state', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  test('should handle addIngredient', () => {
    const state = reducer(initialState, addIngredient(mockIngredient));

    expect(state.ingredients).toHaveLength(1);

    expect(state.ingredients[0]).toEqual({
      ...mockIngredient,
      id: expect.any(String)
    });
  });

  test('should handle removeIngredient', () => {
    const initialStateWithItem = {
      ...initialState,
      ingredients: [{ ...mockIngredient, id: 'test-unique-id' }]
    };

    const state = reducer(
      initialStateWithItem,
      removeIngredient('test-unique-id')
    );
    expect(state.ingredients).toHaveLength(0);
  });

  test('should handle clearConstructor', () => {
    const initialStateWithData = {
      bun: { ...mockIngredient, type: 'bun', id: 'bun-id' },
      ingredients: [{ ...mockIngredient, id: 'main-id' }]
    };

    const state = reducer(initialStateWithData, clearConstructor());
    expect(state).toEqual(initialState);
  });
});
