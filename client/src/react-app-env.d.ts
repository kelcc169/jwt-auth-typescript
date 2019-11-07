/// <reference types="react-scripts" />
import { RouteComponentProps } from 'react-router-dom';
import { IAuthenticated } from '../../src/models/user';

export interface ISetTokens extends RouteComponentProps {
  setToken: Function;
}

export interface IUser extends mongoose.Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  library: string;
  authenticated: IAuthenticated;
}