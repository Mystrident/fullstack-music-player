import React from "react";
import "../../css/common/Modal.css";

const Modal = ({ children, onClose }) => {
  /*takes two props :- children : whatever jsx you put inside like login, signup etc , onClose : function passed from parent to close the modal, example here login is a children 
    <Modal onClose={closeModal}>
        <Login />
    </Modal>*/
  return (
    <div
      className="modal-backdrop"
      onClick={onClose} // if you click outside the modal content, it closes the modal
      role="dialog"
      aria-modal="true"

      //this is the dark overlay behind the modal
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} //https://www.youtube.com/watch?v=SqOmszXHJw8 a really good video to learn about event propagation
        style={{ postion: "relative" }}
      >
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          ⚔️
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
