import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom'
import AlertWrapper from "@ui-library/AlertWrapper";

export const SelectionMode = {
  PDF: "PDF",
  CSV: "CSV",
  PRINT: "PRINT",
  NONE: "NONE"
};

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const AppContextProvider = props => {
  const root = useRef(null);
  const [inSelectMode, setInSelectMode] = useState(false);
  const [selectionMode, setSelectionMode] = useState(SelectionMode.NONE);
  const [selection, setSelection] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [isDisabled,setIsDisabled] = useState(false);

  useEffect(() => {
    root.current = document.createElement('div');
    root.current.id = '__react-alert__';
    document.body.appendChild(root.current);
    return () => {
      if (root.current) document.body.removeChild(root.current)
    }
  }, []);

  const show = useCallback((template) => {
    const id = Math.random().toString(36).substr(2, 9);

    const alert = {
      id,
      template
    };

    alert.close = () => remove(alert);
    setAlerts(state => state.concat(alert));
    return alert
  }, []);

  const remove = useCallback(alert => {
    setAlerts(currentAlerts => currentAlerts.filter(a => a.id !== alert.id))
  }, []);

  const removeAll = useCallback(() => {
    setAlerts([]);
  }, []);

  const alert = useMemo(() => {
    return {
      show,
      removeAll,
    }
  }, []);

  return (
    <AppContext.Provider value={{
      selectionMode,
      setSelectionMode,
      inSelectMode,
      setInSelectMode,
      selection,
      setSelection,
      alert,
      setIsDisabled,
      isDisabled,
    }}>
      {props.children}
      {root.current && createPortal(<AlertWrapper>
        {alerts.map(alert => alert.template)}
      </AlertWrapper>, root.current)}
    </AppContext.Provider>
  )
};

export default AppContextProvider;
