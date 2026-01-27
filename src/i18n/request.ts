import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'ru', 'uz'] as const;

export default getRequestConfig(async (params) => {
    // In Next.js 15, these properties are often Promises that must be awaited
    const locale = await (params as any).locale || await (params as any).requestLocale;

    // Validate that the incoming `locale` parameter is valid
    if (!locale || !locales.includes(locale as any)) {
        notFound();
    }

    return {
        locale: locale as string,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});
