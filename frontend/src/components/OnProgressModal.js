import React from 'react';
import { Modal,Spinner,Button} from 'react-bootstrap';


const OnProgressModal = ({ show,message}) => {
    return (
      <Modal show={show} size="sm" backdrop="static" keyboard={false} centered>
        <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          <span>&nbsp;&nbsp;&nbsp;</span>
          {message}
        </Button>
      </Modal>
    );
  };

  export default OnProgressModal