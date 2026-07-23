import reducer, {
  addIngredient,
  removeIngredient,
  clearConstructor,
  reorderIngredients
} from './constructorSlice';

describe('constructorSlice reducer', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun = {
    _id: '1',
    name: 'Краторная булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: '',
    image_mobile: '',
    image_large: '',
    id: ''
  };

  const mockMain = {
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

  test('should handle addIngredient for a bun', () => {
    const state = reducer(initialState, addIngredient(mockBun));

    expect(state.bun).toEqual({
      ...mockBun,
      id: expect.any(String)
    });

    expect(state.ingredients).toHaveLength(0);
  });

  test('should handle addIngredient for a non-bun ingredient', () => {
    const state = reducer(initialState, addIngredient(mockMain));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({
      ...mockMain,
      id: expect.any(String)
    });
    expect(state.bun).toBeNull();
  });

  test('should handle removeIngredient', () => {
    const initialStateWithItem = {
      ...initialState,
      ingredients: [{ ...mockMain, id: 'test-unique-id' }]
    };

    const state = reducer(
      initialStateWithItem,
      removeIngredient('test-unique-id')
    );
    expect(state.ingredients).toHaveLength(0);
  });

  test('should handle moveIngredient', () => {
    const ingredient1 = { ...mockMain, id: 'id-1', name: 'Ингредиент 1' };
    const ingredient2 = { ...mockMain, id: 'id-2', name: 'Ингредиент 2' };

    const stateWithMultipleItems = {
      ...initialState,
      ingredients: [ingredient1, ingredient2]
    };

    const action = reorderIngredients({ from: 0, to: 1 });
    const state = reducer(stateWithMultipleItems, action);

    expect(state.ingredients[0]).toEqual(ingredient2);
    expect(state.ingredients[1]).toEqual(ingredient1);
  });

  test('should handle clearConstructor', () => {
    const initialStateWithData = {
      bun: { ...mockBun, id: 'bun-id' },
      ingredients: [{ ...mockMain, id: 'main-id' }]
    };

    const state = reducer(initialStateWithData, clearConstructor());
    expect(state).toEqual(initialState);
  });
});
