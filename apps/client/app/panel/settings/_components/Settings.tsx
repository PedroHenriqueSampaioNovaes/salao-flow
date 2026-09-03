'use client';

import { FormProvider } from 'react-hook-form';

import { useSettingsForm } from '../_hooks/useSettingsForm';

import PageHeader from '../../_components/PageHeader';

import AccountFields from './AccountFields';
import BusinessFields from './BusinessFields';
import BookingPageField from './BookingPageField';
import SocialMediaFields from './SocialMediaFields';
import PasswordFields from './PasswordFields';

export default function Settings() {
  const { methods, onSubmit } = useSettingsForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <PageHeader
          title="Configurações"
          description="Gerencie seus dados de acesso, as informações do negócio e os canais em que seus clientes encontram você."
        />

        <div className="flex flex-col gap-6">
          <AccountFields />
          <BusinessFields />
          <BookingPageField />
          <SocialMediaFields />
          <PasswordFields />
        </div>
      </form>
    </FormProvider>
  );
}
