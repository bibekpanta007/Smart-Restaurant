import { createContext, useContext, useState, useEffect } from 'react';

const ReservationContext = createContext();

export function ReservationProvider({ children }) {
  // load saved reservations so they survive a page refresh
  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('reservations');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }, [reservations]);

  function addReservation(details) {
    const newReservation = {
      ...details,
      id: Date.now(),
      status: 'Pending', // admin will approve it later
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [newReservation, ...prev]);
    return newReservation;
  }

  // used by the admin (approve / cancel) and the customer (cancel)
  function updateReservationStatus(id, status) {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }

  function cancelReservation(id) {
    updateReservationStatus(id, 'Cancelled');
  }

  return (
    <ReservationContext.Provider
      value={{ reservations, addReservation, updateReservationStatus, cancelReservation }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  return useContext(ReservationContext);
}