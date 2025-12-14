import { createFeature, Feature } from '../../../src/domain/models/Feature';

describe('Feature domain model', () => {
  it('should create a Feature with default id and empty scenarios', () => {
    const feature = createFeature({
      title: 'Login',
      description: 'User login feature',
      tags: ['auth'],
      scenarios: [],
    });
    expect(feature.id).toMatch(/^feature-/);
    expect(feature.title).toBe('Login');
    expect(feature.description).toBe('User login feature');
    expect(feature.tags).toEqual(['auth']);
    expect(feature.scenarios).toEqual([]);
  });

  it('should create a Feature with provided id and scenarios', () => {
    const feature = createFeature({
      id: 'feature-123',
      title: 'Reset Password',
      scenarios: [
        {
          id: 'scenario-1',
          title: 'User requests reset',
          steps: [
            { keyword: 'Given', text: 'the user is on the reset page' },
            { keyword: 'When', text: 'the user submits their email' },
            { keyword: 'Then', text: 'an OTP is sent' },
          ],
        },
      ],
    });
    expect(feature.id).toBe('feature-123');
    expect(feature.scenarios.length).toBe(1);
    expect(feature.scenarios[0].title).toBe('User requests reset');
    expect(feature.scenarios[0].steps[2].text).toBe('an OTP is sent');
  });
});