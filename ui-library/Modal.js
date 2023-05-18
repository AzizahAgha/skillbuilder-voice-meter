import BsModal from 'react-bootstrap/Modal';
import styled from 'styled-components';

const Modal = styled(BsModal)`
&&&{
  .modal-content {
    background: rgb(255, 255, 255) none repeat scroll 0% 0%;
    border: 1px solid rgb(129, 194, 192);
    box-sizing: border-box;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 5px;
  }
  .modal-header {
    border: none;
    padding-bottom: 0;
    position: relative;
  }
  .modal-title {
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 500;
  }
  .btn-close {
    border: .5px solid #353535;
    border-radius: 50%;
    font-size: 10px;
    padding: 0.35rem;
    position: absolute;
    top: 1.5rem;
    right: 1.2rem;
  }
  .modal-body {
    font-family: Manrope;
    font-size: 14px;
    letter-spacing: 0.02em;
  }
}
`

export default Modal;
