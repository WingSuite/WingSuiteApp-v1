// pages/index.js
import { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#__next') // replace '#root' with '#__next' for Next.js

export default function HomePage() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <button
        onClick={openModal}
        className="px-4 py-2 text-black bg-blue-500 rounded"
      >
        Open Modal
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="m-auto border-0 outline-none max-w-lg w-full"
        overlayClassName="flex items-center justify-center bg-black bg-opacity-50 fixed inset-0"
      >
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-2xl mb-4">Hello!</h2>
          <p className="mb-4">This is a simple modal example for Next.js with Tailwind CSS!</p>
          <button
            onClick={closeModal}
            className="px-4 py-2 text-black bg-blue-500 rounded"
          >
            Close Modal
          </button>
        </div>
      </Modal>
    </div>
  );
}