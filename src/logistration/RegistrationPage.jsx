import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button, Input, ValidationFormGroup,
} from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

import camelCase from 'lodash.camelcase';
import { registerNewUser, fetchRegistrationForm } from './data/actions';
import { registrationRequestSelector } from './data/selectors';
import RedirectLogistration from './RedirectLogistration';
import RegistrationFailure from './RegistrationFailure';
import { processLink } from '../data/utils/dataUtils';
import Link from '../common/Link';


const REGISTRATION_VALIDITY_MAP = {};
const REGISTRATION_EXTRA_FIELDS = [
  'confirm_email',
  'level_of_education',
  'gender',
  'year_of_birth',
  'mailing_address',
  'goals',
  'honor_code',
  'terms_of_service',
  'city',
  'country',
];

class RegistrationPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      email: '',
      name: '',
      username: '',
      password: '',
      country: '',
      city: '',
      gender: '',
      yearOfBirth: '',
      mailingAddress: '',
      goals: '',
      honorCode: false,
      termsOfService: false,
      levelOfEducation: '',
      confirmEmail: '',
      errors: {
        email: '',
        name: '',
        username: '',
        password: '',
        country: '',
        gender: '',
        yearOfBirth: '',
        levelOfEducation: '',
        honorCode: '',
        termsOfService: '',
        city: '',
        mailingAddress: '',
        goals: '',
        confirmEmail: '',
      },
      emailValid: false,
      nameValid: false,
      usernameValid: false,
      passwordValid: false,
      countryValid: false,
      honorCodeValid: false,
      termsOfServiceValid: false,
      cityValid: false,
      mailingAddressValid: false,
      goalsValid: false,
      confirmEmailValid: false,
      levelOfEducationValid: false,
      genderValid: false,
      yearOfBirthValid: false,
      formValid: false,
    };
  }

  componentDidMount() {
    this.props.fetchRegistrationForm();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const params = (new URL(document.location)).searchParams;
    const payload = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
      name: this.state.name,
    };

    const validityMap = REGISTRATION_VALIDITY_MAP;
    Object.keys(validityMap).forEach((key) => {
      const value = validityMap[key];
      if (value) {
        payload[key] = this.state[camelCase(key)];
      }
    });
    const next = params.get('next');
    const courseId = params.get('course_id');
    if (next) {
      payload.next = params.next;
    }
    if (courseId) {
      payload.course_id = params.course_id;
    }

    if (!this.state.formValid) {
      Object.entries(payload).forEach(([key, value]) => {
        this.validateInput(key, value);
      });
      return;
    }
    this.props.registerNewUser(payload);
  }

  handleOnChange(e) {
    const targetValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.setState({
      [camelCase(e.target.name)]: targetValue,
    });
    this.validateInput(e.target.name, targetValue);
  }

  validateInput(inputName, value) {
    const { errors } = this.state;
    let {
      emailValid,
      nameValid,
      usernameValid,
      passwordValid,
      countryValid,
      honorCodeValid,
      termsOfServiceValid,
      cityValid,
      mailingAddressValid,
      goalsValid,
      confirmEmailValid,
      levelOfEducationValid,
      genderValid,
      yearOfBirthValid,
    } = this.state;

    switch (inputName) {
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        errors.email = emailValid ? '' : null;
        break;
      case 'name':
        nameValid = value.length >= 1;
        errors.name = nameValid ? '' : null;
        break;
      case 'username':
        usernameValid = value.length >= 2 && value.length <= 30;
        errors.username = usernameValid ? '' : null;
        break;
      case 'password':
        passwordValid = value.length >= 8 && value.match(/\d+/g);
        errors.password = passwordValid ? '' : null;
        break;
      case 'country':
        countryValid = value !== '';
        errors.country = countryValid ? '' : null;
        break;
      case 'city':
        cityValid = value !== '';
        errors.city = cityValid ? '' : null;
        break;
      case 'mailing_address':
        mailingAddressValid = value !== '';
        errors.mailingAddress = mailingAddressValid ? '' : null;
        break;
      case 'goals':
        goalsValid = value !== '';
        errors.goals = goalsValid ? '' : null;
        break;
      case 'honor_code':
        honorCodeValid = value !== false;
        errors.honorCode = honorCodeValid ? '' : null;
        break;
      case 'terms_of_service':
        termsOfServiceValid = value !== false;
        errors.termsOfService = termsOfServiceValid ? '' : null;
        break;
      case 'confirm_email':
        confirmEmailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        errors.confirmEmail = confirmEmailValid && (this.state.email === this.state.confirmEmail) ? '' : null;
        break;
      case 'level_of_education':
        levelOfEducationValid = value !== '';
        errors.levelOfEducation = levelOfEducationValid ? '' : null;
        break;
      case 'gender':
        genderValid = value !== '';
        errors.gender = genderValid ? '' : null;
        break;
      case 'year_of_birth':
        yearOfBirthValid = value !== '';
        errors.yearOfBirth = yearOfBirthValid ? '' : null;
        break;
      default:
        break;
    }

    this.setState({
      errors,
      emailValid,
      nameValid,
      usernameValid,
      passwordValid,
      countryValid,
      cityValid,
      mailingAddressValid,
      goalsValid,
      honorCodeValid,
      termsOfServiceValid,
      confirmEmailValid,
      levelOfEducationValid,
      genderValid,
      yearOfBirthValid,
    }, this.validateForm);
  }

  validateForm() {
    const {
      emailValid,
      nameValid,
      usernameValid,
      passwordValid,
    } = this.state;

    const validityMap = REGISTRATION_VALIDITY_MAP;
    const validStates = [];
    Object.keys(validityMap).forEach((key) => {
      const value = validityMap[key];
      if (value) {
        const state = camelCase(key);
        const stateValid = `${state}Valid`;
        validStates.push(stateValid);
      }
    });
    let extraFieldsValid = true;
    validStates.forEach((value) => {
      extraFieldsValid = extraFieldsValid && this.state[value];
    });

    this.setState({
      formValid: emailValid && nameValid && usernameValid && passwordValid && extraFieldsValid,
    });
  }

  addExtraFields() {
    const fields = this.props.formData.fields.map((value) => {
      const field = value;
      if (field.required === true && REGISTRATION_EXTRA_FIELDS.includes(field.name)) {
        const stateVar = camelCase(field.name);
        let options = null;
        let beforeLink;
        let link;
        let linkText;
        let afterLink;

        const props = {
          id: field.name,
          name: field.name,
          type: field.type,
          value: this.state[stateVar],
          required: true,
          onChange: e => this.handleOnChange(e),
        };

        REGISTRATION_VALIDITY_MAP[field.name] = true;
        if (field.type === 'checkbox') {
          const matches = processLink(field.label);
          [beforeLink, link, linkText, afterLink] = matches;
          props.checked = this.state[stateVar];
          return (
            <ValidationFormGroup
              for={field.name}
              invalid={this.state.errors[stateVar] !== ''}
              invalidMessage={field.errorMessages.required}
              className="custom-control"
            >
              <Input {...props} />
              <Link // eslint-disable-line  jsx-a11y/anchor-is-valid
                beforeLink={beforeLink}
                link={link}
                linkText={linkText}
                afterLink={afterLink}
              />
            </ValidationFormGroup>
          );
        }
        if (field.type === 'select') {
          options = field.options.map((item) => ({
            value: item.value,
            label: item.name,
          }));
          props.options = options;
        }
        return (
          <ValidationFormGroup
            for={field.name}
            invalid={this.state.errors[stateVar] !== ''}
            invalidMessage={field.errorMessages.required}
          >
            <label htmlFor={field.name} className="h6 pt-3">{field.label} (required)</label>
            <Input {...props} />
          </ValidationFormGroup>
        );
      }
      return (<></>);
    });
    return fields;
  }

  render() {
    if (!this.props.formData) {
      return <div />;
    }
    return (
      <>
        <RedirectLogistration
          success={this.props.registrationResult.success}
          redirectUrl={this.props.registrationResult.redirectUrl}
        />
        <div className="logistration-container d-flex flex-column align-items-center mx-auto" style={{ width: '30rem' }}>
          {this.props.registrationError ? <RegistrationFailure errors={this.props.registrationError} /> : null}
          <div className="mb-4">
            <FontAwesomeIcon className="d-block mx-auto fa-2x" icon={faGraduationCap} />
            <h4 className="d-block mx-auto">Start learning now!</h4>
          </div>
          <div className="d-block mb-4">
            <span className="d-block mx-auto mb-4 section-heading-line">Create an account using</span>
            <button type="button" className="btn-social facebook"><FontAwesomeIcon className="mr-2" icon={faFacebookF} />Facebook</button>
            <button type="button" className="btn-social google"><FontAwesomeIcon className="mr-2" icon={faGoogle} />Google</button>
            <button type="button" className="btn-social microsoft"><FontAwesomeIcon className="mr-2" icon={faMicrosoft} />Microsoft</button>
            <span className="d-block mx-auto text-center mt-4 section-heading-line">or create a new one here</span>
          </div>

          <form className="mb-4 mx-auto form-group">
            <ValidationFormGroup
              for="email"
              invalid={this.state.errors.email !== ''}
              invalidMessage="Enter a valid email address that contains at least 3 characters."
            >
              <label htmlFor="email" className="h6 pt-3">Email (required)</label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder=""
                value={this.state.email}
                onChange={e => this.handleOnChange(e)}
                required
              />
            </ValidationFormGroup>
            <ValidationFormGroup
              for="name"
              invalid={this.state.errors.name !== ''}
              invalidMessage="Enter your full name."
            >
              <label htmlFor="name" className="h6 pt-3">Full Name (required)</label>
              <Input
                name="name"
                id="name"
                type="text"
                placeholder=""
                value={this.state.name}
                onChange={e => this.handleOnChange(e)}
                required
              />
            </ValidationFormGroup>
            <ValidationFormGroup
              for="username"
              invalid={this.state.errors.username !== ''}
              invalidMessage="Username must be between 2 and 30 characters long."
            >
              <label htmlFor="username" className="h6 pt-3">Public Username (required)</label>
              <Input
                name="username"
                id="username"
                type="text"
                placeholder=""
                value={this.state.username}
                onChange={e => this.handleOnChange(e)}
                required
              />
            </ValidationFormGroup>
            <ValidationFormGroup
              for="password"
              invalid={this.state.errors.password !== ''}
              invalidMessage="This password is too short. It must contain at least 8 characters. This password must contain at least 1 number."
            >
              <label htmlFor="password" className="h6 pt-3">Password (required)</label>
              <Input
                name="password"
                id="password"
                type="password"
                placeholder=""
                value={this.state.password}
                onChange={e => this.handleOnChange(e)}
                required
              />
            </ValidationFormGroup>
            {this.addExtraFields()}
            <span>By creating an account, you agree to the <a href="https://www.edx.org/edx-terms-service">Terms of Service and Honor Code</a> and you acknowledge that edX and each Member process your personal data in accordance with the <a href="https://www.edx.org/edx-privacy-policy">Privacy Policy</a>.</span>
            <Button
              className="btn-primary mt-4 submit"
              onClick={this.handleSubmit}
              inputRef={(input) => {
                this.button = input;
              }}
            >
              Create Account
            </Button>
          </form>
          <div className="text-center mb-2 pt-2">
            <span>Already have an edX account?</span>
            <a href="/login"> Sign in.</a>
          </div>
        </div>
      </>
    );
  }
}
RegistrationPage.defaultProps = {
  registrationResult: null,
  registerNewUser: null,
  registrationError: null,
  formData: null,
};


RegistrationPage.propTypes = {
  registerNewUser: PropTypes.func,
  registrationResult: PropTypes.shape({
    redirectUrl: PropTypes.string,
    success: PropTypes.bool,
  }),
  registrationError: PropTypes.shape({
    email: PropTypes.array,
    username: PropTypes.array,
  }),
  fetchRegistrationForm: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    fields: PropTypes.array,
  }),
};

const mapStateToProps = state => {
  const registrationResult = registrationRequestSelector(state);
  return {
    registrationResult,
    registrationError: state.logistration.registrationError,
    formData: state.logistration.formData,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchRegistrationForm,
    registerNewUser,
  },
)(RegistrationPage);
