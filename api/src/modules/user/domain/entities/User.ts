import { randomUUID } from "crypto";
import { ValidationError } from "@/shared/errors/ValidationError";

export interface UserProps {
  name: string;
  email: string;
  password: string;
}

export interface RestoreUserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private _id: string;
  private _name: string;
  private _email: string;
  private _password: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._password = password;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  
  static create(props: UserProps): User {
    const now = new Date();
    return new User(
      randomUUID(),
      props.name,
      props.email,
      props.password,
      now,
      now,
    );
  }

  
  static restore(props: RestoreUserProps): User {
    return new User(
      props.id,
      props.name,
      props.email,
      props.password,
      props.createdAt,
      props.updatedAt,
    );
  }

  

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  

  set name(value: string) {
    this._name = value;
  }

  set email(value: string) {
    this._email = value;
  }

  set password(value: string) {
    this._password = value;
  }

  

  
  changeName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError("O nome não pode ser vazio.");
    }
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  
  changeEmail(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new ValidationError("O email não pode ser vazio.");
    }
    this._email = email;
    this._updatedAt = new Date();
  }

  
  changePassword(hashedPassword: string): void {
    if (!hashedPassword || hashedPassword.trim().length === 0) {
      throw new ValidationError("A senha não pode ser vazia.");
    }
    this._password = hashedPassword;
    this._updatedAt = new Date();
  }
}
