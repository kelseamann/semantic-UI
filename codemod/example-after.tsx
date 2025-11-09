// Example: After running the codemod
// This is what the output should look like
import React from 'react';
import { Card, CardBody, Button } from '@patternfly/react-core';

function ExampleComponent() {
  return (
    <Card 
      isClickable
      data-role="card"
      data-purpose="clickable"
      data-variant="default"
      data-context="default"
      data-state="active"
    >
      <CardBody
        data-role="card-body"
        data-purpose="display"
        data-variant="default"
        data-context="default"
        data-state="default"
      >
        I'm a card
        <Button 
          variant="danger" 
          onClick={() => console.log('Delete')}
          data-role="button"
          data-purpose="action"
          data-variant="danger"
          data-context="default"
          data-state="active"
        >
          Cancel
        </Button>
      </CardBody>
    </Card>
  );
}

export default ExampleComponent;

// Rendered HTML in browser will look like:
// <div class="pf-c-card" data-role="card" data-purpose="clickable" ...>
//   <div class="pf-c-card__body" data-role="card-body" data-purpose="display" ...>
//     I'm a card
//     <button class="pf-c-button pf-m-danger" data-role="button" data-purpose="action" data-variant="danger" ...>
//       Cancel
//     </button>
//   </div>
// </div>

