import { useState } from 'react';
import Modal from 'react-modal';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#__next');

export default function Home() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  return (
    <div className="p-4">
      <button
        onClick={openModal}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Open Modal
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="m-auto mt-64 p-4 border-0 outline-none rounded-xl w-3/4 md:w-1/2 lg:w-1/3 bg-white z-50"
        overlayClassName="fixed top-0 left-0 w-full h-full bg-gray-600 bg-opacity-75 flex items-start justify-center z-40"
      >
        <h2 className="text-2xl mb-4">Hello World</h2>
        <p>Modal Content...</p>
        <button
          onClick={closeModal}
          className="mt-4 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Close Modal
        </button>
      </Modal>
    </div>
  );
}