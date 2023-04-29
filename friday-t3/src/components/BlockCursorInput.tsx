import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const BlockCursorInput: React.FC = () => {
  const [input, setInput] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleFocus = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  useEffect(() => {
    handleFocus();
  }, []);

  return (
    <Wrapper onClick={handleFocus}>
      <Symbol>🔮</Symbol>
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={handleChange}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

const Textarea = styled.textarea`
  color: #fff;
  background-color: transparent;
  border: none;
  width: 100%;
  resize: none;
  text-indent: 3ch;

  &:focus-visible {
    outline: none;
  }
`;

const Symbol = styled.span`
  position: absolute;
  top: 1px;
  left: 0;
  color: #ff00d9;
`;

export default BlockCursorInput;
