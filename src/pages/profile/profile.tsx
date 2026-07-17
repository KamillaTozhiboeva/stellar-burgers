import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { ProfileUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user)
      setFormValue({ name: user.name, email: user.email, password: '' });
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={
        formValue.name !== user?.name ||
        formValue.email !== user?.email ||
        !!formValue.password
      }
      handleInputChange={handleInputChange}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
    />
  );
};
