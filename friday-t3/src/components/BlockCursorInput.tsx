import autosize from 'autosize';
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
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  return (
    <Wrapper onClick={handleFocus}>
      <Symbol>🔮</Symbol>
      <Textarea
        ref={textareaRef}
        rows={1}
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
  display: block;
  color: #fff;
  background-color: transparent;
  border: none;
  width: 100%;
  resize: none;
  text-indent: 1ch;
  display: block;

  &:focus-visible {
    outline: none;
  }
`;

const Symbol = styled.span`
  position: relative;
  top: 0;
  left: 0;
  color: #ff00d9;
`;

export default BlockCursorInput;