import React from 'react'
import Custom404 from './Custom404';
import Custom401 from './Custom401';

export default function Error({ code = 404 }) {
  switch(code) {
    case 404: return <Custom404 />;
    case 401: return <Custom401 />;
  }
}
