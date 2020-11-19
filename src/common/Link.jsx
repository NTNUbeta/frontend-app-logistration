import React from 'react';
import { Hyperlink } from '@edx/paragon';

const Link = (args) => (
  <>
    {args.beforeLink}
    <Hyperlink destination={args.link}>
      {args.linkText}
    </Hyperlink>
    {args.afterLink}
  </>
);

export default Link;
