import { createLocator, Locator } from '../../../src/domain/models/Locator';

describe('Locator domain model', () => {
  it('should create a Locator with default id', () => {
    const locator = createLocator({
      type: 'css',
      value: '.login-form',
    });
    expect(locator.id).toMatch(/^locator-/);
    expect(locator.type).toBe('css');
    expect(locator.value).toBe('.login-form');
    expect(locator.tags).toBeUndefined();
  });

  it('should create a Locator with provided id and tags', () => {
    const locator = createLocator({
      id: 'locator-123',
      type: 'xpath',
      value: '//button[@type="submit"]',
      tags: ['submit', 'button'],
    });
    expect(locator.id).toBe('locator-123');
    expect(locator.type).toBe('xpath');
    expect(locator.tags).toEqual(['submit', 'button']);
  });
});