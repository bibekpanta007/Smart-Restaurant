import { createContext, useContext, useState, useEffect } from 'react';
import { getMenuItems } from '../data/menuData';

const MenuContext = createContext();

// Chicken Alfredo is the special by default (matches the AI dataset)
const DEFAULT_SPECIAL_ID = 5;

export function MenuProvider({ children }) {
  // start with the saved menu, or the default items from menuData.js
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('menuItems');
    return saved ? JSON.parse(saved) : getMenuItems();
  });

  // id of the item the admin picked as today's special
  const [specialId, setSpecialId] = useState(() => {
    const saved = localStorage.getItem('specialId');
    return saved ? Number(saved) : DEFAULT_SPECIAL_ID;
  });

  useEffect(() => {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('specialId', String(specialId));
  }, [specialId]);

  // the full special item (null if it was deleted)
  const special = menuItems.find((item) => item.id === specialId) || null;

  function addMenuItem(item) {
    setMenuItems((prev) => [...prev, { ...item, id: Date.now() }]);
  }

  function updateMenuItem(id, updatedItem) {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
    );
  }

  function deleteMenuItem(id) {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  }

  function toggleAvailability(id) {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
  }

  function setSpecial(id) {
    setSpecialId(id);
  }

  // go back to the default menu and special
  function resetMenu() {
    setMenuItems(getMenuItems());
    setSpecialId(DEFAULT_SPECIAL_ID);
  }

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        special,
        specialId,
        setSpecial,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleAvailability,
        resetMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}