import { z } from 'zod';

export function passwordsMatch(data: {
  password: string;
  confirmPassword: string;
}) {
  return data.password === data.confirmPassword;
}

export const passwordsMatchRefine = {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
};

const password = z.string().min(8, 'Senha deve conter pelo menos 8 caracteres');

const urlRegex =
  /^(https?:\/\/)?(www\.)?[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+(\/\S*)?$/;
const url = () => z.string().regex(urlRegex, 'URL inválida');

export const baseBarbershopSchema = z.object({
  name: z.string().min(3, 'Nome deve conter pelo menos 3 caracteres'),
  businessName: z
    .string()
    .min(3, 'Nome do negócio deve conter pelo menos 3 caracteres'),
  email: z.email('E-mail inválido'),
  image: z.string().optional(),
  password,
  confirmPassword: z.string('Obrigatório a confirmação de senha'),
  address: z.string('Obrigatório o endereço.').min(1, 'Endereço inválido'),
  phone: z
    .string('Obrigatório o telefone')
    .regex(/^(\(?\d{2}\)?\s?)(9?\d{4})-\d{4}$/, 'Número de contato inválido'),
  timezone: z
    .string('Não foi possível obter o horário local (timezone)')
    .min(1, 'Timezone inválida'),
});

export const createBarbershopSchema = baseBarbershopSchema.refine(
  passwordsMatch,
  passwordsMatchRefine,
);

export const updateBarbershopSchema = baseBarbershopSchema
  .partial()
  .omit({ password: true })
  .extend({
    slug: z.string().optional(),
    password: password.optional().or(z.literal('')),
    currentPassword: z.string().optional(),
    facebookUrl: url().optional().or(z.literal('')),
    instagramUrl: url().optional().or(z.literal('')),
    tiktokUrl: url().optional().or(z.literal('')),
    whatsAppUrl: url().optional().or(z.literal('')),
  })
  .refine(
    (data) => !data.password || passwordsMatch(data as any),
    passwordsMatchRefine,
  );

export type CreateBarbershopSchema = z.infer<typeof createBarbershopSchema>;
export type UpdateBarbershopSchema = z.infer<typeof updateBarbershopSchema>;
