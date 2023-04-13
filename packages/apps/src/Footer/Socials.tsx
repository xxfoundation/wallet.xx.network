/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable sort-keys */
import React from 'react';
import styled from 'styled-components';

const Stack = styled('div')({
  display: 'flex',
  '& *:not(:last-child)': {
    marginBottom: '1rem'
  }
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const images = require.context('./logos/', true);

const SocialLink = styled('a')({
  '&:not(:first-child)': {
    marginLeft: '0.5rem'
  },
  display: 'inline-block',
  height: '1.25rem',
  position: 'relative',
  width: '1.25rem'
});

const SocialsLogo = styled('span')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'black',
  borderRadius: '50%'
});

const SocialsImage = styled('img')({
  width: '0.75rem'
});

type Props = {
  socials?: Record<string, unknown>;
};

const urlMappers: Record<string, (a: string) => string> = {
  twitter: (username: string) => `https://twitter.com/${username}`,
  email: (email: string) => `mailto:${email}`,
  github: (username: string) => `https://github.com/${username}`,
  telegram: (username: string) => `https://t.me/${username}`,
  discord: (code: string) => `https://discord.com/invite/${code}`
};

const possibleSocials = Object.keys(urlMappers);

export const hasSocials = (obj: Record<string, unknown>) => {
  return Object.keys(obj).some((k) => possibleSocials.includes(k));
};

const Socials: React.FC<Props> = ({ socials, ...props }) => (
  <Stack {...props}>
    {socials &&
      Object.entries(socials)
        .filter(([social]) => possibleSocials.includes(social))
        .filter(([, username]) => !!username)
        .map(
          ([social, username]) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            images(`./${social}.svg`) &&
            username &&
            typeof username === 'string' && (
              <SocialLink
                href={urlMappers[social]?.(username)}
                key={`${social}-${username}`}
                rel='noopener'
                target='_blank'
              >
                <SocialsLogo>
                  <SocialsImage
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
                    src={images(`./${social}.svg`)}
                  />
                </SocialsLogo>
              </SocialLink>
            )
        )}
  </Stack>
);

export default Socials;
