import { createContext, useContext, useState, useEffect } from 'react';
import { getMenuItems } from '../data/menuData';

const MenuContext = createContext();

export function MenuProvider({ children }) {
  // start with the saved menu, or the default items from menuData.js
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('menuItems');
    return saved ? JSON.parse(saved) : getMenuItems();
  });

  useEffect(() => {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
  }, [menuItems]);

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

  // go back to the default menu from menuData.js
  function resetMenu() {
    setMenuItems(getMenuItems());
  }

  return (
    <MenuContext.Provider
      value={{ menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability, resetMenu }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}