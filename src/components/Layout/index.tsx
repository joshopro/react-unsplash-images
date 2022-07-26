import { Button, PageHeader, Typography } from 'antd';
import { FC, ReactNode, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const oauthUri = useMemo(
    () =>
      `https://unsplash.com/oauth/authorize?client_id=${
        process.env.REACT_APP_UNSPLACE_ACCESS_KEY
      }&redirect_uri=${encodeURIComponent(
        window.location.origin + '/callback',
      )}&response_type=code&scope=public+read_user+write_user+read_photos+write_likes+read_collections`,
    [],
  );

  const { tokens, user, setUser } = useUser();
  useEffect(() => {
    if (tokens.access_token) {
      fetch(process.env.REACT_APP_UNSPLASH_BASE_URL + '/me', {
        method: 'get',
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      })
        .then((r) => {
          if (r.ok) {
            return r.json();
          }
          return Promise.reject(r);
        })
        .then((data) => {
          setUser(data);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    }
  }, [tokens, setUser]);
  return (
    <>
      <PageHeader
        ghost={false}
        title={<Link to="/">Photos App</Link>}
        extra={
          (user && [
            <Link key="liked by me" to="/liked-by-me">
              <Button>Liked By Me</Button>
            </Link>,
            <Typography key={1}>Hi, {user.name}</Typography>,
          ]) || [
            <a key={1} href={oauthUri}>
              <Button key="1" type="primary">
                Login
              </Button>
            </a>,
          ]
        }
      ></PageHeader>
      {children}
    </>
  );
};

export default Layout;
