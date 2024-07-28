import React from 'react';
import { createRoot } from 'react-dom/client';
import './options.scss';

const block = (
  <div>
    <p>Hello World</p>
    <p>React</p>
    <p>Options Page</p>
  </div>
);

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(block);
