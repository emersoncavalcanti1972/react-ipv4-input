import React, { useEffect, useId, useRef, useState } from 'react';

import './styles.scss';

function IPV4Input({
  value,
  defaulValue,
  isWrong = (value) => false,
  onChange,
  ...rest
}) {
  const defaultOctets = ['', '', '', ''];
  const [octets, setOctets] = useState(defaultOctets);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const id = useId();

  const stringToArray = (str) => {
    const octets = str.split('.');
    return octets.map((octet) => octet.trim());
  };

  const buildAddress = (arrayOfOctets) => {
    return arrayOfOctets.map(octect => isNaN(octect)
        ? ''
        : String(octect)
      )
      .join('.')
    ;
  };

  useEffect(() => {
    const newOctets = [...defaultOctets];
    const { defaultValue } = rest;

    if (value) {
      const newValues = typeof value === 'string' ? stringToArray(value) : value;
      newValues.forEach((val, index) => {
        if (index < 4) {
          newOctets[index] = String(val);
        }
      });
    } else if (defaultValue) {
      const newValues = typeof defaultValue === 'string' ? stringToArray(defaultValue) : defaultValue;
      newValues.forEach((val, index) => {
        if (index < 4) {
          newOctets[index] = String(val);
        }
      });
    }

    setOctets(newOctets);
  }, [value]);

  useEffect(() => {
    if (onChange) {
      onChange(buildAddress(octets));
    }
  }, [octets, onChange]);

  const isValidOctet = (octetValue) => {
    octetValue = parseInt(octetValue);

    return !isNaN(octetValue) && octetValue >= 0 && octetValue <= 255;
  }

  const setCursorAtStart = (octetIndex) => {
    inputRefs[octetIndex].current.setSelectionRange(0, 0);
    inputRefs[octetIndex].current.selectionStart = 0;
  }

  const setCursorAtEnd = (octetIndex) => {
    const octetSize = inputRefs[octetIndex].current.value.length;
    inputRefs[octetIndex].current.setSelectionRange(octetSize, octetSize);
    inputRefs[octetIndex].current.selectionStart = octetSize;
  }

  const focusOnNextOctet = (octetIndex) => {
    const nextOctetIndex = octetIndex + 1;
    inputRefs[nextOctetIndex].current.focus();
    setCursorAtStart(nextOctetIndex);
  }

  const handleChange = (event, octetIndex) => {
    if (isNaN(event.target.value)) {
      return event.preventDefault();
    }

    const octetValueStr = event.target.value;
    let octetValue = parseInt(octetValueStr);

    if (octetValueStr !== '' && !isValidOctet(octetValue)) {
      octetValue = 255;
    }

    const newOctets = [...octets];
    newOctets[octetIndex] = String(octetValue);
    setOctets(newOctets);

    if (!isNaN(octetValueStr) && String(octetValueStr).length === 3 && octetIndex < 3) {
      // Colocamos o foco no próximo octeto
      focusOnNextOctet(octetIndex);
    }
  };

  function getInputSelection(input) {
    const begin = input.selectionStart;
    const end = input.selectionEnd;
    const value = input.value.substring(begin, end);

    return { begin, end, value };
  }

  const handleKeyDown = (event, octetIndex) => {
    let nextOctetIndex = octetIndex;
    let goStart = false;
    let goEnd = false;

    if ( (event.code === 'ArrowLeft' || event.code === 'Backspace')
         && getInputSelection(event.target).end === 0
         && octetIndex > 0 ) {
      event.preventDefault();
      nextOctetIndex = octetIndex - 1;
      goEnd = true;
    }

    if ( event.code === 'ArrowRight'
         && getInputSelection(event.target).end === event.target.value.length
         && octetIndex < 3) {
      event.preventDefault();
      nextOctetIndex = octetIndex + 1;
      goStart = true;
    }
    if (event.code === 'NumpadDecimal' || event.code === 'Period' || event.code === 'NumpadComma') {
      event.preventDefault();

      if (octetIndex < 3) {
        nextOctetIndex = octetIndex + 1;
        goStart = true;
      }
    }
    if (event.code === 'Home') {
      nextOctetIndex = 0;
    }
    if (event.code === 'End') {
      nextOctetIndex = 3;
    }

    inputRefs[nextOctetIndex].current.focus();
    if (goStart) {
      setCursorAtStart(nextOctetIndex);
    }
    if (goEnd) {
      setCursorAtEnd(nextOctetIndex);
    }
  };

  const handlePaste = (event, octetIndex) => {
    event.preventDefault();

    const paste = (event.clipboardData || window.clipboardData).getData('text/plain');

    if (paste) {
      console.debug('paste', paste);
      const newOctets = [...octets];
      const pasteOctets = stringToArray(paste);

      let currentOctetIndex = octetIndex;
      pasteOctets.forEach((octet, index) => {
        if (currentOctetIndex < 4) {
          newOctets[currentOctetIndex] = octet;
        }
        currentOctetIndex++;
      });

      setOctets(newOctets);

      // Deslocamos o cursor para o final do último octeto colado
      currentOctetIndex--;
      inputRefs[currentOctetIndex].current.focus();
      setCursorAtEnd(currentOctetIndex);
    }
  };

  const className = [
    'react-ipv4-input',
    rest.className,
    isWrong(buildAddress(octets)) ? 'has-error' : ''
  ].join(' ');

  return (
    <div className={className} {...rest} >
      {octets.map((octet, index) =>
      <div className="react-ipv4-input__item" key={index}>
        <input
          key={`${id}-${index}`}
          ref={inputRefs[index]}
          type="text"
          value={isNaN(octet) ? '' : octet}
          onChange={(event) => handleChange(event, index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onPaste={(event) => handlePaste(event, index)}
          disabled={false}
        />
        {index !== 3 ? <i>.</i> : false}
      </div>
      )}
      <input type="hidden" name={rest.name} value={buildAddress(octets)} />
    </div>
  );
}

export default IPV4Input;
