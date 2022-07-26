import { Space, Spin, Typography } from 'antd';
import { FC, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const Callback: FC<{}> = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const { setTokens } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      fetch(
        `https://unsplash.com/oauth/token?client_id=${
          process.env.REACT_APP_UNSPLACE_ACCESS_KEY
        }&client_secret=${
          process.env.REACT_APP_UNSPLACE_SECRET_KEY
        }&redirect_uri=${encodeURIComponent(
          window.location.origin + '/callback',
        )}&code=${code}&grant_type=authorization_code`,
        {
          method: 'post',
        },
      )
        .then((r) => {
          if (r.ok) {
            return r.json();
          }
          return Promise.reject(r);
        })
        .then((data) => {
          if (data.error) {
            return Promise.reject(data);
          }
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          setTokens({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          });
          navigate('/', { replace: true });
          return data;
        })
        .catch((er) => {
          // eslint-disable-next-line no-console
          console.log('error: ', er);
        });
    }
  }, [code, setTokens, navigate]);
  return (
    <Space
      direction="vertical"
      size="middle"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <Typography>Signing in the user... </Typography>
      <Spin />
    </Space>
  );
};

export default Callback;
