'use client';

import Link from 'next/link';
import { SubmitEvent } from 'react';

import { useRecruiterAccount } from '../_hooks/useRecruiterAccount';

import FormButton from '@/src/components/ui/form-button';

export function RecruiterAccountCard() {
  const { error, isSubmitting, onCreateAccount } = useRecruiterAccount();

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreateAccount();
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_1px_3px_rgba(73,81,93,0.2)]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <h1 className="text-center text-2xl font-bold text-tertiary leading-none">
          Acesso para recrutadores
        </h1>

        <p className="text-center text-sm text-primary">
          Clique no botão abaixo para gerar automaticamente uma conta de
          demonstração com dados fictícios. Você será conectado direto ao painel
          e a conta expira em 24 horas.
        </p>

        {error && (
          <span role="alert" className="input-error-message">
            {error}
          </span>
        )}

        <FormButton isSubmitting={isSubmitting}>
          Criar conta de demonstração
        </FormButton>

        <div className="flex justify-center text-sm text-primary">
          Já tem conta?
          <Link href="/login" className="link ml-1">
            Entrar
          </Link>
        </div>

        <div className="flex justify-center text-sm text-primary">
          Prefere criar manualmente?
          <Link href="/register" className="link ml-1">
            Criar conta
          </Link>
        </div>
      </form>
    </div>
  );
}
