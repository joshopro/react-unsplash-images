import { FC, useCallback, useEffect, useState } from 'react';
import { Col, Row, Space, Spin, Typography } from 'antd';
import PhotoItem from '../PhotoItem';

import { useUser } from '../../contexts/UserContext';
import { IPhoto } from '../../types/photo';

const LikedByMe: FC<{}> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { tokens, user } = useUser();
  const [photos, setPhotos] = useState<Array<IPhoto[]>>([]);
  const keys = [1, 2, 3, 4];

  useEffect(() => {
    if (tokens.access_token && user) {
      fetch(
        `${process.env.REACT_APP_UNSPLASH_BASE_URL}/users/${user.username}/likes`,
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        },
      )
        .then((r) => {
          if (!r.ok) {
            return Promise.reject(r);
          }
          return r.json();
        })
        .then((data) => {
          const photosTwoDimension: Array<IPhoto[]> = [[], [], [], []];
          data.forEach((photo: IPhoto, i: number) => {
            photosTwoDimension[i % 4].push(photo);
          });
          setPhotos(photosTwoDimension);
        })
        .catch(() => {
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [tokens, user]);

  const updatePhoto = useCallback(
    (parentIndex: number) => (old: IPhoto, updated: IPhoto) => {
      const index = photos[parentIndex]?.indexOf(old as any);
      if (index ?? index !== -1) {
        const tmpPhotos = [...photos];
        tmpPhotos[parentIndex][index] = updated;
        setPhotos(tmpPhotos);
      }
    },
    [photos],
  );
  return (
    <div className="Container">
      <Space direction="vertical" style={{ display: 'flex' }}>
        <Typography.Title style={{ textAlign: 'center' }}>
          Liked By Me
        </Typography.Title>
        {isLoading && (
          <div className="status-content-container">
            <Spin />
          </div>
        )}
        {isError && (
          <div className="status-content-container">
            <Typography.Text type="danger">
              Error on fetching photos
            </Typography.Text>
          </div>
        )}
        <Row gutter={[16, 16]}>
          {photos.map((photoArr, i: number) => (
            <Col key={keys[i]} xs={24} sm={12} md={8} lg={6}>
              <Space direction="vertical" style={{ display: 'flex' }}>
                {photoArr.map((photo) => (
                  <PhotoItem
                    photo={photo}
                    key={photo.id}
                    updatePhoto={updatePhoto(i)}
                  />
                ))}
              </Space>
            </Col>
          ))}
        </Row>
      </Space>
    </div>
  );
};

export default LikedByMe;
