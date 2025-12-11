// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface Props {
  className?: string;
  value: string;
}

interface ForumLinkResult {
  url: string;
  linkText: string;
}

/**
 * Unescapes common HTML entities.
 */
function unescapeHtml (str: string): string {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

/**
 * Parses a string to extract a forum.xx.network link from an anchor tag.
 * Returns the link info only if:
 * 1. The string contains only a single anchor tag (with optional whitespace)
 * 2. The href points to forum.xx.network
 */
function parseForumLink (value: string): ForumLinkResult | null {
  // Unescape HTML entities first
  const unescaped = unescapeHtml(value);

  // Handle both properly quoted href="url" and malformed href="url (missing closing quote)
  // Use (.*?) for link text to allow <> characters in the text
  const anchorRegex = /^\s*<a\s+href=["']([^"'>]+)["']?[^>]*>(.*?)<\/a>\s*$/i;
  const match = unescaped.match(anchorRegex);

  if (!match) {
    return null;
  }

  const [, url, linkText] = match;

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname === 'forum.xx.network' || parsedUrl.hostname.endsWith('.forum.xx.network')) {
      return { linkText: linkText || url, url };
    }
  } catch {
    // Invalid URL
  }

  return null;
}

/**
 * Renders text, converting forum.xx.network anchor tags to clickable links.
 * Only renders as a link if the value is solely an anchor tag pointing to forum.xx.network.
 */
function ForumLink ({ className, value }: Props): React.ReactElement<Props> {
  const forumLink = parseForumLink(value);

  if (forumLink) {
    return (
      <a
        className={className}
        href={forumLink.url}
        rel='noopener noreferrer'
        target='_blank'
      >
        {forumLink.linkText}
      </a>
    );
  }

  return <>{value}</>;
}

export default React.memo(ForumLink);
