# Skillbuilder-frontend (Next.js)

Skill Builder React Frontend

## NOTE for Styles/CSS

### 1. Use bs class prefix for Bootstrap styles

- Add bs class to parent elements for bootstrap styes
- Use bs class on Bootstrap's Modal/Popup/Overlays

```
  <Modal className="bs">
    ...
  </Modal>
```

### 2. Increasing specificity of styled-component

_When creating styled components that extend from react-bootstrap use `&&& { }` to increase specificity_

```
import { Button } from 'react-bootstrap';

const StyledButton = styled(Button)`
  &&& {
    /* your styles go here.  */
  }
`
```

## ../Path Mapping

| Alias            | Path            |
| ---------------- | --------------- |
| @styles/\*       | styles/\*       |
| @public/\*       | public/\*       |
| @components/\*   | components/\*   |
| @ui-library/\*   | ui-library/\*   |
| @layouts/\*      | layouts/\*      |
| @contexts/\*     | contexts/\*     |
| @utils/\*        | utils/\*        |
| @services/\*     | services/\*     |
| @transformers/\* | transformers/\* |
| @hooks/\*        | hooks/\*        |

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Production server:

```bash
npm install
npm run build
# then
npm start
```
