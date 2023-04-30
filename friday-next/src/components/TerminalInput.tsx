import autosize from 'autosize';
import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const TerminalInput: React.FC = () => {
  const [input, setInput] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !(e.ctrlKey || e.metaKey || e.shiftKey)) {
      e.preventDefault();
      setInput('');
    }
  };

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
        onKeyDown={handleSubmit}
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
  text-indent: 3ch;
  display: block;

  &:focus-visible {
    outline: none;
  }
`;

const Symbol = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  color: #ff00d9;
`;

export default TerminalInput;
