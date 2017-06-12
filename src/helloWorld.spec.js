import { arrowFunction } from './es6'
import React from 'react'
import HelloWorld from '@shared/components/HelloWorld/'
import renderer from 'react-test-renderer';

it('first test', () => {
  expect(true, true)
})

it('second test with es6 syntax', () => {
  expect('arrowFunction', arrowFunction())
})

it('third test with @shared alias', () => {
  const component = renderer.create(
    <HelloWorld />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})