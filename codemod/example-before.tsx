// Example: Before running the codemod
import React from 'react';
import { Card, CardBody, Button } from '@patternfly/react-core';

function ExampleComponent() {
  return (
    <Card isClickable>
      <CardBody>
        I'm a card
        <Button variant="danger" onClick={() => console.log('Delete')}>
          Cancel
        </Button>
      </CardBody>
    </Card>
  );
}

export default ExampleComponent;

