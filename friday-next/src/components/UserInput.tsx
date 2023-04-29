import React, { forwardRef, type ForwardedRef, type ForwardRefRenderFunction } from 'react';

const UserInput: ForwardRefRenderFunction<HTMLInputElement> = (props, ref: ForwardedRef<HTMLInputElement>) => {
  return (
    <div>
      🔮 $
      {' '}<input ref={ref} className="focus-visible:outline-none bg-transparent border-none" type="text" />
    </div>
  );
};

export default forwardRef<HTMLInputElement>(UserInput);