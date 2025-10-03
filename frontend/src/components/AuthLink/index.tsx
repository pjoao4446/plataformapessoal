import type { LinkProps } from 'react-router-dom';
import { StyledLink } from './styles.ts';

type AuthLinkProps = LinkProps;

export function AuthLink(props: AuthLinkProps) {
  return <StyledLink {...props} />;
}