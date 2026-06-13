import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createBarbershopSchema,
  type CreateBarbershopSchema,
} from '@sistema-barbearia/validators';

import registerAction from '@/app/actions/register';
import loginAction from '@/app/actions/login';

export function useRegisterForm() {
  const { register, handleSubmit, control, formState } =
    useForm<CreateBarbershopSchema>({
      resolver: zodResolver(createBarbershopSchema),
      defaultValues: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
      },
    });

  const onSubmit = async (data: CreateBarbershopSchema) => {
    const { ok: registerOk } = await registerAction(data);

    if (!registerOk) {
      console.log('Não foi possível criar a conta');
      return;
    }

    const { ok: loginOk } = await loginAction({
      email: data.email,
      password: data.password,
    });

    if (!loginOk) {
      console.log('Não foi possível fazer login');
      return;
    }
  };

  return {
    register,
    handleSubmit,
    control,
    errors: formState.errors,
    isSubmitting: formState.isSubmitting,
    onSubmit,
  };
}
