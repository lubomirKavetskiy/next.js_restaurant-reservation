import { ChangeEvent } from 'react';

interface IProps {
  inputs: {
    firstName: string;
    lastName: string;
    city: string;
    email: string;
    password: string;
    phone: string;
  };
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isSignIn?: boolean;
}

export default function AuthModalInputs({
  inputs,
  onInputChange,
  isSignIn,
}: IProps) {
  return (
    <div>
      {isSignIn ? null : (
        <div className="my-3 flex justify-between text-small">
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="First Name"
            name="firstName"
            value={inputs.firstName}
            onChange={onInputChange}
          />
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="Last Name"
            name="lastName"
            value={inputs.lastName}
            onChange={onInputChange}
          />
        </div>
      )}
      <div className="my-3 flex justify-between text-small">
        <input
          value={inputs.email}
          onChange={onInputChange}
          type="email"
          className="border rounded p-2 py-3 w-full"
          placeholder="Email"
          name="email"
        />
      </div>
      {isSignIn ? null : (
        <div className="my-3 flex justify-between text-small">
          <input
            type="tel"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="Phone Number"
            name="phone"
            value={inputs.phone}
            onChange={onInputChange}
          />
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="City"
            name="city"
            value={inputs.city}
            onChange={onInputChange}
          />
        </div>
      )}
      <div className="my-3 flex justify-between text-small">
        <input
          type="password"
          className="border rounded p-2 py-3 w-full"
          placeholder="Password"
          name="password"
          value={inputs.password}
          onChange={onInputChange}
        />
      </div>
    </div>
  );
}
