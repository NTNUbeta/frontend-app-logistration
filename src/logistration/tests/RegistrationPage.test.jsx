import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { IntlProvider, injectIntl, configure } from '@edx/frontend-platform/i18n';

import RegistrationPage from '../RegistrationPage';

const IntlRegistrationPage = injectIntl(RegistrationPage);
const mockStore = configureStore();


describe('./RegistrationPage.js', () => {
  const initialState = {
    logistration: {
      registrationResult: { success: false, redirectUrl: '' },
    },
  };

  let props = {};
  let store = {};

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <Provider store={store}>{children}</Provider>
    </IntlProvider>
  );

  beforeEach(() => {
    store = mockStore(initialState);
    configure({
      loggingService: { logError: jest.fn() },
      config: {
        ENVIRONMENT: 'production',
        LANGUAGE_PREFERENCE_COOKIE_NAME: 'yum',
      },
      messages: {
        'es-419': {},
        de: {},
        'en-us': {},
      },
    });
    props = {
      registrationResult: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match default section snapshot', () => {
    const tree = renderer.create(reduxWrapper(<IntlRegistrationPage {...props} />));
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should match url after redirection', () => {
    const dasboardUrl = 'http://test.com/testing-dashboard/';
    store = mockStore({
      ...store,
      logistration: {
        ...store.logistration,
        registrationResult: {
          success: true,
          redirectUrl: dasboardUrl,
        },
        formData: {
          fields: [{
            label: 'I agree to the Your Platform Name Here <a href="/honor" rel="noopener" target="_blank">Honor Code</a>',
            name: 'honor_code',
            type: 'checkbox',
            errorMessages: {
              required: 'You must agree to the Your Platform Name Here Honor Code',
            },
          },
          {
            label: 'Gender',
            name: 'gender',
            type: 'select',
            errorMessages: {
              required: '',
            },
          },
          {
            label: 'Mailing address',
            name: 'mailing_address',
            type: 'textarea',
            errorMessages: {
              required: 'Enter your mailing address.',
            },
          }],
        },
      },
    });
    delete window.location;
    window.location = { href: '' };
    renderer.create(reduxWrapper(<IntlRegistrationPage />));
    expect(window.location.href).toBe(dasboardUrl);
  });

  it('should show error message on 409', () => {
    const windowSpy = jest.spyOn(global, 'window', 'get');
    windowSpy.mockImplementation(() => ({
      scrollTo: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    store = mockStore({
      ...store,
      logistration: {
        ...store.logistration,
        registrationResult: {
          success: false,
          redirectUrl: '',
        },
        registrationError: {
          email: [
            {
              user_message: 'It looks like test@gmail.com belongs to an existing account. Try again with a different email address.',
            },
          ],
          username: [
            {
              user_message: 'It looks like test belongs to an existing account. Try again with a different username.',
            },
          ],
        },
      },
    });

    const tree = renderer.create(reduxWrapper(<IntlRegistrationPage {...props} />)).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
