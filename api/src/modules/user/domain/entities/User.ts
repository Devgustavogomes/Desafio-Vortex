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

  /** Factory method para criação de um novo usuário.
   * Gera um ID automático e define os timestamps como agora. */
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

  /** Factory method para reconstituir um usuário existente (ex.: vindo do banco de dados). */
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

  // ─── Getters ────────────────────────────────────────────────────────────────

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

  // ─── Setters ────────────────────────────────────────────────────────────────

  set name(value: string) {
    this._name = value;
  }

  set email(value: string) {
    this._email = value;
  }

  set password(value: string) {
    this._password = value;
  }

  // ─── Métodos de domínio ──────────────────────────────────────────────────────

  /** Atualiza o nome do usuário. Lança erro se o nome for vazio. */
  changeName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError("O nome não pode ser vazio.");
    }
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  /** Atualiza o email do usuário. Lança erro se o email for vazio. */
  changeEmail(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new ValidationError("O email não pode ser vazio.");
    }
    this._email = email;
    this._updatedAt = new Date();
  }

  /** Atualiza a senha do usuário. Recebe a senha já hasheada. */
  changePassword(hashedPassword: string): void {
    if (!hashedPassword || hashedPassword.trim().length === 0) {
      throw new ValidationError("A senha não pode ser vazia.");
    }
    this._password = hashedPassword;
    this._updatedAt = new Date();
  }
}
