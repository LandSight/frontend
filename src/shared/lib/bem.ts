import { withNaming } from '@bem-react/classname';

const reactBemNaming = { e: '__', m: '--', v: '_' };

export const cn = withNaming(reactBemNaming);

export const withPrefix = (prefix: string) => withNaming({ n: `${prefix}--`, ...reactBemNaming });

export const cnCanary = withPrefix('canary');
export const cnDeprecated = withPrefix('deprecated');
