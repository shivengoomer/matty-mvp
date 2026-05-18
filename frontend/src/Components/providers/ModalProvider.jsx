/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { X } from "lucide-react";

const ModalContext = createContext({
  openModal: () => {},
  closeModal: () => {},
});

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);

  const closeModal = useCallback(() => setModal(null), []);

  const openModal = useCallback((payload) => {
    setModal(payload);
  }, []);

  const value = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modal ? (
        <div
          className="fixed inset-0 z-[120] grid place-items-center bg-black/35 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-hard)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{modal.title}</h2>
                {modal.description ? (
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{modal.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl p-1 text-[var(--text-secondary)] transition hover:bg-[var(--surface-subtle)]"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <div>{typeof modal.content === "function" ? modal.content({ closeModal }) : modal.content}</div>
          </div>
        </div>
      ) : null}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
