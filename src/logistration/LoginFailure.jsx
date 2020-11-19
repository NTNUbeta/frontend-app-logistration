import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { Alert } from '@edx/paragon';
import { processLink } from '../data/utils/dataUtils';
import Link from '../common/Link';

const LoginFailureMessage = (props) => {
  const errorMessage = props.errors;
  let errorList = errorMessage.trim().split('\n');
  errorList = errorList.map((error) => {
    let matches;
    if (error.includes('a href')) {
      matches = processLink(error);
      const [beforeLink, link, linkText, afterLink] = matches;
      return (
        <li key={error}>
          <Link // eslint-disable-line  jsx-a11y/anchor-is-valid
            beforeLink={beforeLink}
            link={link}
            linkText={linkText}
            afterLink={afterLink}
          />
        </li>
      );
    }
    return <li key={error}>{error}</li>;
  });

  return (
    <Alert variant="danger">
      <div>
        <h4 style={{ color: '#a0050e' }}>
          <FormattedMessage
            id="logistration.login.failure.header.title"
            defaultMessage="We couldn't sign you in."
            description="login failure header message."
          />
        </h4>
        <ul>{errorList}</ul>
      </div>
    </Alert>
  );
};

LoginFailureMessage.defaultProps = {
  errors: '',
};
LoginFailureMessage.propTypes = {
  errors: PropTypes.string,
};

export default LoginFailureMessage;
