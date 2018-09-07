import gql from 'graphql-tag';

export const ME = gql`query user {
  Me {
    email
  }
}`;

export const CREATE_USER = gql`mutation createUser($name: String!, $email: String, $password: String) {
  createUser(name: $name, email: $email, password: $password) {
    name
    email
  }
}`;

export const UPDATE_OR_REGISTER_CAMERA = gql`mutation updateOrRegisterCamera($serial: String!, $camera: CameraInput) {
  updateOrRegisterCamera(serial: $serial, camera: $camera) {
    serial
    name
    ip
    owner
  }
}`;
