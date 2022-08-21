import { UsersAttributes } from '../../models/users/users.types';
import { TErrorObject, TErrorRegister } from './validations.types';

export const validateEmptyField = (object: TErrorObject) => {
  let errorResponse: TErrorObject | {} = {};

  for (const key in object) {
    if (!object[key]) {
      errorResponse = {
        ...errorResponse,
        [key]: ['This field is required'],
      };
    }
  }
  //Si algun campo requerido esta vacio
  if (Object.keys(errorResponse).length) {
    return errorResponse;
  } else {
    return false;
  }
};

export const isNumber = (num: string | number) => {
  if (typeof num === 'number') {
    return true;
  } else {
    return false;
  }
};

export const validatePassword = (password: string) => {
  const regexPasswordLowercase = new RegExp('^(?=.*[a-z]|[A-Z])');
  const regexPasswordNumeric = new RegExp('(?=.*[0-9])');
  const regexPasswordLonger = new RegExp('(?=.{8,})');
  const passError = [];
  if (!regexPasswordLowercase.test(password)) {
    passError.push('La constraseña debe tener al menos una letra');
  }
  if (!regexPasswordLonger.test(password)) {
    passError.push('La contraseña tiene que tenere minimo 8 caracteres');
  }
  if (!regexPasswordNumeric.test(password)) {
    passError.push('La constraseña debe tener al menos un numero');
  }
  return passError;
};

const registerValidations = (body: UsersAttributes) => {
  let errorResponse: TErrorRegister | {} = {};

  //Verifico Contraseña:
  const passError = validatePassword(body.password);

  if (passError.length) {
    errorResponse = { ...errorResponse, password: passError };
  }

  //Verifico roles:
  const roles = ['admin', 'client', 'developer'];
  if (!roles.includes(body.role)) {
    errorResponse = { ...errorResponse, role: ['El rol no es valido'] };
  }

  //Verifico email:
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regexEmail.test(body.email)) {
    errorResponse = {
      ...errorResponse,
      email: ['Formato de correo inválido'],
    };
  }

  return Object.keys(errorResponse).length ? errorResponse : undefined;
};

export default registerValidations;
