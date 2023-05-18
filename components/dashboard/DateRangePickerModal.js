import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Button as BsButton,
  Modal as BsModal,
} from 'react-bootstrap';
import DateRangePicker from './DateRangePicker';
import Tooltip from '@ui-library/Tooltip';
import { IoIosCloseCircleOutline as CloseIcon } from 'react-icons/io';

export default function DateRangePickerModal({ 
  show, 
  onHide, 
  onChange,  // to get date range when done is clicked
  onDismiss, // called when modal dismissed
  ...props
}) {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'range',
  });

  return (
    <Modal
      className='bs'
      show={show}
      onHide={onHide}
      size='lg'
      centered
      {...props}
    >
      <Modal.Body>
        <Tooltip text='Close' placement='left'>
          <CloseButton onClick={() => {
            onHide()
            if(typeof onDismiss === 'function')
              onDismiss()
          }}>
            <CloseIcon size={24} color='#969C9D' />
          </CloseButton>
        </Tooltip>

        <DateRangePicker
          value={[dateRange]}
          onChange={data => setDateRange(data.range)} 
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => {
          onChange(dateRange)
          onHide()
        }}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const Modal = styled(BsModal)`
&&& {
  .modal-content {
    /* background: none;
    border: none; */
    width: fit-content;
    margin: auto;
    overflow: auto;
  }
  .modal-body {
    padding: 0;
    margin: 0 auto;
  }
}
`

const Button = styled(BsButton)`
&&&{
  color: white;
  float: right;
  margin-bottom: .25rem;
  /* padding: 0; */
}
`

const CloseButton = styled.button`
&&& {
  background: transparent;
  border: none;
  /* display: inline-block; */
  /* position: absolute; */
  /* right: 12px; */
  /* top: 16px; */
  padding: .25rem;
  float: right;
}
`
