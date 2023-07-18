'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import useAuth from '@/hooks/useAuth';

import AuthModalInputs from './AuthModalInputs';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

interface IProps {
  isSignIn?: boolean;
}

export default function AuthModal({ isSignIn }: IProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [inputs, setInputs] = useState({
    first_name: '',
    last_name: '',
    city: '',
    email: '',
    password: '',
    phone: '',
  });

  const [isDisabled, setDisabled] = useState(true);

  const { signIn } = useAuth();

  useEffect(() => {
    if (isSignIn) {
      if (inputs.email && inputs.password) return setDisabled(false);
    } else {
      if (
        inputs.first_name &&
        inputs.last_name &&
        inputs.city &&
        inputs.email &&
        inputs.password &&
        inputs.phone
      )
        return setDisabled(false);
    }

    return setDisabled(true);
  }, [inputs, isSignIn]);

  const renderContent = (signInContent: string, signUpContent: string) =>
    isSignIn ? signInContent : signUpContent;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (isSignIn) {

      await signIn({ email: inputs.email, password: inputs.password });
    } else {
      // await signUp(inputs);
    }
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className={renderContent(
          'bg-blue-400 text-white border p-1 px-4 rounded mr-3',
          'border p-1 px-4 rounded'
        )}
      >
        {renderContent('Sign In', 'Sign Up')}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="p-2 h-[600px]">
            <div className="uppercase font-bold text-center pb-2 border-b mb-2">
              <p className="text-sm">
                {renderContent('Sign In', 'Create Account')}
              </p>
            </div>
            <div className="m-auto">
              <h2 className="text-2xl font-light text-center">
                {renderContent(
                  'Log Into Your Account',
                  'Create Your OpenTable Account'
                )}
              </h2>
              <AuthModalInputs
                inputs={inputs}
                onInputChange={handleInputChange}
                isSignIn={isSignIn}
              />
              <button
                disabled={isDisabled}
                onClick={handleSubmit}
                className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
              >
                {renderContent('Sign In', 'Create Account')}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
