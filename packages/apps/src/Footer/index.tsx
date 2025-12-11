// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styled from 'styled-components';

import hub from './logos/xx_hub_logotype.svg';
import Socials from './Socials';

const Container = styled('div')({
  backgroundColor: '#4F4F4F',
  color: 'white',
  fontSize: 12,
  padding: '2rem'
});

const Wrapper = styled('div')({
  margin: '0 auto',
  maxWidth: 1200
});

const FlexContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between'
});

const ListLink = styled('a')({
  '&:hover': {
    textDecoration: 'underline'
  },
  color: 'white !important',
  display: 'block',
  fontSize: 12,
  paddingBottom: '0.75rem'
});

const Link = styled('a')({
  '&:hover': {
    textDecoration: 'underline'
  },
  color: 'white !important',
  fontSize: 12,
  paddingBottom: '0.75rem'
});

const StyledButton = styled('a')(() => ({
  '&:hover': {
    backgroundColor: 'rgb(255,255,255,0.8) !important'
  },
  backgroundColor: 'white',
  borderRadius: 11,
  display: 'block',
  padding: '1em 0.75em 0.75em'
}));

const Menu = styled('div')({
  margin: '0 1rem'
});

const Divider = styled('hr')({
  borderColor: '#9A9A9A',
  marginBottom: '1rem',
  marginTop: '0.5rem'
});

const Typography = styled('span')({
  lineHeight: '1.5'
});

const ResponsiveFlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Footer = () => {
  return (
    <Container>
      <Wrapper>
        <FlexContainer style={{ flexWrap: 'wrap' }}>
          <div style={{ marginBottom: '1rem' }}>
            <StyledButton
              className='ui--Button'
              href='https://hub.xx.network'
            >
              <img src={hub as string} />
            </StyledButton>
          </div>
          <FlexContainer style={{ flex: '0 0 400px' }}>
            <Menu>
              <ListLink href='/'>
                Home
              </ListLink>
              <ListLink
                href='https://xx.network/mission/'
                rel='noopener'
                target='_blank'
              >
                Mission
              </ListLink>
              <ListLink
                href='https://xx.network/resources/'
                rel='noopener'
                target='_blank'
              >
                Resources
              </ListLink>
            </Menu>
            <Menu>
              <ListLink
                href='https://xx.network/blockchain'
                rel='noopener'
                target='_blank'
              >
                xx blockchain
              </ListLink>
              <ListLink
                href='https://xx.network/messenger/'
                rel='noopener'
                target='_blank'
              >
                xx messenger
              </ListLink>
              <ListLink
                href='https://xx.network/welcome/'
                rel='noopener'
                target='_blank'
              >
                xx community
              </ListLink>
            </Menu>
            <Menu>
              <ListLink
                href='https://xx.network/whitepapers'
                rel='noopener'
                target='_blank'
              >
                Whitepapers
              </ListLink>
              <ListLink
                href='https://xx.network/faq/'
                rel='noopener'
                target='_blank'
              >
                FAQ
              </ListLink>
              <ListLink
                href='https://xx.network/contact/'
                rel='noopener'
                target='_blank'
              >
                Contact Us
              </ListLink>
            </Menu>
          </FlexContainer>
        </FlexContainer>
        <Divider />
        <ResponsiveFlexContainer>
          <FlexContainer style={{ paddingRight: '0.5rem' }}>
            <Typography>
              xx Network does not distribute, offer, solicit sales of, or sell any xx coins in any
              state or jurisdiction in which such a distribution, offer, solicitation or sale
              would be unlawful prior to registration or qualification under the securities laws
              of any such state or jurisdiction. Copyright © 2022 xx labs SEZC |{' '}
              <Link
                color='inherit'
                href='https://xx.network/privacy-policy'
                rel='noopener'
                target='_blank'
              > Privacy Policy & Term of Use
              </Link>
            </Typography>
          </FlexContainer>
          <FlexContainer>
            <Socials
              socials={{
                discord: 'https://discord.xx.network',
                github: 'xx-labs',
                telegram: 'xxnetwork',
                twitter: 'xx_network'
              }}
            />
          </FlexContainer>
        </ResponsiveFlexContainer>
      </Wrapper>
    </Container>
  );
};

export default Footer;
