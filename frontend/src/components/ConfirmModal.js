import React from 'react';
import { Modal,Button} from 'react-bootstrap';


const ConfirmModal = ({ show, onHide, updateDb }) => {
  
  const handleAccept = () => {
    onHide(false);
    updateDb(true);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update the database
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Are you sure?</h5>
        <p></p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          No
        </Button>

        <Button variant="primary" onClick={handleAccept}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal