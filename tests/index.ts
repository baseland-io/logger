import assert from 'assert';

function sum(num1, num2) {
  return num1 + num2;
}

describe('Demo test', () => {
  it('adds 1 + 2 to equal 3', () => {
    const value = sum(1, 2);
    assert.equal(value, 3);
  });
});
