import { ChangeEvent } from 'react';

interface IProps {
  inputs: {
    first_name: string;
    last_name: string;
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
            name="first_name"
            value={inputs.first_name}
            onChange={onInputChange}
          />
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="Last Name"
            name="last_name"
            value={inputs.last_name}
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
            type="number"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="Phone Number"
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
