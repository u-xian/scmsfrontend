import { createSlice } from "@reduxjs/toolkit";

let lastId = 0;
const initialState = {
  dealer: [],
  cards: [],
};
const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    dealerAdded: (cart, action) => {
      const { dealerItem } = action.payload;
      cart.dealer.push(dealerItem);
    },
    denomAdded: (cart, action) => {
      const { denomItem } = action.payload;
      cart.cards.push({ denom: denomItem });
    },
    cardsAdded: (cart, action) => {
      const { cardsItems } = action.payload;
      //const item = cart.cards.find((d) => d.denom.id === denomItemID);
      //const item = cart.dealer.find((d) => d.id === dealerID);
      //item.cardsItems = cardsItems;
      cardsItems.id = ++lastId;
      cart.cards.push(cardsItems);
    },
    cardRemoved: (cart, action) => {
      const { cardID } = action.payload;
      cart.cards = cart.cards.filter((c) => c.id !== cardID);
    },
    cartCleared: (cart, action) => {
      cart.dealer = initialState.dealer;
      cart.cards = initialState.cards;
    },
  },
});

//Actions
export const {
  dealerAdded,
  denomAdded,
  cardsAdded,
  cardRemoved,
  cartCleared,
} = slice.actions;

//Reducer
export default slice.reducer;
