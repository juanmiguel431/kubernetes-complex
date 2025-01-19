import { render } from 'vitest-browser-react'
import { expect, test, vi } from 'vitest';
import axios from 'axios';
import Fib from './components/Fib.tsx';
import { BrowserRouter } from 'react-router-dom';

const mockDataCurrent = { '5':'8' };
const mockDataAll = [{ 'number':5 }]

test('Print Other Page', async () => {
  const spy = vi.spyOn(axios, 'get');

  spy.mockImplementation((url) => {
    let data: any;
    if (url === '/api/values/current') {
      data = mockDataCurrent;
    } else if (url === '/api/values/all') {
      data = mockDataAll;
    }

    return Promise.resolve({ data: data });
  });

  const { getByText, container, getByRole } = render(
    <BrowserRouter>
      <Fib/>
    </BrowserRouter>
  );

  const element = getByText('Other Page');
  await expect.element(element).toBeInTheDocument()
});
